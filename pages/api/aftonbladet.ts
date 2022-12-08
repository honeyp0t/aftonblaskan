// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

type Data = {
  title: string,
  summary: string,
  newSummary: string
  image: any
}

const getRandomItem = (items: any[]) => {
  return items[Math.floor(Math.random() * items.length)];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {

  const cache = false
  if (cache) {
    res.status(200).json([{"title":"Elstödet och ilskan","summary":"▸ Den är här nu vintern. Kylan sprider sig över hela landet och med det så är det bara att finna sig i de skyhöga elpriserna.\nInför valet lovade det blåa blocket ett rejält elstöd och högkostnadsskydd till väljarna - men nu tre månader efter valet ser verkligheten helt annorlunda ut. Visst blir det elstöd, men inte till alla och inte lika mycket. \nDet här har också lett till inre strider inom Moderaterna, där flera kritiserar regeringens beslut om elstödet. \nHur ska elstödet egentligen fungera? Hur illa är det här för regeringen och vad kan de interna striderna inom Moderaterna leda till? Och hur sura är väljarna? \nGäst: Lena Mellin, inrikespolitisk kommentator. \nProgramledare: Jenny Ågren. \nKontakt: podcast@aftonbladet.se.","newSummary":"\n\nDet har länge rått en stor oro och ilska hos många föräldrar och deras barn när det kommer till elstödet. Stödet från staten har ofta varit för lågt och många har haft svårt att få det stöd de behöver för att kunna leva ett normalt liv.\n\nSom ett svar på detta har de senaste åren sett ett ökat antal protester och demonstrationer från föräldrar och barn som vill ha ett bättre elstöd. Ett av de största exemplen på detta är \"Elstödsdemonstrationen\" som ägde rum i Stockholm förra året.\n\nDemonstrationen samlade tusentals människor som skrek och skanderade för att få mer elstöd. De hade med sig banderoller som löd \"Vi vill ha mer elstöd!\" och \"Elstödet är inte tillräckligt!\".\n\nDemonstrationen hade stor effekt och det har nu börjat ske stora förändringar när det kommer till elstödet. Fler föräldrar och barn får nu stöd som de behöver för att kunna leva ett normalt liv.\n\nElstödet och ilskan har dock inte helt försvunnit. Många föräldrar och barn är fortfarande arga och oroliga över att elstödet inte är tillräckligt och att de inte får det stöd de behöver.\n\nMen förhoppningsvis har demonstrationen fått politikerna att inse att det är viktigt att se till att alla får det stöd de behöver för att kunna leva ett normalt liv. Det är bara genom att vi står upp för våra rättigheter som vi kan se till att det händer.","image":"https://oaidalleapiprodscus.blob.core.windows.net/private/org-Wz8CB9PFDGYH3yP3hmu6vuXZ/user-EH9EzroSUMW0u5as9Bjym9Io/img-7BhCfBYGbbXbBdQeAbsTacAU.png?st=2022-12-08T17%3A30%3A37Z&se=2022-12-08T19%3A30%3A37Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2022-12-08T16%3A19%3A24Z&ske=2022-12-09T16%3A19%3A24Z&sks=b&skv=2021-08-06&sig=n7VJxmFnThZatuBR4vFrtS7LKuivOjBtkrhLaaNth3Y%3D"}])
    return
  }

  const latestNews = await fetch('https://rss.aftonbladet.se/json/small/pages/sections/senastenytt/')
  const newsItems =  [getRandomItem((await latestNews.json())['items'])]
  const mapped: Data[] = await Promise.all(newsItems.map(async (item: any) => {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: 'Skriv en rolig artikel baserad på titeln "' +  item.title + '"',
        temperature: 0.6,
        max_tokens: 600
      });
      const summary: string = await completion.data.choices[0].text

      //const imageAttributes = ', cartoonish, funny'
      const imageAttributes = [
        ', realistic, photo',
        ', da-vinci style',
        ', 3d, lego',
        ', disney, cartoon',
        ', newspaper, old',
        ', cartoonish, funny'
      ]

      const imgResponse = await openai.createImage({
        prompt: item.title + getRandomItem(imageAttributes),
        n: 1,
        size: "512x512",
      });
      
      const imageUrl = imgResponse.data.data[0].url;

      return ({
        title: item.title,
        summary: item.summary,
        newSummary: summary,
        image: imageUrl
      })
    })
  )

  //console.log(JSON.stringify(mapped))

  res.status(200).json(mapped)
}
