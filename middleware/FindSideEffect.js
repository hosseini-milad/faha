const faktor = require("../models/product/faktor");
const faktorItems = require("../models/product/faktorItems");
const GetHesabFa = require("./GetHesabFa");

var ObjectID = require('mongodb').ObjectID;

const FindSideEffect=async(data,body)=>{
    var error=''
    if(body.status=="senttofactory"){
        if(!body.factory){
            return({error:"تولید کننده وارد نشده است"})
        }
    }
    if(data.status=="built"){
        if(!body.newSku){
            return({error:"کد محصول وارد نشده است"})
        }
        await faktorItems.updateOne({_id:ObjectID(data._id)},
        {$set:{waitPay:true}})
        await faktor.updateOne({faktorNo:data.faktorNo},
        {$set:{waitPay:true}})
    }
    if(body.status=="waitnig"){
        if(data.waitPay){
             return({error:"پرداخت انجام نشده است"})  
        }
        var peyk = body.peykPhone && body.peykName
        if(!body.transportCode&&!peyk){
            return({error:"اطلاعات ارسال وارد نشده است"})
        }
    }
    if(body.status=="archive"){
        const query = {
            invoice:{
                reference: '',
                date: '2018-07-17 17:30:12',
                dueDate: '2018-07-17 17:30:12',
                contactCode: '000001',
                contactTitle: 'سعید محمدی',
                note: '',
                sent: false,
                invoiceType: 0,
                status: 2,
                tag: '',
                freight: 0,
                freightPersonCode: '',
                warehouseReceiptStatus: 1,
                project: 'پروژه یک',
                salesmanCode: 10001,
                salesmanPercent: 30,
                currency: 'IRR',
                invoiceItems: [{
                    rowNumber: 1,
                    description: 'Galaxy J7 گوشی سامسونگ',
                    itemCode: '000001',
                    unit: 'عدد',
                    quantity: 1,
                    unitPrice: 100000,
                    discount: 0,
                    tax: 9000,
                    serialNumbers: ['974900098723']
                }],
            others : [
                {
                    "title": "هزینه های گمرکی",
                    "amount": 1540000.0,
                    "add": true 
                }
            ],
            currency: "IRR",
            taxId: "",
            currencyRate: 1.0000000000
            }
        }
        const hesabResult = 0&&await GetHesabFa(query,"/invoice/save")
        
            return({error:{query,data}})
        
    }
    return(1)
}

module.exports =FindSideEffect