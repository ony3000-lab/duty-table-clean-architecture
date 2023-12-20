import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';

import { AppMain } from '@/components';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <AppMain>
        <Component {...pageProps} />
      </AppMain>
    </RecoilRoot>
  );
}
