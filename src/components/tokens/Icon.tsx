import React from 'react';
import { toRealSymbol } from '../../utils/token';
import { TokenMetadata } from '../../services/ft-contract';
import { ArrowDownWhite } from '../../components/icon';
import { ArrowDownGreen } from '../icon/Arrows';

export default function Icon({
  className = '',
  token,
  label = true,
  size = 6,
  showArrow = true,
  hover,
}: {
  className?: string;
  token: TokenMetadata;
  label?: boolean;
  size?: number | string;
  showArrow?: boolean;
  hover?: boolean;
}) {
  return (
    <div
      className={`flex items-center text-lg text-white   rounded-full ${
        hover ? 'pl-4 bg-black bg-opacity-20 cursor-pointer' : ''
      }`}
      style={{ lineHeight: 'unset' }}
    >
      {label && <p className="block text-sm">{toRealSymbol(token.symbol)}</p>}
      {showArrow && (
        <div className="pl-2 xs:pl-1 text-xs">
          {hover ? <ArrowDownGreen /> : <ArrowDownWhite />}
        </div>
      )}
      <img
        key={token.id}
        className="ml-2 xs:ml-1 h-9 w-9 xs:h-7 xs:w-7 border rounded-full border-greenLight"
        src={token.icon}
      />
    </div>
  );
}

export function IconLeft({
  className = '',
  token,
  label = true,
  size = 11,
  showArrow = true,
  hover,
}: {
  className?: string;
  token: TokenMetadata;
  label?: boolean;
  size?: number | string;
  showArrow?: boolean;
  hover?: boolean;
}) {
  return (
    <div
      className={`flex items-center text-lg text-white pr-4 rounded-full flex-shrink-0 ${
        hover ? 'bg-black bg-opacity-20 cursor-pointer' : ''
      }`}
      style={{ lineHeight: 'unset' }}
    >
      <img
        key={token.id}
        className={`mr-2 xs:ml-0 xs:mr-1 xs:relative xs:right-1 h-${size} w-${size} xs:h-7 xs:w-7 border rounded-full border-greenLight`}
        src={token.icon}
      />
      {label && (
        <p className="block text-lg xs:text-sm">{toRealSymbol(token.symbol)}</p>
      )}
      {showArrow && (
        <div className="pl-2 xs:pl-1 text-xs">
          {hover ? <ArrowDownGreen /> : <ArrowDownWhite />}
        </div>
      )}
    </div>
  );
}

export function IconLeftV3({
  className = '',
  token,
  label = true,
  size = 11,
  showArrow = true,
  hover,
}: {
  className?: string;
  token: TokenMetadata;
  label?: boolean;
  size?: number | string;
  showArrow?: boolean;
  hover?: boolean;
}) {
  return (
    <div
      className={`${className} flex items-center bg-primaryText text-white text-lg  rounded-full flex-shrink-0 pr-4 cursor-pointer  ${
        hover ? 'bg-opacity-30' : 'bg-opacity-10'
      }`}
      style={{ lineHeight: 'unset' }}
    >
      <img
        key={token.id}
        className={`mr-2 xs:ml-0 xs:mr-1 xs:relative xs:right-1 h-${size} w-${size} xs:h-7 xs:w-7 border rounded-full border-greenLight`}
        src={token.icon}
      />
      {label && (
        <p className="block text-base font-bold">
          {toRealSymbol(token.symbol)}
        </p>
      )}
      {showArrow && (
        <div className="pl-2 xs:pl-1 text-xs">
          <SelectArrowIcon
            className={`${hover ? 'text-white' : 'text-primaryText'}`}
          />
        </div>
      )}
    </div>
  );
}

function SelectArrowIcon(props: any) {
  return (
    <svg
      {...props}
      width="11"
      height="7"
      viewBox="0 0 11 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1L5.401 5L9.57143 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
