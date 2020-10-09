module.exports = (app) => {
  const checkAuth = require('../services/auth');

  const note_controller = require('../controllers/note.controller');

  // CREATE Note
  app.post('/api/note', checkAuth, note_controller.create_note);

  // Get ALL Notes
  app.get('/api/notes', checkAuth, note_controller.fetch_notes);

  // Get User Notes
  app.get('/api/notes/:id', checkAuth, note_controller.fetch_user_notes);

  // Get Single Note
  app.get('/api/note/:id', checkAuth, note_controller.find_note);

  // DELETE Note
  app.delete('/api/note/:id', checkAuth, note_controller.delete_note);

  // UPDATE Note
  app.put('/api/note/:id', checkAuth, note_controller.update_note);
};
