module.exports = (app) => {
  const checkAuth = require('../services/auth');

  const like_controller = require('../controllers/news_like.controller');

  // Like News
  app.post('/api/like_news', checkAuth, like_controller.like_news);

  // UPDATE News Like
  app.put('/api/like_news', checkAuth, like_controller.update_like);
};
