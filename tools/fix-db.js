const fs = require('fs');
let src = fs.readFileSync('data/db.js', 'utf8');
// Remove the default admin INSERT line
src = src.replace(/^\t\t`INSERT OR IGNORE INTO users\(id,name,pwd,level\) VALUES\(1,'administrator','\$\{MD5\("123456"\)\}',6\)`,\n/m, '');
fs.writeFileSync('data/db.js', src);
console.log('Removed default admin account');
