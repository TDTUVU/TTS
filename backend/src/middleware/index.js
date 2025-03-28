const auth = require('./auth');

const logger = require('./logger');

const errorHandler = require('./errorHandler');
const notFound = require('./notFound');

module.exports = {
  auth,
  logger,
  errorHandler,
  notFound
};