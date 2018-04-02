// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
export default f => (req, res, next) =>
  Promise.resolve(f(req, res, next)).catch(next);
