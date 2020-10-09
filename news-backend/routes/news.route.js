module.exports = (app) => {
  var multer = require('multer');
  var upload = multer({ dest: 'uploads/' });
  const checkAuth = require('../services/auth');
  const request = require('request');

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

  // Fetch News URL
  app.post('/api/url', checkAuth, (req, res) => {
    let response = '';
    let url = req.body.url;
    request(url, (err, resp, body) => {
      if (err) {
        response = 'error';
      } else {
        response = body;
      }
      res.send(response);
    });
  });
};
