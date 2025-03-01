const faktor = require("../models/product/faktor");
const faktorItems = require("../models/product/faktorItems");
const FloatDec = require("./FloatDec");
const ItemToDetail = require("./ItemsToDetail");
const NormalNumber = require("./NormalNumber");
var ObjectID = require('mongodb').ObjectID;

const CalcFaktorData=async(faktorNo)=>{
    
    const faktorItemDetail = await faktorItems.find({faktorNo:faktorNo})
    var totalData = ItemToDetail(faktorItemDetail)
    await faktor.updateOne({faktorNo:faktorNo},{$set:{
        totalPrice:totalData&&totalData.finalPrice,
        totalDiscount:totalData&&totalData.totalDiscount,
        totalCount:totalData&&totalData.totalCount
    }})
    const faktorResult = await faktor.findOne({faktorNo:faktorNo}).lean()
    const faktorItemResult = await faktorItems.find({faktorNo:faktorNo})
    faktorResult.items = faktorItemResult
    var canEdit = 0
    if(faktorResult.status=="edit") canEdit=1
    return({...faktorResult,canEdit})
    
}

module.exports =CalcFaktorData