import express from 'express';
import entries from './entries';

export default injection =>
  express
    .Router()
    .use('/random', (req, res) => res.send(`Hello, ${Math.random()}`))
    .use('/entries', entries(injection));
