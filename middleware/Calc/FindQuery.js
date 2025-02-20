const FindQuery=(queryData)=>{
    console.log(queryData)
    var result =[]
    for(var i=0;i<queryData.length;i++){
        result.push(queryData[i])
    }
    return(result)
}

module.exports =FindQuery