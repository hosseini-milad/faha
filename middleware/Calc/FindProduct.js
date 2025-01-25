const products = require("../../models/product/products")

const FindProduct=async(data)=>{
    const productList = await products.find({masterSku:data.sku})
    if(!productList||!productList.length) return('')
    var filterData = data.filters
    for(var i=0;i<productList.length;i++){
        var filters = productList[i].filters
        var found = 1
        for (var prop in filterData) {
            try{
                if(filters[prop] != filterData[prop]){
                    found = 0
                    break
                }
            } catch{found = 0}
        }
        if(found) return(productList[i])
    }
    return('')
}

module.exports =FindProduct