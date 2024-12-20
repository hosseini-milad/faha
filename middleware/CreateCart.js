const prepaid = require("../models/param/prepaid");
const tax = require("../models/param/tax");
const cart = require("../models/product/cart");
const products = require("../models/product/products");
const CalcPrice = require("./CalcPrice");
const FindPrice = require("./FindPrice");

const CreateCart=async(cartDetails,sku,userId)=>{
    var index = cartDetails.find(item=>item.sku==sku)
    if(!index){
        const productDetail = await products.findOne({sku:sku})
        if(!productDetail){
            return({error:"محصول پیدا نشد"})
        }
        
        const priceRaw = await FindPrice()
        
        var TAX = await tax.findOne().sort({date:-1})
        var PRE = await prepaid.findOne().sort({date:-1})
        const priceDetail = CalcPrice(productDetail,priceRaw,TAX&&TAX.percent)

        const price = priceDetail.price
        
        var mojood = productDetail.isMojood&&!productDetail.isReserve
        await cart.create({
            sku:sku,
            title:productDetail.title,
            weight:productDetail.weight,
            ayar:productDetail.ayar,
            priceDetail:priceDetail.priceDetail,
            price:mojood?price:parseFloat(PRE&&PRE.percent)*price/100,
            fullPrice:price,
            unitPrice:priceRaw,
            isMojood:productDetail.isMojood,
            isReserve:mojood?0:1,
            userId:userId
        })
    }
    else{
        return({error:'محصول در سبد وجود دارد'})
    }
    return({message:"done"})
}

module.exports =CreateCart