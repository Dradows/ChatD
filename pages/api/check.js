// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { connectToDatabase } from '../../libs/mongodb';
import { getTime } from './time.js';

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
  const prompt = JSON.parse(req.body).prompt;
  // getTime year/month/day/hour/minute
  collection.insertOne({
    ip: ip,
    question: prompt[prompt.length - 2].content,
    answer: prompt[prompt.length - 1].content,
    time: getTime(),
  });
}
