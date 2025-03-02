const customers = require("../models/auth/customers");
const faktorItems = require("../models/product/faktorItems");

var ObjectID = require('mongodb').ObjectID;

const CalcInvoice=async(invoiceData)=>{
    const faktorItemData = await faktorItems.find({faktorNo:invoiceData.faktorNo})
    const customerData = await customers.findOne({_id:ObjectID(invoiceData.userId)})
    var items = []
    for(var i=0;i<faktorItemData.length;i++){
        const fData = faktorItemData[i]
        items.push(
            {
                rowNumber: 1,
                description: fData.title,
                itemCode: fData.ItemID,
                unit: 'عدد',
                quantity: fData.count,
                unitPrice: fData.unitPrice,
                discount: fData.totalDiscount,
                tax: 0,
                serialNumbers: [fData.sku,fData.ItemID]
            }
        )
    }
    var dateNow = new Date()
    const query = {
            invoice:{
                reference: invoiceData.faktorNo,
                date: dateNow.toDateString(),
                dueDate: dateNow.toDateString(),
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