import React from 'react';
import { useState } from 'react';
import { useIntl } from 'react-intl';

import { HiOutlineExternalLink } from 'react-icons/hi';
import { useMobile } from '../../utils/device';
export default function QuestionMark(props: {
  color?: 'bright' | 'dark';
  colorhex?: string;
  className?: string;
}) {
  const { color, colorhex } = props;

  const [status, setStatus] = useState(false);
  return (
    <label
      {...props}
      onMouseOver={() => {
        setStatus(true);
      }}
      onMouseLeave={() => {
        setStatus(false);
      }}
    >
      {status || color === 'bright' ? (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.4375 9.19141C5.4375 9.50207 5.68934 9.75391 6 9.75391C6.31066 9.75391 6.5625 9.50207 6.5625 9.19141C6.5625 8.88074 6.31066 8.62891 6 8.62891C5.68934 8.62891 5.4375 8.88074 5.4375 9.19141Z"
            fill="white"
          />
          <path
            d="M6 11.25C3.105 11.25 0.75 8.895 0.75 6C0.75 3.105 3.105 0.75 6 0.75C8.895 0.75 11.25 3.105 11.25 6C11.25 8.895 8.895 11.25 6 11.25ZM6 1.50336C3.5205 1.50336 1.50336 3.5205 1.50336 6C1.50336 8.47913 3.5205 10.4966 6 10.4966C8.47913 10.4966 10.4966 8.47914 10.4966 6C10.4966 3.5205 8.47913 1.50336 6 1.50336Z"
            fill="white"
          />
          <path
            d="M6 7.89466C5.79299 7.89466 5.625 7.72666 5.625 7.51967V6.88554C5.625 6.27203 6.09374 5.8033 6.50774 5.38967C6.8111 5.08592 7.12499 4.77242 7.12499 4.5223C7.12499 3.89717 6.62024 3.38867 6 3.38867C5.36926 3.38867 4.875 3.87542 4.875 4.4968C4.875 4.7038 4.70701 4.87178 4.5 4.87178C4.29299 4.87178 4.125 4.70378 4.125 4.49678C4.125 3.4723 4.9661 2.63867 6 2.63867C7.0339 2.63867 7.875 3.48355 7.875 4.5223C7.875 5.08367 7.44937 5.50891 7.038 5.9203C6.71175 6.2458 6.37501 6.58255 6.37501 6.88516V7.51928C6.37501 7.72629 6.20701 7.89466 6 7.89466Z"
            fill="white"
          />
        </svg>
      ) : (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.4375 9.19141C5.4375 9.50207 5.68934 9.75391 6 9.75391C6.31066 9.75391 6.5625 9.50207 6.5625 9.19141C6.5625 8.88074 6.31066 8.62891 6 8.62891C5.68934 8.62891 5.4375 8.88074 5.4375 9.19141Z"
            fill={colorhex || '#7E8A93'}
          />
          <path
            d="M6 11.25C3.105 11.25 0.75 8.895 0.75 6C0.75 3.105 3.105 0.75 6 0.75C8.895 0.75 11.25 3.105 11.25 6C11.25 8.895 8.895 11.25 6 11.25ZM6 1.50336C3.5205 1.50336 1.50336 3.5205 1.50336 6C1.50336 8.47913 3.5205 10.4966 6 10.4966C8.47913 10.4966 10.4966 8.47914 10.4966 6C10.4966 3.5205 8.47913 1.50336 6 1.50336Z"
            fill={colorhex || '#7E8A93'}
          />
          <path
            d="M6 7.89466C5.79299 7.89466 5.625 7.72666 5.625 7.51967V6.88554C5.625 6.27203 6.09374 5.8033 6.50774 5.38967C6.8111 5.08592 7.12499 4.77242 7.12499 4.5223C7.12499 3.89717 6.62024 3.38867 6 3.38867C5.36926 3.38867 4.875 3.87542 4.875 4.4968C4.875 4.7038 4.70701 4.87178 4.5 4.87178C4.29299 4.87178 4.125 4.70378 4.125 4.49678C4.125 3.4723 4.9661 2.63867 6 2.63867C7.0339 2.63867 7.875 3.48355 7.875 4.5223C7.875 5.08367 7.44937 5.50891 7.038 5.9203C6.71175 6.2458 6.37501 6.58255 6.37501 6.88516V7.51928C6.37501 7.72629 6.20701 7.89466 6 7.89466Z"
            fill={colorhex || '#7E8A93'}
          />
        </svg>
      )}
    </label>
  );
}

export function QuestionMarkStaticForParaSwap(props: {
  color?: 'bright' | 'dark';
  className?: string;
  isParallelSwap?: boolean;
}) {
  const [status, setStatus] = useState<boolean>(false);
  const intl = useIntl();
  const mobile = useMobile();
  const { color, isParallelSwap } = props;

  return (
    <div
      className="relative flex"
      {...props}
      onMouseEnter={() => setStatus(true)}
      onMouseLeave={() => setStatus(false)}
    >
      <div className={`${mobile ? 'px-1' : 'px-2'}`}>
        {status || color === 'bright' ? (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.4375 9.19141C5.4375 9.50207 5.68934 9.75391 6 9.75391C6.31066 9.75391 6.5625 9.50207 6.5625 9.19141C6.5625 8.88074 6.31066 8.62891 6 8.62891C5.68934 8.62891 5.4375 8.88074 5.4375 9.19141Z"
              fill="white"
            />
            <path
              d="M6 11.25C3.105 11.25 0.75 8.895 0.75 6C0.75 3.105 3.105 0.75 6 0.75C8.895 0.75 11.25 3.105 11.25 6C11.25 8.895 8.895 11.25 6 11.25ZM6 1.50336C3.5205 1.50336 1.50336 3.5205 1.50336 6C1.50336 8.47913 3.5205 10.4966 6 10.4966C8.47913 10.4966 10.4966 8.47914 10.4966 6C10.4966 3.5205 8.47913 1.50336 6 1.50336Z"
              fill="white"
            />
            <path
              d="M6 7.89466C5.79299 7.89466 5.625 7.72666 5.625 7.51967V6.88554C5.625 6.27203 6.09374 5.8033 6.50774 5.38967C6.8111 5.08592 7.12499 4.77242 7.12499 4.5223C7.12499 3.89717 6.62024 3.38867 6 3.38867C5.36926 3.38867 4.875 3.87542 4.875 4.4968C4.875 4.7038 4.70701 4.87178 4.5 4.87178C4.29299 4.87178 4.125 4.70378 4.125 4.49678C4.125 3.4723 4.9661 2.63867 6 2.63867C7.0339 2.63867 7.875 3.48355 7.875 4.5223C7.875 5.08367 7.44937 5.50891 7.038 5.9203C6.71175 6.2458 6.37501 6.58255 6.37501 6.88516V7.51928C6.37501 7.72629 6.20701 7.89466 6 7.89466Z"
              fill="white"
            />
          </svg>
        ) : (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.4375 9.19141C5.4375 9.50207 5.68934 9.75391 6 9.75391C6.31066 9.75391 6.5625 9.50207 6.5625 9.19141C6.5625 8.88074 6.31066 8.62891 6 8.62891C5.68934 8.62891 5.4375 8.88074 5.4375 9.19141Z"
              fill="#7E8A93"
            />
            <path
              d="M6 11.25C3.105 11.25 0.75 8.895 0.75 6C0.75 3.105 3.105 0.75 6 0.75C8.895 0.75 11.25 3.105 11.25 6C11.25 8.895 8.895 11.25 6 11.25ZM6 1.50336C3.5205 1.50336 1.50336 3.5205 1.50336 6C1.50336 8.47913 3.5205 10.4966 6 10.4966C8.47913 10.4966 10.4966 8.47914 10.4966 6C10.4966 3.5205 8.47913 1.50336 6 1.50336Z"
              fill="#7E8A93"
            />
            <path
              d="M6 7.89466C5.79299 7.89466 5.625 7.72666 5.625 7.51967V6.88554C5.625 6.27203 6.09374 5.8033 6.50774 5.38967C6.8111 5.08592 7.12499 4.77242 7.12499 4.5223C7.12499 3.89717 6.62024 3.38867 6 3.38867C5.36926 3.38867 4.875 3.87542 4.875 4.4968C4.875 4.7038 4.70701 4.87178 4.5 4.87178C4.29299 4.87178 4.125 4.70378 4.125 4.49678C4.125 3.4723 4.9661 2.63867 6 2.63867C7.0339 2.63867 7.875 3.48355 7.875 4.5223C7.875 5.08367 7.44937 5.50891 7.038 5.9203C6.71175 6.2458 6.37501 6.58255 6.37501 6.88516V7.51928C6.37501 7.72629 6.20701 7.89466 6 7.89466Z"
              fill="#7E8A93"
            />
          </svg>
        )}
      </div>
      <div
        className={`border bg-cardBg rounded border-borderColor text-navHighLightText p-1 absolute ${
          status ? 'block' : 'hidden'
        } z-30 transform ${mobile ? 'left-5' : 'left-7 '} translate-y-8`}
        onMouseLeave={() => {
          setStatus(false);
        }}
        style={{
          bottom: '2px',
        }}
      >
        <p className="">
          {intl.formatMessage({ id: 'auto_router_detail_sub_1' })}
        </p>
        <p className="">
          {intl.formatMessage({ id: 'auto_router_detail_sub_2' })}
        </p>
        <p className="flex whitespace-nowrap">
          <span>{intl.formatMessage({ id: 'auto_router_detail_sub_3' })}</span>
          <a
            href="https://ref-finance.medium.com/introducing-parallel-swap-bad9c69bf206"
            target="_blank"
            className="text-blueTip flex items-center inline ml-1"
          >
            {intl.formatMessage({ id: 'introducing_parallel_swap' })}
            <span className="ml-1">
              <HiOutlineExternalLink />
            </span>
          </a>
        </p>
      </div>
    </div>
  );
}
