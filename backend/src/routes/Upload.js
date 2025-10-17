const express = require('express');
const upload = require('../utils/Storage');

const router = express.Router();

router.post('/image', upload.single('image'), (req, res) => {
  res.json({ imageUrl: req.file.path });
});

module.exports = router;