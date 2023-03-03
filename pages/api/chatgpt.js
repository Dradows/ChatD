// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Configuration, OpenAIApi } from 'openai';
import { NextRequest } from 'next/server';
import { connectToDatabase } from '../../libs/mongodb';

export default async function handler(req, res) {
  const { database } = await connectToDatabase();
  const collection = database.collection('chatD');
  let ip = '';
  if (req.headers['x-nf-client-connection-ip']) {
    ip = req.headers['x-nf-client-connection-ip'];
  } else if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'].split(',')[0];
  } else if (req.headers['x-real-ip']) {
    ip = req.headers['x-real-ip'];
  } else {
    ip = req.connection.remoteAddress;
  }
  const { prompt } = req.body;
  const configuration = new Configuration({
    apiKey: process.env.apiKey,
  });
  const openai = new OpenAIApi(configuration);
  // const response = await openai.createCompletion({
  //   model: 'text-davinci-003',
  //   prompt: prompt,
  //   max_tokens: 2000,
  // });
  const response = await openai
    .createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: prompt,
    })
    .catch(e => {
      console.log(e);
    });
  prompt.push({
    role: 'assistant',
    content: response.data.choices[0].message.content,
  });
  const result = response.data.choices[0];
  // getTime year/month/day/hour/minute

  const date = new Date();

  var offset = now.getTimezoneOffset();
  var hours = offset / 60;
  date.setHours(now.getHours() + hours + 8);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  collection.insertOne({
    ip: ip,
    prompt: prompt,
    time:
      year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second,
  });
  res.status(200).json(response.data);
}
