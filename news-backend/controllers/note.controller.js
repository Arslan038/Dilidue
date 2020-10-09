const db = require('../models');
const Note = db.notes;

// Create Note
exports.create_note = async (req, res) => {
  try {
    const lat = req.body.lat;
    const lng = req.body.lng;

    var point = { type: 'Point', coordinates: [lat, lng] };

    let newNote = {
      note: req.body.note,
      location: req.body.location,
      position: point,
      userId: req.body.user_id,
    };

    let createdNote = await Note.create(newNote);
    if (createdNote) {
      res.status(201).json({
        data: createdNote,
        message: 'Note Created Successfully',
      });
    } else {
      res.status(500).json({
        message: err.message || 'Something went wrong while creating the Note.',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get Notes List
exports.fetch_notes = async (req, res) => {
  try {
    await Note.findAll({
      include: [
        {
          model: db.users,
        },
      ],
    })
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message,
        });
      });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Something went wrong while Fetching Notes.',
    });
  }
};

// FIND Note
exports.find_note = async (req, res) => {
  try {
    await Note.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: db.users,
        },
      ],
    })
      .then((result) => {
        if (result) {
          res.status(201).json(result);
        } else {
          res.status(500).json({
            message: 'Note Not Found',
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message,
        });
      });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Something went wrong while Fetching Note.',
    });
  }
};

// FIND User Note
exports.fetch_user_notes = async (req, res) => {
  try {
    await Note.findAll({
      where: {
        userId: req.params.id,
      },
      include: [
        {
          model: db.users,
        },
      ],
    })
      .then((result) => {
        if (result) {
          res.status(201).json(result);
        } else {
          res.status(500).json({
            message: 'Note Not Found',
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message,
        });
      });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Something went wrong while Fetching Note.',
    });
  }
};

// Delete Note
exports.delete_note = async (req, res) => {
  try {
    let note = await Note.destroy({ where: { id: req.params.id } });
    if (note && note == 1) {
      res.status(201).json({
        message: 'Note Deleted Successfully',
      });
    } else {
      res.status(200).json({
        message: 'Note Not Found',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// UPDATE Note
exports.update_note = async (req, res) => {
  try {
    // Find Note from Notes
    const isNoteExists = await Note.findOne({ where: { id: req.params.id } });

    // Check If Note Exists
    if (isNoteExists) {
      // SET Body
      let note = req.body;

      // UPDATE Note RECORD
      const update = await Note.update(note, {
        where: {
          id: req.params.id,
        },
      });

      if (update && update == 1) {
        res.status(201).json({
          message: 'Note Updated Successfully.',
        });
      } else {
        res.status(500).json({
          message: 'Something went wrong.',
        });
      }
    } else {
      res.status(500).json({
        message: 'Note Not Found.',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
