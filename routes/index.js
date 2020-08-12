const express = require('express');
const router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Home', svg });
});

const svg = function (src, _prefix) {
  if (!src.match(/\.svg$/)) throw new Error("Hey! You can't do that!");

  const prefix = _prefix || 'svg';//rand(7);

  let file = fs.readFileSync(src).toString();

  // Sketch uses generic IDs that conflict...
  file = file.replace(/id="/g, `id="${prefix}-`);
  file = file.replace(/xlink:href="#/g, `xlink:href="#${prefix}-`);
  file = file.replace(/url\(#/g, `url(#${prefix}-`);

  // Give it an ID
  if (_prefix) {
    file = file.replace(/<svg/, `<svg id="${_prefix}"`);
  }
  return file;
};

module.exports = router;
