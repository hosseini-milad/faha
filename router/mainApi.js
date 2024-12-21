const express = require('express');
const router = express.Router()
const { default: fetch } = require("node-fetch");
var ObjectID = require('mongodb').ObjectID;
const auth = require("../middleware/auth");
const slider = require('../models/main/slider');
const authApi = require('./authApi');
const taskApi = require('./taskApi');
const yasApi = require('./yasApi');
const appApi = require('./appApi');
const cartApi= require('./cartApi');
const settingApi = require('./settingApi');
const productApi = require('./productApi');
const formApi = require('./formApi');
const paymentApi = require('./paymentApi');
const userApi = require('./userApi');
const panelUserApi = require('./panelUserApi')
const CRMPanelApi = require('./panelCrmApi')
const panelOrderApi = require('./panelOrderApi')
const panelProductApi = require('./panelProductApi')
const panelFaktorApi = require('./faktorApi')
const sepidarFetch = require('../middleware/Sepidar');
const products = require('../models/product/products');
const productPrice = require('../models/product/productPrice');
const productCount = require('../models/product/productCount');
const customers = require('../models/auth/customers');
const schedule = require('node-schedule');
const bankAccounts = require('../models/product/bankAccounts');
const updateLog = require('../models/product/updateLog');
const state = require('../models/main/state');
const city = require('../models/main/city');
const quickCart = require('../models/product/quickCart');
const price = require('../models/price');
const GetHesabFa = require('../middleware/GetHesabFa');
const { ONLINE_URL} = process.env;
 
router.get('/main', async (req,res)=>{
    try{
        const sliders = await slider.find()

        //logger.warn("main done")
        res.json({sliders:sliders})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.use('/auth', authApi)
router.use('/task', taskApi)
router.use('/setting', settingApi)
router.use('/app', appApi)
router.use('/cart', cartApi)
router.use('/product', productApi)
router.use('/form', formApi)
router.use('/user', userApi)
router.use('/payment',paymentApi)

router.use('/yas', yasApi)
router.use('/panel/user', panelUserApi)
router.use('/panel/order', panelOrderApi)
router.use('/panel/product', panelProductApi)
router.use('/panel/faktor', panelFaktorApi)
router.use('/esale', panelFaktorApi)

router.use('/panel/crm',CRMPanelApi)

 schedule.scheduleJob('*/2 * * * *', async() => { 
    try{
    var response = await fetch(process.env.ONLINE_PRICE,{method: 'GET'})
    const result = await response.json();
    var priceValue = result&&result.geram18
    priceValue&&await price.create({price:priceValue.value,date:Date.now()});
    }
    catch(error){
        console.log(error)
    }
 })
 schedule.scheduleJob('*/10 * * * *', async() => { 
    try{
        var response = 0&&await fetch(ONLINE_URL + "/get-product",
        { method: 'POST' });
    }catch{}
 })
 router.get('/get-customers', async (req,res)=>{
    try{
        const customerList = await GetHesabFa(
            {"queryInfo":{take:200,skip:0}},"/contact/getcontacts")
        var result = []
        if(customerList&&customerList.Success)
            result = customerList.Result.List

        var outPut = []
        var updateCustomer = 0
        var newCustomer = 0
        for(var i=1;i<result.length;i++){
            
            if(result[i]){
            outPut.push(result[i])
            var query = {username:result[i].Name,
                phone:result[i].Mobile,
                groupCode:result[i].NodeName,
                active:result[i].Active,
                cCode:result[i].Code, 
                birthDay:result[i].BDate,
                city:result[i].City,
                Address:result[i].Address,
                postalCode:result[i].PostalCode,
                meliCode:result[i].NationalCode,
                Credits:result[i].Credits,
                Liability:result[i].Liability}
                
            var updateResult = await customers.updateOne({phone:result[i].Mobile},
                {$set:query}
            )
            if(!updateResult.matchedCount){
                newCustomer++
                await customers.create(query)
            }
            if(updateResult.modifiedCount){
                updateCustomer++
            }
            }
        }
        res.json({updateCustomer,newCustomer})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/get-product', async (req,res)=>{
    try{
        const productList = await GetHesabFa(
            {"queryInfo":{take:1000,skip:0}},"/item/getitems")
            var result = []
        if(productList&&productList.Success)
            result = productList.Result.List

        var outPut = []
        var updateProduct = 0
        var newProduct = 0
        for(var i=1;i<result.length;i++){
            if(result[i]){
            outPut.push(result[i])
            var query = {title:result[i].SalesTitle,
                sku:result[i].ProductCode,
                ItemID:result[i].Code,
                unit:result[i].Unit,
                stock:result[i].Stock,
                buyPrice:result[i].BuyPrice,
                sellPrice:result[i].SellPrice,
                nodeId:result[i].NodeId,
                nodeName:result[i].NodeName,
                active:result[i].Active,
                priceList:result[i].PriceList}
            var updateResult = await products.updateOne({sku:result[i].Code},
                {$set:query}
            )
            if(!updateResult.matchedCount){
                newProduct++
                await products.create(query)
            }
            if(updateResult.modifiedCount){
                updateProduct++
            }
            }
        }
        res.json({updateProduct,newProduct})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/sepidar-update-log', async (req,res)=>{
    try{ 
        const sepidarLog = await updateLog.find({}).sort({"date":-1})
        
        res.json({log:sepidarLog,message:"done"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})



module.exports = router;