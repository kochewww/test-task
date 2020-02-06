/* function to cut ./ and .// from imports */
function changeImport(file) {
  return (file = file.replace(/\.\.[/]/g, "").replace(/\.[/]/g, ""));
}

var fs = require("fs");
/*enter any directory here*/
var walkPath = "./src";
/*walking through directories*/
var walk = function(dir, done) {
  fs.readdir(dir, function(error, list) {
    if (error) {
      return done(error);
    }
    /*loop over files*/
    var i = 0;

    (function next() {
      var file = list[i++];

      if (!file) {
        return done(null);
      }

      file = dir + "/" + file;

      fs.stat(file, function(error, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(error) {
            next();
          });
        } else {
          /*reading file and use function to mutate imports*/
          fs.readFile(file, "utf8", function(err, data) {
            if (err) {
              return console.log(err);
            }
            var result = changeImport(data);
            /* overwriting the file*/
            fs.writeFile(file, result, "utf8", function(err) {
              if (err) return console.log(err);
            });
          });
          console.log(file);

          next();
        }
      });
    })();
  });
};

// optional command line params
//      source for walk path
process.argv.forEach(function(val, index, array) {
  if (val.indexOf("source") !== -1) {
    walkPath = val.split("=")[1];
  }
});

console.log("-------------------------------------------------------------");
console.log("processing...");
console.log("-------------------------------------------------------------");

walk(walkPath, function(error) {
  if (error) {
    throw error;
  } else {
    console.log(
      "-------------------------------------------------------------"
    );
    console.log("finished.");
    console.log(
      "-------------------------------------------------------------"
    );
  }
});
