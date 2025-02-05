const customers = require("../models/auth/customers");
const transactions = require("../models/param/transaction");
const cart = require("../models/product/cart");
const faktor = require("../models/product/faktor");
const faktorItems = require("../models/product/faktorItems");
const products = require("../models/product/products");
const FloatDec = require("./FloatDec");
const NormalNumber = require("./NormalNumber");
var ObjectID = require('mongodb').ObjectID;

const CalcCart=async(userId,manageId)=>{
    var totalPrice = 0
    var totalCount = 0
    const cartDetails = await cart.find({userId:userId}).lean()
    for(var c=0;c<cartDetails.length;c++){
<<<<<<< HEAD
        unitPrice = Number(cartDetails[c].unitPrice)
        totalPrice += unitPrice*cartDetails[c].count
        totalCount += cartDetails[c].count
=======
        unitPrice = cartDetails[c].unitPrice
        totalCount += cartDetails[c].count
        totalPrice += parseFloat(cartDetails[c].price)*cartDetails[c].count
>>>>>>> accbe9d550b030354772706e5cd5ae54814da912
    }
    return({cart:cartDetails,
        cartDetail: {
            "totalCount":totalCount,
            "cartDiscount": 0,
            "cartCount":totalCount,
            "cartPrice": totalPrice
        }
    })
}

module.exports =CalcCart