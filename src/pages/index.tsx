import type { NextPage } from 'next';
import Head from 'next/head';

import UrlForm from '../components/url-form';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>СЖАТО</title>
        <meta name="description" content="URL shortener" />

        <link rel="preload" href="/fonts/Glass_TTY_VT220.ttf" as="font" crossOrigin="anonymous" type="font/ttf" />

        {/* TODO: make proper favicons for everything */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black min-h-screen grid place-items-center">
        <h1 className="font-glassTTYVT220 text-white text-[80px]">СЖАТО</h1>
        <UrlForm />
      </main>
    </div>
  );
}

export default Home;
