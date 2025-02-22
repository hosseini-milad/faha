const ItemToDetail=async(items)=>{
    var result = {
        totalCount:0,
        totalPrice:0,
        totalDiscount:0,
        finalPrice:0
    }
    if(!items||!items.length) return(result)
    for(var i=0;i<items.length;i++){
        result.totalCount += items[i].count
        var totalD = totalPriceCalc(items[i].unitPrice,items[i].discount)
        result.totalDiscount += totalD
        var totalC = totalPriceCalc(items[i].unitPrice,items[i].count)
        result.totalPrice += totalC
        result.finalPrice += totalC-totalD
    }
    return(result)
}

const totalPriceCalc=(price,count)=>{
    if(!price||!count) return(0)
    var priceInt = Number(price)
    var countInt = Number(count)
    return(priceInt*countInt)
}
module.exports =ItemToDetail