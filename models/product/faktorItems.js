const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const FaktorItems = new Schema({
    faktorNo:{ type: String },
    initDate: { type: Date, default: Date.now },
    cName:{ type: String },
    transportType:{ type: String },
    transportTypeFa:{ type: String },
    transportCode:{ type: String },
    peykName:{ type: String },
    peykPhone:{ type: String },
    factory:{ type: String },
    invoiceId:{ type: String },
    
    phone:{ type: String },
    status:{ type: String },
    enTitle:{ type: String },
    progressDate: { type: Date },
    sku:{ type: String },
    newSku:{ type: String },
    
    discount:{ type: String }, 
    price:{ type: String }, 
    prePaid:{ type: String },
    unitPrice:{ type: String },
    fullPrice:{type:String},
    priceDetail:{ type: Object },

    weight:{ type: String },
    newWeight:{ type: String },
    ayar:{type:String},
    title:{ type: String },
    purchaseType:{type:String},
    lab:{type:String},
    riang:{type:String},
    count:{type:Number},
    description:{type:String},
    result:{ type: Object },

    isActive:{ type: Boolean },
    isEdit:{ type: Boolean },
    isMojood:{ type: Boolean },
    isReserve:{type:Boolean},

    payStatus:{ type: String }, //unpaid, deposit , paid
    waitPay:{type:Boolean},
    purchase:{type:Boolean,default:false},
    deposit:{ type: String },
    depositDate:{ type: Date },
    depositTransaction:{ type: String },
    
    finalPay:{ type: String },
    finalDate:{ type: Date },
    finalTransaction:{ type: String }
})
module.exports = mongoose.model('faktorItems',FaktorItems);