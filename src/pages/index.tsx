import type { NextPage } from 'next';
import Head from 'next/head';

import UrlForm from '../components/url-form';
import Scanlines from '../components/scanlines';
import Header from '../components/header';

const Home: NextPage = () => {
  return (
    <div>

      <Head>
        <title>СЖАТО - URL shortener</title>
        <meta name="description" content="URL shortener" />

        <link rel="preload" href="/fonts/Glass_TTY_VT220.ttf" as="font" crossOrigin="anonymous" type="font/ttf" />
        <link rel="preload" href="/fonts/Orden_Regular.woff2" as="font" crossOrigin="anonymous" type="font/woff" />

        {/* TODO: make proper favicons for everything */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black min-h-screen grid place-items-center">
        <Scanlines />
        <Header />
        <UrlForm />
      </main>

    </div>
  );
}

export default Home;
