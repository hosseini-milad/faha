const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title:  { type: String},
    sku: { type: String , unique: true},
    ItemID:{ type: String , unique: true},
    enTitle:String,
    weight:String,
    imageUrl: {type:String},
    thumbUrl: {type:String},
    offer:Boolean,
    range:Array,
    rangeText:String,
    description:String,
    productUrl:String,
    metaTitle:String,
    productMeta:String,
    fullDesc:String,
    stock:Number,
    buyPrice:Number,
    sellPrice:Number,
    active:{type:Boolean,default:false},
    unit:String,
    nodeName:String,
    nodeId:Number,
    isMaster:{type:Boolean,default:false},
    priceList:{type:Array,default:[]}, 
    categories:{type:Array,default:[]}
})
module.exports = mongoose.model('product',ProductSchema);