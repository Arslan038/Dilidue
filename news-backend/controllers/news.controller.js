const db = require('../models');
const News = db.news;
const Uploads = require('../services/upload');

exports.create_news = async (req, res) => {
  try {
    let urlImage = null;
    // IF Image Exists in Request
    if (req.file != null) {
      urlImage = await Uploads.uploadImage(req.file.path);
    }

    const lat = req.body.lat;
    const lng = req.body.lng;

    var point = { type: 'Point', coordinates: [lat, lng] };

    let news = {
      title: req.body.title,
      contributor: req.body.contributor,
      location: req.body.location,
      url: req.body.url,
      image: urlImage,
      status: req.body.status,
      position: point,
      userId: req.body.user_id,
    };

    let createdNews = await News.create(news);
    if (createdNews) {
      res.status(201).json({
        data: createdNews,
        message: 'News Created Successfully',
      });
    } else {
      res.status(500).json({
        message: err.message || 'Something went wrong while creating the News.',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get News List
exports.fetch_news = async (req, res) => {
  try {
    await News.findAll({
      include: [
        {
          model: db.users,
        },
        {
          model: db.news_likes,
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
      message: err.message || 'Something went wrong while Fetching News.',
    });
  }
};

// FIND News
exports.find_news = async (req, res) => {
  try {
    await News.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((result) => {
        if (result) {
          res.status(201).json(result);
        } else {
          res.status(500).json({
            message: 'News Not Found',
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
      message: err.message || 'Something went wrong while Fetching News.',
    });
  }
};

// DELETE News
exports.delete_news = async (req, res) => {
  try {
    let news = await News.destroy({ where: { id: req.params.id } });
    if (news && news == 1) {
      res.status(201).json({
        message: 'News Deleted Successfully',
      });
    } else {
      res.status(200).json({
        message: 'News Not Found',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// UPDATE News
exports.update_news = async (req, res) => {
  try {
    // Find News from News
    const isNewsExists = await News.findOne({ where: { id: req.params.id } });

    // Check If News Exists
    if (isNewsExists) {
      // SET Body
      let news = req.body;
      let urlImage = '';

      // IF Image Exists in Request
      if (req.file != null) {
        urlImage = await Uploads.uploadImage(req.file.path);
        news.image = urlImage;
      }

      if (req.body.lat && req.body.lng) {
        const lat = req.body.lat;
        const lng = req.body.lng;

        var point = { type: 'Point', coordinates: [lat, lng] };
        news.position = point;
      }

      // UPDATE News RECORD
      const update = await News.update(news, {
        where: {
          id: req.params.id,
        },
      });

      if (update && update == 1) {
        res.status(201).json({
          message: 'News Updated Successfully.',
          data: news,
        });
      } else {
        res.status(500).json({
          message: 'Something went wrong.',
        });
      }
    } else {
      res.status(500).json({
        message: 'News Not Found.',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
