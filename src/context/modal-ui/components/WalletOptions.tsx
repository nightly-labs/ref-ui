import React, { Fragment, useEffect, useState } from 'react';
import type {
  WalletSelector,
  ModuleState,
  Wallet,
} from '@near-wallet-selector/core';

import { InjectedWallet } from '@near-wallet-selector/core';

import type { ModalOptions } from '../modal.types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useClientMobile } from '../../../utils/device';
import { ACCOUNT_ID_KEY } from '../../WalletSelectorContext';
import { walletIcons } from '../../walletIcons';
import { walletsRejectError } from '../../../utils/wallets-integration';
import { Checkbox, CheckboxSelected } from '../../../components/icon';

const walletOfficialUrl = {
  'NEAR Wallet': 'wallet.near.org',
  Sender: 'sender.org',
  'Math Wallet': 'mathwallet.org',
  Nightly: 'nightly.app',
  'Nightly Connect': 'nightly.app',
  Ledger: 'ledger.com',
  WalletConnect: 'walletconnect.com',
  MyNearWallet: 'mynearwallet.com',
  'Meteor Wallet': 'wallet.meteorwallet.app',
  'NETH Account': 'neth.app',
};

const SelectedIcon = () => {
  return (
    <div className="left-1 bottom-1 relative">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10" cy="10" r="9.5" fill="#00C6A2" stroke="#1D2932" />
        <path
          d="M6 10.5L8.66667 13L14 8"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

const Installed = () => {
  return (
    <div
      className="bg-white bg-opacity-10 relative bottom-6 left-4 pl-2 pr-6 pt-6 rounded-lg text-primaryText"
      style={{
        fontSize: '10px',
      }}
    >
      <FormattedMessage id="installed" defaultMessage={'installed'} />
    </div>
  );
};

const Beta = () => {
  return (
    <div
      className="bg-farmText px-1 relative right-px top-px rounded-md"
      style={{
        color: '#01121D',
        fontSize: '8px',
      }}
    >
      <FormattedMessage id="beta" defaultMessage={'Beta'} />
    </div>
  );
};

const notSupportingIcons = [
  walletIcons['sender'],
  // walletIcons['math-wallet'],
  // walletIcons['nightly'],
  walletIcons['ledger'],
  // walletIcons['nightly-connect'],
  // walletIcons['wallet-connect'],
];

interface WalletOptionsProps {
  selector: WalletSelector;
  options: ModalOptions;
  onWalletNotInstalled: (module: ModuleState) => void;
  onConnectHardwareWallet: () => void;
  onConnected: () => void;
  onConnecting: (wallet?: Wallet) => void;
  onError: (error: Error) => void;
}
export const WalletSelectorFooter = () => {
  const intl = useIntl();

  return (
    <div className="flex items-center pt-5 justify-center text-xs">
      <span className="text-xs">
        <FormattedMessage
          id="first_time_using_ref"
          defaultMessage="First time using Ref"
        />
        ?
      </span>
      <div
        className="ml-2 cursor-pointer hover:underline font-bold"
        onClick={() => {
          window.open('https://ref.finance', '_blank');
        }}
        style={{
          textDecorationThickness: '0.5px',
        }}
      >
        {intl.formatMessage({
          id: 'learn_more',
          defaultMessage: 'Learn more',
        })}
      </div>
    </div>
  );
};

export const WalletOptions: React.FC<WalletOptionsProps> = ({
  selector,
  options,
  onWalletNotInstalled,
  onError,
  onConnectHardwareWallet,
  onConnecting,
  onConnected,
}) => {
  const { selectedWalletId } = selector.store.getState();
  const [modules, setModules] = useState<Array<ModuleState>>([]);
  const [checkedStatus, setCheckedStatus] = useState<boolean>(
    selectedWalletId ? true : false
  );

  useEffect(() => {
    const subscription = selector.store.observable.subscribe((state) => {
      setModules(state.modules);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWalletClick = (module: ModuleState) => async () => {
    try {
      const currentWallet = await window.selector.wallet();

      await currentWallet.signOut();
    } catch (error) {
      console.log(error.message);

      if (walletsRejectError.includes(error.message)) {
        // window.location.reload();
        onError(error.message);
        return;
      }
    }

    try {
      const { available } = module.metadata;

      if (module.id === 'neth' && isMobile && !available) {
        // open neth tip
        onConnecting();

        return;
      }

      if (module.type === 'injected' && !available) {
        return onWalletNotInstalled(module);
      }

      const wallet = await module.wallet();

      onConnecting(wallet);

      if (wallet.type === 'hardware') {
        return onConnectHardwareWallet();
      }

      await wallet.signIn({
        contractId: options.contractId,
        methodNames: options.methodNames,
      });

      if (
        wallet.id === 'neth' &&
        !(await wallet.getAccounts())[0].accountId &&
        available
      ) {
        return onConnecting();
      }

      if (wallet.type !== 'browser') {
        onConnected();
      }
    } catch (err) {
      if (module.id === 'neth' && isMobile && module.metadata.available) {
        // open neth tip
        onConnecting();

        return;
      }

      console.log(err);

      onError(err);
    }
  };

  const isMobile = useClientMobile();

  const [hoverOption, setHoverOption] = useState<number>(-1);
  return (
    <Fragment>
      <div
        className={`wallet-options-wrapper ${!checkedStatus ? 'hidden' : ''}`}
      >
        <ul className={'options-list'}>
          {modules.reduce<Array<JSX.Element>>(
            (result, module, currentIndex) => {
              // const { selectedWalletId } = selector.store.getState();
              const { name, description, iconUrl, deprecated } =
                module.metadata;
              const selected = module.id === selectedWalletId;
              if (
                isMobile &&
                module.type !== 'browser' &&
                module.id !== 'meteor-wallet' &&
                module.id !== 'neth'
              ) {
                return result;
              }

              const installed =
                module.type === 'injected' &&
                module.metadata.available &&
                module.id !== 'meteor-wallet';

              const isBeta = module.metadata.name === 'MyNearWallet';

              result.push(
                <li
                  key={module.id}
                  id={module.id}
                  onClick={selected ? undefined : handleWalletClick(module)}
                  className={`px-5 py-3 relative ${
                    hoverOption === currentIndex ? 'bottom-1' : ''
                  } ${!selected && installed ? 'overflow-hidden' : ''}`}
                  onMouseEnter={() => setHoverOption(currentIndex)}
                  onMouseLeave={() => setHoverOption(-1)}
                >
                  <div className="absolute top-0 right-0">
                    {selected ? (
                      <SelectedIcon />
                    ) : installed ? (
                      <Installed />
                    ) : isBeta ? (
                      <Beta />
                    ) : null}
                  </div>

                  <div
                    title={description || ''}
                    className="wallet-content flex items-center"
                  >
                    <div className="wallet-img-box">
                      <img
                        src={iconUrl}
                        alt={name}
                        style={{
                          maxWidth: '25px',
                        }}
                      />
                    </div>
                    <div className="flex items-start flex-col text-sm">
                      <span className="">
                        {name === 'NEAR Wallet' ? 'NEAR' : name}
                      </span>

                      <span className="text-xs text-primaryText official-url">
                        {walletOfficialUrl[name]}
                      </span>
                    </div>
                  </div>
                </li>
              );

              return result;
            },
            []
          )}
        </ul>
      </div>

      {isMobile && (
        <div
          className={`flex flex-col items-center mt-7 ${
            !checkedStatus ? 'hidden' : ''
          }`}
        >
          <div className="text-xs mb-4">
            <FormattedMessage
              id="wallets_below_supports_on_PC"
              defaultMessage={'Wallets below support on PC'}
            />
          </div>

          <div className="flex items-center opacity-50">
            {notSupportingIcons.map((url) => {
              return <img src={url} className="w-7 h-7 mr-4" alt="" />;
            })}
          </div>
        </div>
      )}
      {selectedWalletId ? null : (
        <CheckBoxForRisk setCheckedStatus={setCheckedStatus} />
      )}

      <WalletSelectorFooter />
    </Fragment>
  );
};

export const CheckBoxForRisk = (props: any) => {
  const { setCheckedStatus } = props;
  // <FormattedMessage id="login_risk_tip"></FormattedMessage>
  const intl = useIntl();
  const login_tip = intl.formatMessage({ id: 'login_risk_tip' });
  const [checkBoxStatus, setCheckBoxStatus] = useState(false);
  function switchCheckBox() {
    const newStatus = !checkBoxStatus;
    setCheckBoxStatus(newStatus);
    setCheckedStatus(newStatus);
  }
  return (
    <div
      className={`flex items-start ${checkBoxStatus ? 'my-4' : 'mb-4 mt-1'}`}
    >
      {checkBoxStatus ? (
        <CheckboxSelected
          className="relative flex-shrink-0 mr-3 top-1 cursor-pointer"
          onClick={switchCheckBox}
        ></CheckboxSelected>
      ) : (
        <Checkbox
          className="relative flex-shrink-0 mr-3 top-1 cursor-pointer"
          onClick={switchCheckBox}
        ></Checkbox>
      )}
      <span
        className="text-sm text-v3SwapGray"
        dangerouslySetInnerHTML={{ __html: login_tip }}
      ></span>
    </div>
  );
};
