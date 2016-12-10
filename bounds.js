/**
 * This takes the data already altered and add lower bound and upper bound components,
 * see issue #4 on https://github.com/buonomo/polyfinal.
 */

var fs = require("fs")
var vm = require('vm')

var filename="../js/data.js"

var content = fs.readFileSync(filename)
vm.runInThisContext(content) // this adds `finals` variable

var withBounds = finals.map((el, i, self) =>{
  if (self[i+1] && el.id === self[i+1].id && el.section === self[i+1].section){
    el.upperBound = self[i+1].names[0];
  } else if (self[i -1] && el.id === self[i-1].id && el.section == self[i-1].section) {
    el.lowerBound = self[i-1].names[1];
  }
  return el
});

fs.writeFile('js/new_data.js', "var finals="+JSON.stringify(withBounds), 'utf8', (err) => {
    if (err) throw err;
    console.log('file js/new_data.js saved')
});
