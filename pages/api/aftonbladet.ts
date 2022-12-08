// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const latestNews = await fetch('https://rss.aftonbladet.se/json/small/pages/sections/senastenytt/')
  const newsItems = (await latestNews.json())['items']

  res.status(200).json(newsItems)
}
