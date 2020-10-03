module.exports = (app) => {
  var multer = require('multer');
  var upload = multer({ dest: 'uploads/' });
  const checkAuth = require('../services/auth');

  const news_controller = require('../controllers/news.controller');

  // CREATE NEWS
  app.post(
    '/api/news',
    upload.single('image'),
    checkAuth,
    news_controller.create_news
  );

  // Get ALL News
  app.get('/api/news', checkAuth, news_controller.fetch_news);

  // Get Single News
  app.get('/api/news/:id', checkAuth, news_controller.find_news);

  // DELETE NEWS
  app.delete('/api/news/:id', checkAuth, news_controller.delete_news);

  // UPDATE NEWS
  app.put(
    '/api/news/:id',
    upload.single('image'),
    checkAuth,
    news_controller.update_news
  );
};
