import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../db/prisma-client';

async function fetchUrl (req: NextApiRequest, res: NextApiResponse) {
  const slug = req.query["slug"];

  if (typeof slug !== "string" || !slug) {
    res.status(404).json({ message: "No slug sent. Please provide a slug to dereference saved URL."});
    return;
  }

  const data = await prisma.Url.findFirst({
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  if (!data) {
    res.setHeader("Content-Type", "application/json");

    res.setHeader("Access-Control-Allow-Origin", "*");

    // RFC2616 recommends delta of one year or 31536000 seconds a maximum s-maxage
    res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate");

    res.status(404).json({ message: "No short URL for this slug found." });

    return;
  }

  res.json(data);

  return;
}

export default fetchUrl;