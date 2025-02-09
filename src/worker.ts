import { keyStores, Near } from 'near-api-js';
import db, { FarmDexie, TokenPrice } from './store/RefDatabase';
import getConfig from './services/config';
import { TokenMetadata } from '~services/ft-contract';
import { Farm, Seed, FarmBoost } from '~services/farm';
import { PoolRPCView } from '~services/api';
import { BigNumber } from 'bignumber.js';
import { STABLE_POOL_ID, STABLE_POOL_USN_ID } from './services/near';
import moment from 'moment';

const config = getConfig();
const { REF_TOKEN_ID, XREF_TOKEN_ID, REF_FARM_BOOST_CONTRACT_ID } = getConfig();

const MAX_PER_PAGE = 100;

const near = new Near({
  keyStore: new keyStores.InMemoryKeyStore(),
  headers: {},
  ...config,
});

const farmView = ({
  methodName,
  args = {},
}: {
  methodName: string;
  args?: object;
}) => {
  return near.connection.provider
    .query({
      request_type: 'call_function',
      finality: 'final',
      account_id: config.REF_FARM_CONTRACT_ID,
      method_name: methodName,
      args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
    })
    .then(({ result }) => JSON.parse(Buffer.from(result).toString()));
};
const getTokens = async () => {
  return await fetch(config.indexerUrl + '/list-token', {
    method: 'GET',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
  })
    .then((res) => res.json())
    .then((tokens) => {
      return tokens;
    });
};

const getFarms = (page: number) => {
  const MAX_PER_PAGE = 300;
  const index = (page - 1) * MAX_PER_PAGE;

  return farmView({
    methodName: 'list_farms',
    args: { from_index: index, limit: MAX_PER_PAGE },
  });
};

const cacheTokens = async () => {
  const tokens = await getTokens();
  const tokenArr = Object.keys(tokens).map((key) => ({
    id: key,
    icon: tokens[key].icon,
    decimals: tokens[key].decimals,
    name: tokens[key].name,
    symbol: tokens[key].symbol,
  }));
  await db.tokens.bulkPut(
    tokenArr.map((token: TokenMetadata) => ({
      id: token.id,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      icon: token.icon,
    }))
  );
};

const cacheFarmPools = async () => {
  const farms: Farm[] = await getFarms(1);
  const farmsArr = Object.keys(farms).map((key) => ({
    id: key,
    pool_id: farms[Number(key)].farm_id.slice(
      farms[Number(key)].farm_id.indexOf('@') + 1,
      farms[Number(key)].farm_id.lastIndexOf('#')
    ),
    status: farms[Number(key)].farm_status,
  }));
  await db.farms.bulkPut(
    farmsArr.map((farm: FarmDexie) => ({
      id: farm.id,
      pool_id: farm.pool_id,
      status: farm.status,
    }))
  );
};
/***boost start***/
const contractView = ({
  methodName,
  args = {},
  contract,
}: {
  methodName: string;
  args?: object;
  contract: string;
}) => {
  return near.connection.provider
    .query({
      request_type: 'call_function',
      finality: 'final',
      account_id: contract,
      method_name: methodName,
      args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
    })
    .then(({ result }: any) => JSON.parse(Buffer.from(result).toString()));
};
const get_list_seeds_info = async () => {
  return contractView({
    methodName: 'list_seeds_info',
    contract: REF_FARM_BOOST_CONTRACT_ID,
  });
};
const getPrice = async () => {
  return contractView({
    methodName: 'get_virtual_price',
    contract: XREF_TOKEN_ID,
  }).catch(() => {
    return '0';
  });
};
const get_list_seed_farms = async (seed_id: string) => {
  return contractView({
    methodName: 'list_seed_farms',
    args: { seed_id },
    contract: REF_FARM_BOOST_CONTRACT_ID,
  });
};
const getPoolsByIds = async (pool_ids: string[]): Promise<PoolRPCView[]> => {
  const ids = pool_ids.join('|');
  if (!ids) return [];
  return fetch(config.indexerUrl + '/list-pools-by-ids?ids=' + ids, {
    method: 'GET',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
  })
    .then((res) => res.json())
    .then((pools) => {
      return pools;
    })
    .catch(() => {
      return [];
    });
};
const toReadableNumber = (decimals: number, number: string = '0'): string => {
  if (!decimals) return number;

  const wholeStr = number.substring(0, number.length - decimals) || '0';
  const fractionStr = number
    .substring(number.length - decimals)
    .padStart(decimals, '0')
    .substring(0, decimals);

  return `${wholeStr}.${fractionStr}`.replace(/\.?0+$/, '');
};
async function getXrefPrice(tokenPriceList: Record<string, any>) {
  const xrefPrice = await getPrice();
  const xrefToRefRate = toReadableNumber(8, xrefPrice);
  const keyList: any = Object.keys(tokenPriceList);
  for (let i = 0; i < keyList.length; i++) {
    const tokenPrice = tokenPriceList[keyList[i]];
    if (keyList[i] == REF_TOKEN_ID) {
      const price = new BigNumber(xrefToRefRate)
        .multipliedBy(tokenPrice.price || 0)
        .toFixed();
      tokenPriceList[XREF_TOKEN_ID] = {
        price,
        symbol: 'xREF',
        decimal: tokenPrice.decimal,
      };
      break;
    }
  }
  return tokenPriceList;
}
const cacheBoost_Seed_Farms_Pools = async () => {
  // get all seeds
  let list_seeds = await get_list_seeds_info();
  // get all farms
  const farmsPromiseList: Promise<any>[] = [];
  const poolIds = new Set<string>();
  let pools: PoolRPCView[] = [];
  // filter v2 pool seeds TODO
  list_seeds = list_seeds.filter((seed: Seed) => {
    if (
      seed.seed_id.indexOf(config.REF_UNI_V3_SWAP_CONTRACT_ID) == -1 &&
      seed.seed_id.indexOf(config.REF_UNI_SWAP_CONTRACT_ID) == -1
    )
      return true;
  });
  list_seeds.forEach((seed: Seed) => {
    const { seed_id } = seed;
    if (seed_id.indexOf('@') > -1) {
      const poolId = seed_id.substring(seed_id.indexOf('@') + 1);
      poolIds.add(poolId);
    }
    farmsPromiseList.push(get_list_seed_farms(seed_id));
  });
  const list_farms: FarmBoost[][] = await Promise.all(farmsPromiseList);
  let cacheFarms: FarmBoost[] = [];
  list_farms.forEach((arr: FarmBoost[]) => {
    cacheFarms = cacheFarms.concat(arr);
  });
  pools = await getPoolsByIds(Array.from(poolIds));
  // cache farms
  const cacheFarmsData: FarmDexie[] = [];
  cacheFarms.forEach((farm: FarmBoost, index: number) => {
    const farm_id = farm.farm_id;
    cacheFarmsData.push({
      id: index.toString(),
      pool_id: farm_id.slice(
        farm_id.indexOf('@') + 1,
        farm_id.lastIndexOf('#')
      ),
      status: farm.status,
    });
  });
  db.boostFarms.bulkPut(cacheFarmsData);
  // cache seeds farms pools
  const cacheSeedsFarmsPools: any[] = [];
  list_seeds.forEach((seed: Seed, index: number) => {
    let pool: PoolRPCView = null;
    if (seed.seed_id.indexOf('@') > -1) {
      const id = seed.seed_id.substring(seed.seed_id.indexOf('@') + 1);
      pool = pools.find((p: PoolRPCView) => {
        if (+p.id == +id) return true;
      });
    }
    cacheSeedsFarmsPools.push({
      id: seed.seed_id,
      seed,
      farmList: list_farms[index],
      pool,
    });
  });
  db.cacheBoostSeeds(cacheSeedsFarmsPools);
};
const cacheTokenPrices = async (): Promise<any> => {
  const res = await fetch(config.indexerUrl + '/list-token-price', {
    method: 'GET',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
  });
  const tokenPriceList = await res.json();
  const tempMap = await getXrefPrice(tokenPriceList);
  db.cacheTokenPrices(tempMap);
};
/***boost end***/
run();

async function run() {
  // cachePools();
  cacheTokens();
  cacheFarmPools();
  cacheBoost_Seed_Farms_Pools();
  cacheTokenPrices();
}
