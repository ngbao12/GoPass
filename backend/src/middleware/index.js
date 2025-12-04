// Export all middleware
module.exports = {
  authenticate: require('./authenticate'),
  authorize: require('./authorize'),
  validate: require('./validate'),
  errorHandler: require('./errorHandler'),
  notFound: require('./notFound'),
};
