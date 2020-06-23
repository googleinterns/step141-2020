import express from 'express';
import { Message } from '@biogrid/api-interfaces';

const app = express();

const greeting: Message = { message: 'Welcome to api!' };

app.get('/api', (req: unknown, res: unknown) => {
  // res.send(greeting);
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
server.on('error', console.error);
