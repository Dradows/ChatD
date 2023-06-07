// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export async function GET(request) {
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// export default function handler(req, res) {
//   res.status(200).json({ name: 'John Doe' })
// }
