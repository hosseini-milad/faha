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
        unitPrice = Number(cartDetails[c].unitPrice)
        totalPrice += unitPrice*cartDetails[c].count
        totalCount += cartDetails[c].count
    }
    return({cart:cartDetails,
        cartDetail: {
            "totalCount":totalCount,
            "cartDiscount": 0,
            "cartPrice": totalPrice
        }
    })
}

module.exports =CalcCart