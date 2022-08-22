import { withTRPC } from '@trpc/next';
import type { AppProps } from 'next/app';
import { AppRouter } from './api/trpc/[trpc]';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }

  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // assume localhost
  return `https://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
  config() {
    return {
      url: `${getBaseUrl()}/api/trpc`,
    };
  },
  ssr: false,
})(MyApp);