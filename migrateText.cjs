const fs = require('fs');
const path = require('path');

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let i = 0;
    function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          if (file.endsWith('.jsx') || file.endsWith('.css') || file.endsWith('.html')) {
            results.push(file);
          }
          next();
        }
      });
    }
    next();
  });
}

walk(path.join(__dirname, 'src'), function(err, results) {
  if (err) throw err;
  let count = 0;
  results.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace text-white cautiously
    // Find all className="<classes>" or className={`<classes>`}
    // We will use a regex to match className strings
    let newContent = content.replace(/className=(["'{`])([^"'{`}]*?)(["'}])/g, (match, p1, p2, p3) => {
      // Check if p2 has bg-purple, bg-gradient, bg-emerald
      if (/bg-purple|bg-gradient|bg-emerald|bg-red/.test(p2)) {
        // Keep text-white
        return match;
      }
      
      // Replace text-white with text-slate-900
      let updatedP2 = p2.replace(/\btext-white\b/g, 'text-slate-900');
      // Replace text-zinc-100 with text-slate-800
      updatedP2 = updatedP2.replace(/\btext-zinc-100\b/g, 'text-slate-800');
      
      return `className=${p1}${updatedP2}${p3}`;
    });

    // Also replace in text-white that are just standard
    // Wait, the above handles simple string literals. What about template literals?
    // Let's do a more robust approach:
    // Just find 'text-white' and check the 200 characters around it for 'bg-purple' etc.
    // Or even simpler:
    
    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Updated text-white in', file);
      count++;
    }
  });
  console.log('Done mapping text-white in ' + count + ' files.');
});
