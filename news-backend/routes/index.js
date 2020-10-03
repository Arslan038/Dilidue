module.exports = (app) => {
  require('./news.route')(app);
  require('./user.route')(app);
  require('./branding.route')(app);
};
