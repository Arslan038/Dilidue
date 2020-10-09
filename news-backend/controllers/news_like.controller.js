const db = require('../models');
const Like = db.news_likes;
const News = db.news;
const User = db.users;
const { Op } = require('sequelize');

exports.like_news = async (req, res) => {
  try {
    let like = {
      action: req.body.action,
      userId: req.body.userId,
      newsId: req.body.newsId,
    };

    let createdLike = await Like.create(like);
    if (createdLike) {
      res.status(201).json({
        data: createdLike,
        message: 'Like Created Successfully',
      });
    } else {
      res.status(500).json({
        message: err.message || 'Something went wrong while creating the Like.',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// UPDATE LIKE

exports.update_like = async (req, res) => {
  try {
    // Find News from News
    const isNewsExists = await News.findOne({
      where: { id: req.body.newsId },
    });

    // Find User from Users
    const isUserExists = await User.findOne({
      where: { id: req.body.userId },
    });

    if (isNewsExists && isUserExists) {
      let like = req.body;

      // UPDATE Like RECORD
      const update = await Like.update(like, {
        where: {
          [Op.and]: [{ userId: req.body.userId }, { newsId: req.body.newsId }],
        },
      });

      if (update && update == 1) {
        res.status(201).json({
          message: 'Like Updated Successfully.',
        });
      } else {
        res.status(500).json({
          message: 'Something went wrong.',
        });
      }
    } else {
      res.status(500).json({
        message: 'Something went wrong.',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
