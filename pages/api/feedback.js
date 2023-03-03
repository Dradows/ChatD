// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Configuration, OpenAIApi } from 'openai';
import { NextRequest } from 'next/server';
import { connectToDatabase } from '../../libs/mongodb';

export default async function handler(req, res) {
  const { database } = await connectToDatabase();
  const collection = database.collection('feedback');
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
  const { feedback } = req.body;
  collection.insertOne({
    ip: ip,
    feedback: feedback,
  });
  res.status(200);
}
