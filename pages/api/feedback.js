// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Configuration, OpenAIApi } from 'openai';
import { NextRequest } from 'next/server';
import { connectToDatabase } from '../../libs/mongodb';
import { getTime } from './time.js';

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
  const { email } = req.body;
  const { user } = req.body;
  const time = getTime();
  collection.insertOne({
    ip: ip,
    user: user,
    email: email,
    time: time,
    feedback: feedback,
  });
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.status(200);
}
