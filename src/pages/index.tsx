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

        {/* TODO: make proper favicons for everything */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      </Head>

      <main className="bg-black min-h-screen">
        <Scanlines />
        <div className="bg-slate-800 flex flex-col items-center">
          <Header />
          <UrlForm />
        </div>
      </main>

    </div>
  );
}

export default Home;
