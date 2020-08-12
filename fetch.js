const fs = require('fs');
const _ = require('lodash');
const path = require('path');

var dir = '/Users/gkoberger/Downloads/'; // your directory
function getFile() {
  var files = fs.readdirSync(dir);
  files.sort(function(a, b) {
    return (
      fs.statSync(dir + a).mtime.getTime() -
      fs.statSync(dir + b).mtime.getTime()
    );
  });

  let bill;
  _.each(files, f => {
    if (f.match(/Grid view/)) {
      bill = f;
    }
  });
  return bill;
}
const file = getFile();
console.log('Copying over', file);

fs.createReadStream(path.join(dir, file)).pipe(fs.createWriteStream('data.csv'));
