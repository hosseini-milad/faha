const FindQuery=(queryData)=>{
    var result ={}
    for (var prop in queryData) {
        try{
            
            var finalFilter = queryData[prop]
            result["filters."+prop] = finalFilter
        } catch{}
    }
    var finalResult = ''
    if(result == {}){}
    else
        finalResult = result
    
    return(finalResult)
}

module.exports =FindQuery