
var fs = require('fs');

const DataToCSV=async(data)=>{

fs.writeFile('/upload/csv/result.csv', data, 'utf8', function (err) {
  if (err) {
    console.log('Some error occured - file either not saved or corrupted file saved.');
  } else{
    console.log('It\'s saved!');
  }
});
    return("https://admin.fahascrubs.com/upload/csv/result.csv")
}

module.exports =DataToCSV