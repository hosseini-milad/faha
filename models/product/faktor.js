const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const FaktorSchema = new Schema({
    faktorNo:{ type: String },
    initDate: { type: Date, default: Date.now },
    progressDate: { type: Date },
    userId:{ type: String },
    clientStatus:{ type: Object },
    manageId:{ type: String },
    customerID:{ type: String },
    status:{ type: String },

    totalPrice:{ type: String },
    fullPrice:{ type: String },
    unitPrice:{ type: String },
    priceDetail:{ type: Object },
    InvoiceID:{ type: String },
    InvoiceNumber:{ type: String },
    totalCount:{ type: String },
    totalWeight:{ type: String },
    isActive:{ type: Boolean },
    isEdit:{ type: Boolean },
    query:{ type: Object },
    waitPay:{type:Boolean},
})
module.exports = mongoose.model('faktor',FaktorSchema);