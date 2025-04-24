const { stringify } = require("csv-stringify");
var fs = require('fs');
const writableStream = fs.createWriteStream("./upload/csv/result.csv")

const DataToCSV=async(data)=>{
    const columns = [
        "Row No",
        "X",
        "Y",
        "Z"
      ];
      const stringifier = stringify({ header: true, columns: columns });
      for (var i=0;i<data.length;i++){
        stringifier.write(data[i]);
      }
      stringifier.pipe(writableStream);

    return("https://admin.fahascrubs.com/upload/csv/result.csv")
}

module.exports =DataToCSV