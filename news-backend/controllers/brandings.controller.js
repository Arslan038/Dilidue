const db = require('../models');
const Branding = db.brandings;
const Uploads = require('../services/upload');

exports.create_branding = async (req, res) => {
  try {
    let urlImage = null;
    // IF Image Exists in Request
    if (req.file != null) {
      urlImage = await Uploads.uploadImage(req.file.path);
    }

    const lat = req.body.lat;
    const lng = req.body.lng;

    var point = { type: 'Point', coordinates: [lat, lng] };

    let branding = {
      company_name: req.body.company_name,
      expert_name: req.body.expert_name,
      location: req.body.location,
      image: urlImage,
      status: req.body.status,
      position: point,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      service_title: req.body.service_title,
      service_description: req.body.service_description,
      userId: req.body.user_id,
    };

    let createdBranding = await Branding.create(branding);
    if (createdBranding) {
      res.status(201).json({
        data: createdBranding,
        message: 'Branding Created Successfully',
      });
    } else {
      res.status(500).json({
        message:
          err.message || 'Something went wrong while creating the Branding.',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get Branding List
exports.fetch_brandings = async (req, res) => {
  try {
    await Branding.findAll()
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
      message: err.message || 'Something went wrong while Fetching Brandings.',
    });
  }
};

// FIND Branding
exports.find_branding = async (req, res) => {
  try {
    await Branding.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((result) => {
        if (result) {
          res.status(201).json(result);
        } else {
          res.status(500).json({
            message: 'Branding Not Found',
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
      message: err.message || 'Something went wrong while Fetching Branding.',
    });
  }
};

// DELETE Branding
exports.delete_branding = async (req, res) => {
  try {
    let branding = await Branding.destroy({ where: { id: req.params.id } });
    if (branding && branding == 1) {
      res.status(201).json({
        message: 'Branding Deleted Successfully',
      });
    } else {
      res.status(200).json({
        message: 'Branding Not Found',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// UPDATE Branding
exports.update_branding = async (req, res) => {
  try {
    // Find Branding from Branding
    const isBrandingExists = await Branding.findOne({
      where: { id: req.params.id },
    });

    // Check If Branding Exists
    if (isBrandingExists) {
      // SET Body
      let branding = req.body;
      let urlImage = '';

      // IF Image Exists in Request
      if (req.file != null) {
        urlImage = await Uploads.uploadImage(req.file.path);
        branding.image = urlImage;
      }

      if (req.body.lat && req.body.lng) {
        const lat = req.body.lat;
        const lng = req.body.lng;

        var point = { type: 'Point', coordinates: [lat, lng] };
        branding.position = point;
      }

      // UPDATE Branding RECORD
      const update = await Branding.update(branding, {
        where: {
          id: req.params.id,
        },
      });

      if (update && update == 1) {
        res.status(201).json({
          message: 'Branding Updated Successfully.',
          data: branding,
        });
      } else {
        res.status(500).json({
          message: 'Something went wrong.',
        });
      }
    } else {
      res.status(500).json({
        message: 'Branding Not Found.',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
