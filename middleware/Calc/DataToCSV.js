
var fs = require('fs');

const DataToCSV=async(data)=>{

fs.writeFile('./upload/csv/result.csv', data, 'utf8', function (err) {
  if (err) {
    console.log(err);
  } else{
    console.log('It\'s saved!');
  }
});
    return("https://admin.fahascrubs.com/upload/csv/result.csv")
}

module.exports =DataToCSV