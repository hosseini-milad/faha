const cart = require("../models/product/cart");
const products = require("../models/product/products");

const CreateCart=async(cartDetails,sku,userId,count)=>{
    var index = cartDetails.find(item=>item.sku==sku)
    if(!index){
        const productDetail = await products.findOne({sku:sku})
        if(!productDetail){
            return({error:"محصول پیدا نشد"})
        }
        var sellPrice = Number(productDetail.sellPrice)
        var price = sellPrice*(count?count:1)
        await cart.create({
            sku:sku,
            title:productDetail.title,
            weight:productDetail.weight,
            price:price,
            unitPrice:sellPrice,
            count:count?count:1,
            userId:userId
        })
    }
    else{
        return({error:'محصول در سبد وجود دارد'})
    }
    return({message:"done"})
}

module.exports =CreateCart