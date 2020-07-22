import express from 'express';

const app = express();

app.get('/', (request, response) => response.json('serving'));

export default app;
