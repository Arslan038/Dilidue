const express = require('express');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary');
const app = express();
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

require('./routes/index')(app);

const db = require('./models');
db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Models Synced');
  })
  .catch((err) => console.log(err));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const PORT = 5000;
app.listen(process.env.PORT || PORT);
console.log('Server Listening on ' + PORT);
