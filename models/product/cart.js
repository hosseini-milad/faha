const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const CartSchema = new Schema({
    initDate: { type: Date, default: Date.now },
    progressDate: { type: Date },
    userId:{ type: String },
    description:{type:String},
    discount:{type:String},
    sku:{type:String},
    isMojood:{type:Boolean},
    isReserve:{type:Boolean},
    purchase:{type:Boolean},
    fullPrice:{type:String},
    priceDetail:{ type: Object },
    title:{type:String},
    weight:{type:String},
    ayar:{type:String},
    purchaseType:{type:String},
    lab:{type:String},
    riang:{type:String},
    count:{type:Number},
    price:{type:String},
    unitPrice:{type:String}
})
module.exports = mongoose.model('cart',CartSchema);