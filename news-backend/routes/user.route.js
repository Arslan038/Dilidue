module.exports = (app) => {
  var multer = require('multer');
  var upload = multer({ dest: 'uploads/' });
  const checkAuth = require('../services/auth');
  const passport = require('passport');

  const user_controller = require('../controllers/user.controller');

  // CREATE User
  app.post('/api/user', user_controller.create_user);

  // CREATE USER via LinkedIn
  app.get('/api/linkedin_signup', (req, res, next) => {
    const { user } = req;
    res.json(user);
  });

  // Login User
  app.post('/api/auth/login', user_controller.login);

  // Get ALL Users
  app.get('/api/users', checkAuth, user_controller.fetch_users);

  // Get Single User
  app.get('/api/user/:id', checkAuth, user_controller.find_user);

  // DELETE User
  app.delete('/api/user/:id', checkAuth, user_controller.delete_user);

  // UPDATE USER
  app.put(
    '/api/user/:id',
    upload.single('image'),
    checkAuth,
    user_controller.update_user
  );

  // UPDATE USER Password
  app.put(
    '/api/update_password/:id',
    checkAuth,
    user_controller.update_password
  );

  // LinkedIn Login
  app.get('/api/linkedin', passport.authenticate('linkedin'));

  // Callback
  app.get(
    '/return',
    passport.authenticate('linkedin', {
      successRedirect: '/api/linkedin_signup',
      failureRedirect: '/api/linkedin_signup',
    })
  );
};
