// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  const { prompt } = req.body;
  const configuration = new Configuration({
    apiKey: process.env.apiKey,
  });
  const openai = new OpenAIApi(configuration);

  const start = Date.now();

  const response = await openai
    .createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: prompt,
    })
    .catch(e => {
      console.log(e);
    });

  const end = Date.now();

  console.log(`Time taken: ${end - start} ms`);

  res.status(200).json(response.data);
}
