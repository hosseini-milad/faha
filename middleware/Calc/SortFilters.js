
const SortFilter=(FilterData)=>{
    var result ={}
    for (var prop in FilterData) {
        var tempArray = FilterData[prop]
        tempArray.sort(function(a, b) {
            var keyA = new Date(a.title),
              keyB = new Date(b.title);
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
        result[prop] = tempArray
    }
    
    return(result)
}

module.exports =SortFilter