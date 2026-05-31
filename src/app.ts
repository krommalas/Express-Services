import express from 'express';
import { testConnection } from './config/database';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.get('/', (_req, res) => {
  res.send('App is running');
});

const start = async (): Promise<void> => {
  await testConnection();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

start();
