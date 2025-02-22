const faktor = require("../models/product/faktor");
const faktorItems = require("../models/product/faktorItems");
const FloatDec = require("./FloatDec");
const ItemToDetail = require("./ItemsToDetail");
const NormalNumber = require("./NormalNumber");
var ObjectID = require('mongodb').ObjectID;

const CalcFaktorData=async(faktorNo)=>{
    const faktorDetails = await faktor.findOne({faktorNo:faktorNo})
    const faktorItemDetail = await faktorItems.find({faktorNo:faktorNo})
    var totalData = ItemToDetail(faktorItemDetail)
    return({totalData,faktorItemDetail})
    
}

module.exports =CalcFaktorData