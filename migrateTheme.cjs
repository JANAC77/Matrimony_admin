const fs = require('fs');
const path = require('path');

const mappings = {
  // Backgrounds
  "bg-zinc-950/80": "bg-white/80",
  "bg-zinc-950/50": "bg-white/50",
  "bg-zinc-950": "bg-slate-50",
  "bg-zinc-900/10": "bg-slate-100/50",
  "bg-zinc-900/20": "bg-slate-100",
  "bg-zinc-900/30": "bg-slate-200",
  "bg-zinc-900/40": "bg-slate-200/70",
  "bg-zinc-900/50": "bg-slate-200/80",
  "bg-zinc-900/60": "bg-slate-300/50",
  "bg-zinc-900/80": "bg-white/80",
  "bg-zinc-900": "bg-white",
  "bg-zinc-850": "bg-slate-200",
  "bg-zinc-800": "bg-slate-300",
  
  // Text
  "text-zinc-100": "text-slate-800",
  "text-zinc-200": "text-slate-700",
  "text-zinc-300": "text-slate-600",
  "text-zinc-400": "text-slate-500",
  "text-zinc-500": "text-slate-400",
  "text-zinc-600": "text-slate-300",

  // Borders
  "border-zinc-900": "border-slate-200",
  "border-zinc-850": "border-slate-200",
  "border-zinc-800": "border-slate-300",
  "border-zinc-700": "border-slate-400",
  "border-zinc-600": "border-slate-400",

  // Hovers
  "hover:bg-zinc-900/50": "hover:bg-slate-100/50",
  "hover:bg-zinc-900": "hover:bg-slate-100",
  "hover:text-zinc-100": "hover:text-slate-800",
  "hover:text-zinc-200": "hover:text-slate-700",
  "hover:bg-zinc-850": "hover:bg-slate-200",
  "hover:border-zinc-850": "hover:border-slate-300",
  "hover:border-zinc-800": "hover:border-slate-300",
  "hover:border-zinc-700": "hover:border-slate-400",

  // Placeholders
  "placeholder-zinc-500": "placeholder-slate-400",
  
  // Selection
  "selection:bg-zinc-800": "selection:bg-slate-300",
  "selection:text-zinc-200": "selection:text-slate-800",

  // Divide
  "divide-zinc-850": "divide-slate-200",
  "divide-zinc-800": "divide-slate-300",
};

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
    let newContent = content;
    // Replace mapped classes
    Object.keys(mappings).forEach(key => {
      // Create a regex that respects word boundaries for Tailwind classes
      // We don't want bg-zinc-900 to accidentally replace bg-zinc-900/50, 
      // so the order of keys matters (which is why keys like bg-zinc-900/50 are earlier).
      const val = mappings[key];
      // Escape slashes
      const escapedKey = key.replace(/\//g, '\\/');
      const regex = new RegExp(`(?<=[\\s"'\\\`])${escapedKey}(?=[\\s"'\\\`])`, 'g');
      newContent = newContent.replace(regex, val);
    });
    
    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Updated', file);
      count++;
    }
  });
  console.log('Done mapping zinc to slate in ' + count + ' files.');
});
