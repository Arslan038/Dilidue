module.exports = (app) => {
  var multer = require('multer');
  var upload = multer({ dest: 'uploads/' });
  const checkAuth = require('../services/auth');

  const branding_controller = require('../controllers/brandings.controller');

  // CREATE BRANDING
  app.post(
    '/api/branding',
    upload.single('image'),
    checkAuth,
    branding_controller.create_branding
  );

  // Get ALL BRANDINGS
  app.get('/api/brandings', checkAuth, branding_controller.fetch_brandings);

  // Get Single BRANDING
  app.get('/api/branding/:id', checkAuth, branding_controller.find_branding);

  // UPDATE BRANDING
  app.put(
    '/api/branding/:id',
    upload.single('image'),
    checkAuth,
    branding_controller.update_branding
  );

  // DELETE NEWS
  app.delete(
    '/api/branding/:id',
    checkAuth,
    branding_controller.delete_branding
  );
};
