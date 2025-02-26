const faktor = require("../models/product/faktor");
const faktorItems = require("../models/product/faktorItems");
const CalcInvoice = require("./CalcInvoice");
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
    if(body.status=="prepair"){
        const query = await CalcInvoice(data)
        const hesabResult = await GetHesabFa(query,"/invoice/save")
        var faktorResult=''
        if(hesabResult.Success){
            faktorResult = await faktor.updateOne({faktorNo:data.faktorNo},
            {$set:{query,result:hesabResult.Result,
                InvoiceID:hesabResult.Id,InvoiceNumber:hesabResult.Number}})
        }   
        else{
            faktorResult = await faktor.updateOne({faktorNo:data.faktorNo},
                {$set:{query,result:hesabResult.ErrorMessage}})
            return({error:query,message:hesabResult.ErrorMessage})
        }

    }
    return(1)
}

module.exports =FindSideEffect