module.exports = (app) => {
  require('./news.route')(app);
  require('./user.route')(app);
  require('./branding.route')(app);
  require('./note.route')(app);
  require('./news_like.route')(app);
};
