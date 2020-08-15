const express = require('express');
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');
const _ = require('lodash');

/* GET home page. */
router.get('/', (req, res, next) => {
  let data = [];
  fs.createReadStream('./data.csv')
    .pipe(csv())
    .on('data', (row) => {
      const r = {};
      _.each(row, (v, k) => {
        r[k.trim()] = v;
      });
      if (r.Ranking[0] !== 'X' && r['Do you have a Mozilla alumni at your company?'] == 'checked') {
        r.sort = parseInt(r['Ranking'].split('.')[0], 10) || 0;
        data.push(r);
      }
    })
    .on('end', () => {
      data = _.sortBy(data, 'sort').reverse();
      res.render('index', { title: 'Home', svg, data, json: JSON.stringify, getImage, getLink });
    });
});

const getImage = (c) => {
  try {
    return c['Company Logo'].split('(')[1].split(')')[0];
  } catch(e) {
    return false;
  }
};
const getLink = (c) => {
  let contact =  c['Mozilla Alumni Contact'];
  if (contact.indexOf('@') >= 1) {
    return `mailto:${contact}`;
  }
  if (contact.indexOf('@') == 0) {
    return `https://twitter.com/${contact}`;
  }
  return contact;
};

const svg = function (src, _prefix) {
  if (!src.match(/\.svg$/)) throw new Error("Hey! You can't do that!");

  const prefix = _prefix || 'svg';//rand(7);

  let file = fs.readFileSync(src).toString();

  // Sketch uses generic IDs that conflict...
  file = file.replace(/id="/g, `id="${prefix}-`);
  file = file.replace(/xlink:href="#/g, `xlink:href="#${prefix}-`);
  file = file.replace(/url\(#/g, `url(#${prefix}-`);

  file = file.replace(/<title>(.*)<\/title>/g, '');
  file = file.replace(/<desc>(.*)<\/desc>/g, '');
  file = file.replace(/<!--(.*?)-->/g, '');

  // Give it an ID
  if (_prefix) {
    file = file.replace(/<svg/, `<svg id="${_prefix}"`);
  }
  return file;
};

module.exports = router;
