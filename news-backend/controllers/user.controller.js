require('dotenv').config();
const db = require('../models');
const User = db.users;
const Uploads = require('../services/upload');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// CREATE USER
exports.create_user = async (req, res) => {
  try {
    const isEmailExists = await User.findAll({
      where: {
        email: req.body.email,
      },
    });
    if (isEmailExists.length) {
      res.status(500).json({
        message: 'User already exists with same Email',
      });
      return;
    }

    let user = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      role: req.body.role,
    };

    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        res.status(500).json({
          message:
            err.message || 'Something went wrong while creating the User.',
        });
      }

      user.password = hash;

      const createdUser = await User.create(user);
      if (createdUser) {
        res.status(201).json({
          data: createdUser,
          message: 'User Created Successfully',
        });
      } else {
        res.status(500).json({
          message:
            err.message || 'Something went wrong while creating the User.',
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Something went wrong while creating the User.',
    });
  }
};

// Login USER
exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    let isUserExists = await User.findOne({
      where: {
        email: email,
      },
    });

    if (isUserExists && isUserExists.password) {
      let user = isUserExists;
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res.status(404).json({
            message: 'Invalid Password.',
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              name: user.name,
              email: user.email,
              phone: user.phone,
              password: user.password,
              role: user.role,
            },
            process.env.ACCESS_TOKEN_SECRET
          );
          res.status(201).json({
            message: 'Login Successfull',
            user: user,
            token: token,
          });
        } else {
          res.status(404).json({
            message: 'Invalid Password.',
          });
        }
      });
    } else {
      res.status(404).json({
        message: 'Invalid Email or Password.',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Something went wrong while Login.',
    });
  }
};

// Get Users List
exports.fetch_users = async (req, res) => {
  try {
    await User.findAll()
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
      message: err.message || 'Something went wrong while Fetching Users.',
    });
  }
};

// FIND USER

exports.find_user = async (req, res) => {
  try {
    await User.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((result) => {
        if (result) {
          res.status(201).json(result);
        } else {
          res.status(500).json({
            message: 'User Not Found',
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
      message: err.message || 'Something went wrong while Fetching User.',
    });
  }
};

// DELETE USER
exports.delete_user = async (req, res) => {
  try {
    let user = await User.destroy({ where: { id: req.params.id } });
    if (user && user == 1) {
      res.status(201).json({
        message: 'User Deleted Successfully',
      });
    } else {
      res.status(200).json({
        message: 'User Not Found',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// UPDATE USER
exports.update_user = async (req, res) => {
  try {
    // Find User from Users
    const isUserExists = await User.findOne({ where: { id: req.params.id } });

    // Check If User Exists
    if (isUserExists) {
      // SET Body
      let user = req.body;
      let urlImage = '';

      // IF Image Exists in Request
      if (req.file != null) {
        urlImage = await Uploads.uploadImage(req.file.path);
        user.image = urlImage;
      }

      // UPDATE USER RECORD
      const update = await User.update(user, {
        where: {
          id: req.params.id,
        },
      });

      if (update && update == 1) {
        res.status(201).json({
          message: 'User Updated Successfully.',
          user: user,
        });
      } else {
        res.status(500).json({
          message: 'Something went wrong.',
        });
      }
    } else {
      res.status(500).json({
        message: 'User Not Found.',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.update_password = async (req, res) => {
  try {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        res.status(500).json({
          message:
            err.message || 'Something went wrong while creating the User.',
        });
      }
      if (hash) {
        const user = {
          password: hash,
        };

        const updatedUser = await User.update(user, {
          where: {
            id: req.params.id,
          },
        });

        if (updatedUser && updatedUser == 1) {
          res.status(201).json({
            message: 'Password Updated Successfully.',
            data: hash,
          });
        } else {
          res.status(500).json({
            message: 'Something went wrong.',
          });
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// CREATE USER VIA LINKEDIN

exports.create_via_linkedin = async (req, res) => {
  try {
    const { user } = req;
    if(user) {
      let create = {
        email: user.emails[0].value,
        name: user.displayName,
        image: user.photos[0].value,
        role: "user",
        linkedin_id: user.id
      }
      // Find User where Email = Linkedin Email and linkedin = Linkedin ID
      await User.findOne({
        where: {
          [Op.and]: [{ email: create.email }, { linkedin_id: user.id }],
        },
      })
        .then( async (result) => {
          if (result) {
            // Redirect User For Login
            res.redirect(process.env.REDIRECT_URL+"/exists/"+create.linkedin_id)
          } else {
              await User.create(create).then(() => {
                // Redirect User for Login
              res.redirect(process.env.REDIRECT_URL+"/registered/"+create.linkedin_id)
            });
          }
        })
        .catch((err) => {
          res.redirect(process.env.REDIRECT_URL+"/error")
        });
    }
  } catch (err) {
    res.redirect(process.env.REDIRECT_URL+"/error")
  }
};

// Login Social User

exports.login_linkedin_user = async (req, res) => {
  try {
    await User.findOne({
      where: {
        linkedin_id: req.params.id
      },
    }).then(user => {
      if(user) {
        const token = jwt.sign(
          {
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            role: user.role,
          },
          process.env.ACCESS_TOKEN_SECRET
        );
        res.status(201).json({
          message: 'Login Successfull',
          user: user,
          token: token,
        });
      }
      else {
        res.status(404).json({
          message: 'User Not Found.',
        });
      }
    })
  }
  catch(err) {
    res.status(500).json({
      message: err.message,
    });
  }
}
