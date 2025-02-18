const customers = require("../models/auth/customers");
const faktor = require("../models/product/faktor");
const faktorItems = require("../models/product/faktorItems");
const faktorItems = require("../models/product/faktorItems");
const GetHesabFa = require("./GetHesabFa");

var ObjectID = require('mongodb').ObjectID;

const CalcInvoice=async(invoiceData)=>{
    const faktorItems = await faktorItems.find({faktorNo:invoiceData.faktorNo})
    const customerData = await customers.findOne({_id:ObjectID(invoiceData.userId)})
    var items = []
    for(var i=0;i<faktorItems.length;i++){
        const fData = faktorItems[i]
        items.push(
            {
                rowNumber: 1,
                description: fData.title,
                itemCode: fData.sku,
                unit: 'عدد',
                quantity: fData.count,
                unitPrice: fData.unitPrice,
                discount: 0,
                tax: 0,
                serialNumbers: [fData.sku]
            }
        )
    }
    const query = {
            invoice:{
                reference: invoiceData.faktorNo,
                date: Date.now(),
                dueDate: Date.now(),
                contactCode: customerData.cCode,
                contactTitle: customerData.username,
                note: '',
                sent: false,
                invoiceType: 0,
                status: 2,
                tag: '',
                freight: 0,
                freightPersonCode: '',
                warehouseReceiptStatus: 1,
                project: 'فاحا، وب سایت',
                salesmanCode: 10001,
                salesmanPercent: 30,
                currency: 'IRR',
                invoiceItems: items,
            currency: "IRR",
            taxId: "",
            currencyRate: 1.0000000000
            }
        }
    return(query)
}

module.exports =CalcInvoice