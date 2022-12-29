// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Configuration, OpenAIApi } from 'openai';
import { NextRequest } from 'next/server';

export default async function handler(req, res) {
  console.log(NextRequest.ip);
  console.log(req.headers);
  const { prompt } = req.query;
  const configuration = new Configuration({
    apiKey: process.env.apiKey,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 4000,
  });
  const result = response.data.choices[0];
  res
    .status(200)
    .json({ text: result.text, ip: NextRequest.ip, headers: req.headers });
}
