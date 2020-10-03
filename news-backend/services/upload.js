const cloudinary = require('cloudinary');

module.exports = {
  async uploadImage(image) {
    let imgURL = null;
    try {
      imgURL = await cloudinary.uploader.upload(
        image,
        { folder: 'user_images/' },
        function (result) {},
        function (err) {
          return;
        }
      );
      if (imgURL) {
        return imgURL.url;
      } else {
        return;
      }
    } catch (err) {
      return;
    }
  },
};
