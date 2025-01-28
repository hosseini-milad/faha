const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router()
var ObjectID = require('mongodb').ObjectID;
const auth = require("../middleware/auth");
const logger = require('../middleware/logger');
const productSchema = require('../models/product/products');
const productcounts = require('../models/product/productCount');
const category = require('../models/product/category');
const cart = require('../models/product/cart');
const qCart = require('../models/product/quickCart');
const FaktorSchema = require('../models/product/faktor');
const customerSchema = require('../models/auth/customers');
const sepidarPOST = require('../middleware/SepidarPost');
const productCount = require('../models/product/productCount');
const cartLog = require('../models/product/cartLog');
const users = require('../models/auth/users');
const quickCart = require('../models/product/quickCart');
const bankAccounts = require('../models/product/bankAccounts');
const sepidarFetch = require('../middleware/Sepidar');
const products = require('../models/product/products');
const tasks = require('../models/crm/tasks');
const profiles = require('../models/auth/ProfileAccess');
const CreateTask = require('../middleware/CreateTask');
const NewCode = require('../middleware/NewCode');
const customers = require('../models/auth/customers');
const brand = require('../models/product/brand');
const FindCurrentCart = require('../middleware/CurrentCart');
const OrderToTask = require('../middleware/OrderToTask');
const IsToday = require('../middleware/IsToday');
const NewQuote = require('../middleware/NewQuote');
const CreateCart = require('../middleware/CreateCart');
const CalcCart = require('../middleware/CalcCart');
const faktorItems = require('../models/product/faktorItems');
const faktor = require('../models/product/faktor');
const slider = require('../models/main/slider');
const price = require('../models/price');
const CalcPrice = require('../middleware/CalcPrice');
const FindPrice = require('../middleware/FindPrice');
const CalcCartRecalc = require('../middleware/CalcCartRecalc');
const tax = require('../models/param/tax');
const RegisterFaktor = require('../middleware/RegisterFaktor');
const prepaid = require('../models/param/prepaid');
const NormalNumber = require('../middleware/NormalNumber');
const RegisterFaktorItem = require('../middleware/RegisterFaktorItem');
const GetTahHesab = require('../middleware/GetTahHesab');
const CreateFaktorLog = require('../middleware/CreateFaktorLog');
const CreateCartPurchase = require('../middleware/CreateCartPurchase');
const CalcPurchase = require('../middleware/CalcPurchase');
const ClientStatus = require('../middleware/ClientStatus');
const banks = require('../models/param/banks');
const SetTahHesabItem = require('../middleware/SetTahHesabItem');
const SetTransaction = require('../middleware/SetTransaction');
const CheckAccess = require('../middleware/CheckAccess');
const transaction = require('../models/param/transaction');
const CalcFaktor = require('../middleware/Calc/CalcFaktor');
const FindColor = require('../middleware/Calc/FindColor');
const FindSimilar = require('../middleware/Calc/FindSimilar');
const FindProduct = require('../middleware/Calc/FindProduct');
const {TaxRate} = process.env
router.post('/products', async (req,res)=>{
    try{
        const allProducts = await productSchema.find()

        //logger.warn("main done")
        res.json({products:allProducts})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/list-product', async (req,res)=>{
    var pageSize = req.body.pageSize?req.body.pageSize:"10";
    var offset = req.body.offset?(parseInt(req.body.offset)):0;
    const search = req.body.search
    const weight=req.body.weight
    const categoryFilter=req.body.category
    const isMaster = req.body.isMaster?req.body.isMaster:true
    const isMojood = req.body.isMojood?req.body.isMojood:false
    try{
   
        const products = await productSchema.aggregate([
            {$match:search?{$or:[
                {sku:{$regex: search, $options : 'i'}},
                {title:{$regex: search, $options : 'i'}}
            ]}:{}}, 
            { $match:categoryFilter?{categories:{$elemMatch:
                {catCode:categoryFilter.toString()}}}:{}},
            /*{$match:{imageUrl:{$exists:true}}},
            {$match:isMojood?{isMojood:true}:{}}*/
            {$match:isMaster?{isMaster:true}:{}}
        ])
        const priceRaw = await FindPrice()
        const productList = products.slice(offset,
            (parseInt(offset)+parseInt(pageSize)))  
            
        var TAX = await tax.findOne().sort({date:-1})
        for(var i=0;i<productList.length;i++){
            const fullPrice =  CalcPrice(productList[i],priceRaw,TAX&&TAX.percent)
            productList[i].price = fullPrice.price?fullPrice.price:"12300000"
        }
        const categoryList = await category.find({imageUrl:{$exists:true}})
        res.json({data:productList,type:[],
            size:products.length,success:true,
            categoryList, unitPrice:priceRaw
        })

    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/list-product-sale', async (req,res)=>{
    var pageSize = req.body.pageSize?req.body.pageSize:"10";
    var offset = req.body.offset?(parseInt(req.body.offset)):0;
    const search = req.body.search
    const weight=req.body.weight
    const categoryFilter=req.body.category
    const isMaster = req.body.isMaster?req.body.isMaster:true
    const isMojood = req.body.isMojood?req.body.isMojood:true
    const isReserve = req.body.isReserve?req.body.isReserve:false
    try{
   
        const products = await productSchema.aggregate([
            {$match:search?{$or:[
                {sku:{$regex: search, $options : 'i'}},
                {title:{$regex: search, $options : 'i'}}
            ]}:{}},
            { $match:categoryFilter?{categories:{$elemMatch:
                {catCode:categoryFilter.toString()}}}:{}},
            {$match:isMojood?{isMojood:true}:{}},
            {$match:isReserve?{isReserve:true}:{}}
        ])
        const priceRaw = await FindPrice()
        const productList = products.slice(offset,
            (parseInt(offset)+parseInt(pageSize)))  
            
        var TAX = await tax.findOne().sort({date:-1})
        for(var i=0;i<productList.length;i++){
            const fullPrice =  CalcPrice(productList[i],priceRaw,TAX&&TAX.percent)
            productList[i].price = (fullPrice&&fullPrice.price)?fullPrice.price:"12300000"
            productList[i].priceDetail = fullPrice&&fullPrice.priceDetail
        }
        const categoryList = await category.find({imageUrl:{$exists:true}})
        res.json({data:productList,type:[],hasChild:1,
            size:products.length,success:true,
            categoryList, unitPrice:priceRaw,
            subCategoryList	:[]
        })

    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/fetch-product', async (req,res)=>{
    const sku = req.body.sku
    try{
        var productData = await productSchema.findOne({sku:sku})
        if(!productData.isMaster){
            res.status(400).json({error:"محصول اصلی نیست"})
        }
        var filters = new Object()
        var productList = await productSchema.find({masterSku:sku}).lean()
        for(var f=0;f<productList.length;f++){
            if(productList[f].filters){
                var filterData = productList[f].filters
                for (var prop in filterData) {
                    if(!filters[prop])
                        filters[prop]=[]
                    var outData = await FindColor(filterData[prop])
                    if(!FindSimilar(filters&&filters[prop],outData))
                        filters[prop].push(outData)
                }
            }
        }
        res.json({mainProduct:productData,productList,filters})

    } 
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/list-filters', async (req,res)=>{
    try{
        const brandData = await brand.find()
        const catData = await category.find({parent:{$exists:false}})
        for(var i =0;i<catData.length;i++){
            var subCat = await category.find(
                {"parent._id":(catData[i]._id).toString()})
            catData[i].children = subCat
        } 
        //logger.warn("main done")
        res.json({brands:brandData,cats:catData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/find-products',auth, async (req,res)=>{
    const search = req.body.search
        const userData = await users.findOne({_id:req.headers['userid']})
        const stockId = userData.StockId?userData.StockId:"13"
        var filter =''
        //if(userData.group === "bazaryab") filter = "fs"
        const searchProducts = await productSchema.
        aggregate([{$match:
            search?{$or:[
                {sku:{$regex: search, $options : 'i'}},
                {title:{$regex: search, $options : 'i'}}
            ]}:{sku:{$exists:true}}
        },
        filter?{$match:{sku:{$in:[/fs/i,/cr/i,/pr/i]}}}:
            {$match:{sku:{$exists:true}}},
        {$lookup:{
            from : "productprices", 
            localField: "ItemID", 
            foreignField: "ItemID", 
            as : "priceData"
        }},
        {$lookup:{
            from : "productcounts", 
            localField: "ItemID", 
            foreignField: "ItemID", 
            as : "countData"
        }}])
        try{
        var searchProductResult=[]
        const cartList = {}//await cart.find(stockId?{stockId:stockId,}:{})
        var currentCart = {}//await FindCurrentCart(cartList)
        const qCartList = {}//await qCart.find(stockId?{stockId:stockId}:{})
        var index = 0
        for(var i=0;i<searchProducts.length;i++){
            var count = (searchProducts[i].countData.find(item=>item.Stock==stockId))
            var count3 = (searchProducts[i].countData.find(item=>item.Stock=="9"))
            var desc = ''
            var cartCount = 0&&findCartCount(searchProducts[i].sku,currentCart.concat(qCartList),stockId)
            if(count)count.quantity = parseInt(count.quantity)-parseInt(cartCount)
            if((count&&(count.quantity>0))||(count3&&(count3.quantity>0))){
                index++
                desc=searchProducts[i].title+
                "("+searchProducts[i].sku+")"+
                "___"+(count&&count.quantity)
            
                searchProductResult.push({...searchProducts[i],
                    count:count,description:desc})
                if(index===15)break
            }
        }
            res.json({products:searchProductResult})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/calc-count',auth, async (req,res)=>{
    const userData = await users.findOne({_id:req.headers['userid']})
    const stockId = userData.StockId?userData.StockId:"13"
    const sku = req.body.sku
    if(!sku){
        res.status(400).json({message:"not found"})
        return
    }
    try{ 
    const searchProducts = await productSchema.aggregate([
        {$match:{sku:sku}},
        {$lookup:{
            from : "productprices", 
            localField: "ItemID", 
            foreignField: "ItemID", 
            as : "priceData"
        }},
        {$lookup:{
            from : "productcounts", 
            localField: "ItemID", 
            foreignField: "ItemID", 
            as : "countData"
        }}])
        const cartList = await tasks.find({taskStep:{$nin:['archive']}})
        var currentCart = await FindCurrentCart(cartList.map(item=>item.orderNo))
        console.log(stockId)
        const qCartList = await qCart.find(stockId?{stockId:stockId}:{})
        for(var i=0;i<searchProducts.length;i++){
            var count = searchProducts[i].countData.find(item=>(item.Stock==stockId))
            var count3 = searchProducts[i].countData.find(item=>(item.Stock=="9"))
            var desc = '' 
            count = count?count:0 
            count3 = count3?count3:0
            var cartCount = findCartCount(searchProducts[i].sku,currentCart.concat(qCartList),stockId)
            //console.log(cartCount)
            const storeCount =count?parseInt(count.quantity):0
            const orderCount =parseInt(cartCount)
            if(count||count3){ 
                if(count)
                    count.quantity = storeCount-orderCount
                else if(count3)
                    count3.quantity = count3.quantity-orderCount 
                res.json({count,storeCount,orderCount,count3:count3?count3.quantity:0,
                    perBox:searchProducts[i].perBox?searchProducts[i].perBox:0})
                return
            }
            else{
                res.json({count:0,storeCount,orderCount})
                return
            }
        }
            
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
const findCartCount=(item,cart)=>{
    var cartCount =0
    for(var i=0;i<cart.length;i++){
        var cartItem =cart[i].cartItems 
        for(var c=0;c<(cartItem&&cartItem.length);c++){
            if(cartItem[c].sku === item){
                cartCount=parseInt(cartCount)+parseInt(cartItem[c].count)
            }
        }
    }
    return(cartCount)
    
}
router.post('/update-product',jsonParser,auth, async (req,res)=>{
    const data={
        title:req.body.title,
        sku:req.body.sku,
        date:Date.now()
    }
    try{
        var status = "";
        const searchProduct = await productSchema.findOne({sku:data.sku})
        if(!searchProduct){
            await productSchema.create(data)
            status = "new product"
        } 
        else{
            await productSchema.updateOne(
                {sku:data.sku},{$set:data})
            status = "update product"
        }
        const allProducts = await productSchema.find()
        //logger.warn("main done")
        res.json({products:allProducts,status:status})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/categories', async (req,res)=>{
    try{
        const allCategories = await category.find()

        //logger.warn("main done")
        res.json({categories:allCategories})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/update-category',jsonParser,auth, async (req,res)=>{
    const data={
        title:req.body.title,
        parent:req.body.parent,
        body:req.body.body,
        date:Date.now()
    }
    try{
        var status = "";
        const searchCategory = await category.findOne({catCode:req.body.catCode})
        if(!searchCategory){
            await category.create(data)
            status = "new category"
        }
        else{
            await category.updateOne(
                {catCode:req.body.catCode},{$set:data})
            status = "update category"
        }
        const allCategory = await category.find()
        res.json({categories:allCategory,status:status})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
 
router.post('/recalc-cart',auth, async (req,res)=>{
    const userId =req.body.userId?req.body.userId:req.headers['userid']
    const userData = await customers.findOne({_id:ObjectID(userId)})
    try{ 
        await CalcCartRecalc(userId)
        const clientRemain = userData&&await GetTahHesab(
            {"getmandehesabbycode":[userData.cCode]}
        )
        const clientStatus = ClientStatus(clientRemain)
        const cartDetails = await CalcCart(userId,clientStatus.remain,req.headers['userid'])
        const bankList = await banks.find()
        res.json({message:"سبد بروز شد",...cartDetails,
            clientStatus,bankList})
    }
    catch(error){ 
        res.status(500).json({message: error.message})
    }
})

router.get('/get-cart',auth, async (req,res)=>{
    const userId =req.body.userId?req.body.userId:req.headers['userid']
    try{ 
        const cartDetails = await CalcCart(userId,0,req.headers['userid'])
        res.json({...cartDetails})
    }
    catch(error){ 
        res.status(500).json({message: error.message})
    }
})

router.post('/cart',auth, async (req,res)=>{
    const userId =req.body.userId?req.body.userId:req.headers['userid']
    try{ 
        const cartDetails = await CalcCart(userId,0,req.headers['userid'])
        res.json({...cartDetails})
    }
    catch(error){ 
        res.status(500).json({message: error.message})
    }
})

router.post('/add-cart',auth,jsonParser, async (req,res)=>{
    const userId =req.body.userId?req.body.userId:req.headers['userid']
    if(!req.body.sku){
        res.status(400).json({error:"محصول وارد نشده است"})
        return
    }
    const data={
        userId:userId,
        sku:req.body.sku,
        filters:req.body.filters,
        count:req.body.count,
        date:req.body.date?req.body.date:Date.now(),
        progressDate:Date.now()
    }
    try{
        var FindProductData = await FindProduct(data)
        if(!FindProductData){
            res.status(400).json({error:"کد با فیلترها مطابقت ندارد"})
            return
        }
        data.sku = FindProductData.sku

        const userData = await users.findOne({_id:req.headers['userid']})
        const cartData = await cart.find({userId:userId})
        
        const cartItems = await CreateCart(cartData,data.sku,userId,data.count)
        if(cartItems.error){
            res.status(400).json({error:cartItems.error})
            return
        } 
        else{
            const cart = await CalcCart(userId,0,req.headers['userid'])
            res.json({...cart,message:"آیتم اضافه شد"})
            return
        } 
        //const cartDetails = await findCartFunction(userId,req.headers['userid'])
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/update-cart',auth,jsonParser, async (req,res)=>{
    const userId =req.headers['userid']
    const id = req.body.id
    if(!id){
        res.status(400).json({error:"کد سطر وارد نشده است"})
        return
    }
    const data={
        userId:userId,
        count:req.body.count,
        progressDate:Date.now()
    }
    try{
        await cart.updateOne({_id:ObjectID(id)},{$set:{count:data.count}})
        //console.log(cartDetail.priceDetail)
        
        const cartData = await CalcCart(userId,0,req.headers['userid'])
            res.json({...cartData,message:"سبد بروز شد"})
            return
        
        //const cartDetails = await findCartFunction(userId,req.headers['userid'])
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/find-purchase-price',jsonParser, async (req,res)=>{
    const priceRaw = await FindPrice()
    const data={
        ayar:req.body.ayar,
        weight:req.body.weight
    }
    const priceDetail = CalcPurchase(data.ayar,priceRaw,data.weight)
    res.json(priceDetail)
    })
router.post('/remove-cart',auth,jsonParser, async (req,res)=>{
    const id=req.body.id
    const userId=req.headers['userid']
    if(!id){
        res.status(400).json({error:"ردیف وارد نشده است"})
        return
    }
    
    try{
        if(id)await cart.deleteOne({userId:userId,_id:ObjectID(id)})
        const cartDetail = await CalcCart(userId,0,req.headers['userid'])
        res.json({...cartDetail,message:"آیتم حذف شد"})
        return
        //const cartDetails = await findCartFunction(userId,req.headers['userid'])
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/delete-cart',auth,jsonParser, async (req,res)=>{    const id=req.body.id
    const userId =req.headers['userid']
    try{
        await cart.deleteMany({userId:userId})
        
        const cartDetail = await CalcCart(userId,0,req.headers['userid'])
        res.json({...cartDetail,message:"سبد خالی شد"})
        return
        //const cartDetails = await findCartFunction(userId,req.headers['userid'])
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/cart-to-faktor',auth,jsonParser, async (req,res)=>{
    const userId =req.body.userId?req.body.userId:req.headers['userid']
    try{
        const priceRaw = await FindPrice()
        const userData = await customers.findOne({_id:userId})
        const userCode = userData.phone&&userData.phone.substr(userData.phone.length - 4)
        const faktorNo = await NewCode("z"+userCode)
        const cartDetail = await CalcCart(userId,0,req.headers['userid'])
        
        var TAX = await tax.findOne().sort({date:-1})
        var PRE = await prepaid.findOne().sort({date:-1})
        var totalPrice = 0
        var totalWeight = 0
        var totalFull = 0
        if(!cartDetail.cart||!cartDetail.cart.length){
            res.status(400).json({error:"سبد خرید خالی است"})
            return
        }
        for(var i=0;i<(cartDetail.cart&&cartDetail.cart.length);i++){
            var cartItem = cartDetail.cart[i]
            const productDetail = await products.findOne({sku:cartItem.sku})
            const priceData = CalcPrice(productDetail,priceRaw,TAX&&TAX.percent)
            const fullPrice = priceData.price
            totalFull+=fullPrice
            const price = cartItem.isReserve?
                (parseFloat(PRE&&PRE.percent)*fullPrice/100):fullPrice
            totalPrice+=price
            totalWeight+= NormalNumber(productDetail&&productDetail.weight)
            const { _id: _, ...newObj } = cartItem;
            var status = cartItem.isReserve?"needtobuild":"accept"
            await faktorItems.create({...newObj,faktorNo:faktorNo,
                fullPrice:fullPrice,price,unitPrice:priceRaw, status:status,
                priceDetail:priceData.priceDetail,cName:userData.username,phone:userData.phone})
            await CreateFaktorLog(userId,faktorNo,"regOrder",status,"","",newObj)
            0&&await products.updateOne({sku:cartItem.sku},{$set:{isReserve:true}})
            
        }

        const faktorData = {
            faktorNo:faktorNo,
            userId:userId, 
            initDate:Date.now(),
            progressDate:Date.now(),
            status:"inprogress",
            isActive:true, isEdit:false,
            totalPrice:NormalNumber(totalPrice),
            fullPrice:NormalNumber(totalFull),
            totalWeight:NormalNumber(totalWeight),
            unitPrice:NormalNumber(priceRaw)
        }
        await faktor.create(faktorData)
        await cart.deleteMany({userId:userId})
        res.json({faktorNo:faktorNo,message:"سفارش ثبت شد"})
        return
        //const cartDetails = await findCartFunction(userId,req.headers['userid'])
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/cart-to-faktor-sale',auth,jsonParser, async (req,res)=>{
    const userId =req.body.userId?req.body.userId:req.headers['userid']
    const bankData = req.body.bankData
    try{
        const priceRaw = await FindPrice()
        const userData = await customers.findOne({_id:userId})
        const userCode = userData.phone&&userData.phone.substr(userData.phone.length - 4)
        const faktorNo = await NewCode("z"+userCode)
        const cartDetail = await CalcCart(userId,0,req.headers['userid'])
        const clientRemain = userData&&await GetTahHesab(
            {"getmandehesabbycode":[userData.cCode]}
        ) 
        const clientStatus = ClientStatus(clientRemain)

        var TAX = await tax.findOne().sort({date:-1})
        var PRE = await prepaid.findOne().sort({date:-1})
        var totalPrice = 0
        var totalWeight = 0
        var totalFull = 0
        if(!cartDetail.cart||!cartDetail.cart.length){
            res.status(400).json({error:"سبد خرید خالی است"})
            return
        }
        var result = []
        
        await SetTransaction(userId,faktorNo)
        for(var i=0;i<(cartDetail.cart&&cartDetail.cart.length);i++){
            var cartItem = cartDetail.cart[i]
            if(cartItem.purchase){
                var priceDetail = cartItem.priceDetail
                const cartItems = CalcPurchase(priceDetail.Ayar,
                    priceRaw,priceDetail.weight&&priceDetail.weight.toString())

                const price = cartItems.price
                totalFull-=price
                totalPrice-=price
                totalWeight-= parseFloat(priceDetail.weight)
                const { _id: _, ...newObj } = cartItem;
                const faktorItem ={...newObj,faktorNo:faktorNo,
                    price,unitPrice:priceRaw, status:"status",purchase:true,
                    weight:priceDetail.weight,cName:userData.username,phone:userData.phone}
                //await faktorItems.create(faktorItem)
                var hesabResult = await SetTahHesabItem(faktorItem,i+1)
                await faktorItems.create({...faktorItem,result:hesabResult})
                await CreateFaktorLog(userId,faktorNo,"purchaseOrder","purchase","","",newObj)
            }
            else{
            const productDetail = await products.findOne({sku:cartItem.sku})
            const priceData = CalcPrice(productDetail,priceRaw,TAX&&TAX.percent)
            const fullPrice = priceData.price
            totalFull+=fullPrice
            const price = cartItem.isReserve?
                (parseFloat(PRE&&PRE.percent)*fullPrice/100):fullPrice
            totalPrice+=price
            totalWeight+= parseFloat(productDetail&&productDetail.weight.replace( /\//g, '.'))
            const { _id: _, ...newObj } = cartItem;
            var status = cartItem.isReserve?"needtobuild":"accept"
            const faktorItem ={...newObj,faktorNo:faktorNo,
                fullPrice:fullPrice,price,unitPrice:priceRaw, status:status,
                priceDetail:priceData.priceDetail,cName:userData.username,phone:userData.phone}
            
            await CreateFaktorLog(userId,faktorNo,"regOrder",status,"","",newObj)
            const hesabResult = await SetTahHesabItem(faktorItem,i)
            
            /*if(customerList&&customerList["OK"]){
                await faktorItems.updateOne({_id:ObjectID(faktorNoId)},
                {$set:{query:query,invoiceId:customerList["OK"]}})
            }*/
            await faktorItems.create({...faktorItem,result:hesabResult})
            await products.updateOne({sku:cartItem.sku},{$set:{isReserve:true}})
            } 
        }
        await SetTransaction(userId,faktorNo)
        //res.json({result:result})
        //return
        const faktorResult = {
            faktorNo:faktorNo,
            userId:userId, 
            manageId:req.headers['userid'],
            initDate:Date.now(),
            clientStatus:clientStatus,
            progressDate:Date.now(),
            status:"inprogress",
            isActive:true, isEdit:false,
            totalPrice:NormalNumber(totalPrice),
            fullPrice:NormalNumber(totalFull),
            totalWeight:totalWeight,
            unitPrice:NormalNumber(priceRaw)
        }
        //await SetTahHesab()
        await faktor.create(faktorResult)
        await cart.deleteMany({userId:userId})
        //await setTransaction(bankData,userId,faktorNo)
        const cartDetails = await CalcCart(userId,0,req.headers['userid'])
        res.json({...cartDetails,faktorNo:faktorNo,faktorResult,message:"سفارش ثبت شد"})
        return
        //const cartDetails = await findCartFunction(userId,req.headers['userid'])
        
         }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/cart-to-faktor',auth,jsonParser, async (req,res)=>{
    const userId =req.body.userId?req.body.userId:req.headers['userid']
    try{
        const priceRaw = await FindPrice()
        const userData = await customers.findOne({_id:userId})
        const userCode = userData.phone&&userData.phone.substr(userData.phone.length - 4)
        const faktorNo = await NewCode("z"+userCode)
        const cartDetail = await CalcCart(userId,0,req.headers['userid'])
        
        var TAX = await tax.findOne().sort({date:-1})
        var PRE = await prepaid.findOne().sort({date:-1})
        var totalPrice = 0
        var totalWeight = 0
        var totalFull = 0
        if(!cartDetail.cart||!cartDetail.cart.length){
            res.status(400).json({error:"سبد خرید خالی است"})
            return
        }
        for(var i=0;i<(cartDetail.cart&&cartDetail.cart.length);i++){
            var cartItem = cartDetail.cart[i]
            const productDetail = await products.findOne({sku:cartItem.sku})
            const priceData = CalcPrice(productDetail,priceRaw,TAX&&TAX.percent)
            const fullPrice = priceData.price
            totalFull+=fullPrice
            const price = cartItem.isReserve?
                (parseFloat(PRE&&PRE.percent)*fullPrice/100):fullPrice
            totalPrice+=price
            totalWeight+= NormalNumber(productDetail&&productDetail.weight)
            const { _id: _, ...newObj } = cartItem;
            var status = cartItem.isReserve?"needtobuild":"accept"
            await faktorItems.create({...newObj,faktorNo:faktorNo,
                fullPrice:fullPrice,price,unitPrice:priceRaw, status:status,
                priceDetail:priceData.priceDetail,cName:userData.username,phone:userData.phone})
            await CreateFaktorLog(userId,faktorNo,"regOrder",status,"","",newObj)
            0&&await products.updateOne({sku:cartItem.sku},{$set:{isReserve:true}})

        }

        const faktorData = {
            faktorNo:faktorNo,
            userId:userId, 
            initDate:Date.now(),
            progressDate:Date.now(),
            status:"inprogress",
            isActive:true, isEdit:false,
            totalPrice:NormalNumber(totalPrice),
            fullPrice:NormalNumber(totalFull),
            totalWeight:NormalNumber(totalWeight),
            unitPrice:NormalNumber(priceRaw)
        }
        await faktor.create(faktorData)
        await cart.deleteMany({userId:userId})
        const cartData = await CalcCart(userId,0,req.headers['userid'])
        res.json({...cartData,faktorNo:faktorNo,
            message:`سفارش با کد ${faktorNo} ثبت شد`})
        return
        //const cartDetails = await findCartFunction(userId,req.headers['userid'])
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/faktor', async (req,res)=>{
    const offset =req.body.offset?parseInt(req.body.offset):0 
    const userId =req.body.userId?req.body.userId:req.headers['userid'];
    try{
        const userDetail = await users.findOne({_id:req.headers['userid']})
        if(!userDetail){
            res.status(500).json({error: "access deny"})
            return
        }
        const access = userDetail.access
        const faktorTotalCount = await FaktorSchema.find(
            access==="manager"?{}:{manageId:userId}).count()
        const faktorList = await FaktorSchema.aggregate
        ([ {$match:access==="manager"?{}:{manageId:userId}},
        {$lookup:{
            from : "customers", 
            localField: "customerID", 
            foreignField: "CustomerID", 
            as : "userData"
        }},
        {$lookup:{
            from : "productcounts", 
            localField: "ItemID", 
            foreignField: "ItemID", 
            as : "countData"
        }},{$sort:{"initDate":-1}},
    {$skip:offset},{$limit:10}])
        //logger.warn("main done")
        res.json({faktor:faktorList,faktorCount:faktorTotalCount})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/fetch-faktor',auth, async (req,res)=>{
    const faktorNo =req.body.faktorNo;
    try{
        const faktorData = await FaktorSchema.findOne({faktorNo:faktorNo}).lean()
        if(!faktorData){
            res.status(400).json({error:"سفارش پیدا نشد"})
            return
        }
        const FaktorItems = await faktorItems.find({faktorNo:faktorNo}).sort({purchase:-1})
        const saleItems = []
        const purchaseItems = []
        for(var i=0;i<FaktorItems.length;i++){
            if(FaktorItems[i].purchase!== true)
                saleItems.push(FaktorItems[i])
            else
                purchaseItems.push(FaktorItems[i])
        }
            
        const saleDetail={tax:2342345,weight:53,price:2560000}
        const purchaseDetail={tax:0,weight:37.93,price:12260000}
        
        faktorData.items = FaktorItems
        const userDetail = await customers.findOne({_id:ObjectID(faktorData.userId)})
        const goldInfo = await FindPrice()
        const transactions = await transaction.find({orderNo:faktorNo})
        const userDebit = userDetail&&await GetTahHesab(
            {"getmandehesabbycode":[userDetail.cCode]})
        const calcFaktor = CalcFaktor(saleItems,purchaseItems,transactions,userDebit)
        res.json({data:faktorData,userDebit,calcFaktor,
            saleItems:{saleDetail,data:saleItems},
            purchaseItems:{purchaseDetail,data:purchaseItems},
            userDetail:userDetail,goldInfo,transactions})
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
})
router.post('/fetch-faktor-item',auth, async (req,res)=>{
    const faktorItemNo =req.body.faktorItemNo;
    try{
        const FaktorItems = await faktorItems.findOne({_id:ObjectID(faktorItemNo)}).lean()
        //faktorData.items = FaktorItems
        var newPrice;
        const priceRaw = await FindPrice()
        if(FaktorItems.newSku){
            var priceDetail = FaktorItems.priceDetail
            const newItem = await products.findOne({sku:FaktorItems.newSku})
            newPrice = CalcPrice(newItem,
                priceDetail.unitPrice,priceDetail.taxValue)
            var newDetail = newPrice.priceDetail
            const remainPay = newPrice.price - NormalNumber(FaktorItems.price)
            const remainDetail = {
                unitPrice:priceDetail.unitPrice,
                lastPrice:NormalNumber(FaktorItems.price),
                lastWeight:priceDetail.weight,
                lastOjrat:priceDetail.ojratValue,
                newPrice:NormalNumber(newPrice.price),
                newWeight:newDetail.weight,
                newOjrat:newDetail.ojratValue,
                defPay :NormalNumber(remainPay)
            }
            FaktorItems.newItem = newItem
            FaktorItems.newPrice = newPrice
            FaktorItems.remainPay=NormalNumber(remainPay)
            FaktorItems.remainDetail = remainDetail

        }
        
        
        const userDetail = await customers.findOne({phone:FaktorItems.phone})
        
        res.json({data:FaktorItems,userDetail:userDetail,nowPrice:priceRaw})
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
})
router.post('/list-faktor',auth, async (req,res)=>{
    var pageSize = req.body.pageSize?req.body.pageSize:"10";
    var offset = req.body.offset?(parseInt(req.body.offset)):0;
    var managerId = req.headers['userid']
    var userId = req.body.userId
    try{
        const userData = managerId&&await users.findOne({_id:ObjectID(managerId)})
        if(!userData){
            res.status(400).json({error:"اطلاعات کاربری مجاز نیست"})
            return 
        }
        var access = await CheckAccess(userData)
        if(access<2){
            res.status(400).json({error:"دسترسی ندارید"})
            return 
        }
        const faktorData = access>6?
            await FaktorSchema.find({}).sort({initDate:-1}).lean():
            await FaktorSchema.find({manageId:managerId}).sort({initDate:-1}).lean()
        const faktorList = faktorData.slice(offset,
            (parseInt(offset)+parseInt(pageSize))) 
        for(var i=0;i<faktorList.length;i++){
            var faktorNo = faktorData[i].faktorNo
            var userDetail = await customers.findOne({_id:ObjectID(faktorData[i].userId)})
            const faktorItemData = await faktorItems.find({faktorNo:faktorNo})
            faktorData[i].items = faktorItemData
            faktorData[i].rahId	=faktorNo
            faktorData[i].userDetail=userDetail
            //itemRefs.push(faktorItem)
        }
        res.json({data:faktorData,size:faktorData.length})
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
})
router.post('/list-faktor-sale',auth, async (req,res)=>{
    var pageSize = req.body.pageSize?req.body.pageSize:"10";
    var offset = req.body.offset?(parseInt(req.body.offset)):0;
    var manageId = req.headers['userid']
    var nowDate = new Date();
    const nowIso = nowDate.toISOString();
    const nowParse = Date.parse(nowIso);
    const now = new Date(nowParse);
    var now2 = new Date();
    var now3 = new Date();

    var userId = req.body.userId
    const data = {
        orderNo: req.body.orderNo,
        status: req.body.status,
        customer: req.body.customer,
        dateFrom:
            req.body.dateFrom ? req.body.dateFrom[0] + "/" +
                req.body.dateFrom[1] + "/" + req.body.dateFrom[2] + " " + "00:00" :
                new Date().toISOString().slice(0, 10) + " 00:00",
        dateTo:
            req.body.dateTo ? req.body.dateTo[0] + "/" +
                req.body.dateTo[1] + "/" + req.body.dateTo[2] + " 23:59" :
                new Date().toISOString().slice(0, 10) + " 23:59",
        pageSize: pageSize
    }
    const dateFromEn = new Date(now2.setDate(now.getDate() - (data.dateFrom ? data.dateFrom : 1)));
        dateFromEn.setHours(0, 0, 0, 0);
    const dateToEn = new Date(now3.setDate(now.getDate() - (data.dateTo ? data.dateTo : 0)));
        dateToEn.setHours(23, 59, 0, 0);
    try{
        const userData = manageId&&await users.findOne({_id:ObjectID(manageId)})
        if(!userData){
            res.status(400).json({error:"اطلاعات کاربری مجاز نیست"})
            return 
        }
        var access = await CheckAccess(userData)
        if(access<2){
            res.status(400).json({error:"دسترسی ندارید"})
            return 
        }
        const faktorData = await FaktorSchema.aggregate([
            { $match: data.orderNo ? { cartNo: new RegExp('.*' + data.orderNo + '.*') } : {} },
            { $match: access<6?{manageId:manageId}:{}},
            { $match: !data.orderNo ? { initDate: { $gte: new Date(data.dateFrom) } } : {} },
            { $match: !data.orderNo ? { initDate: { $lte: new Date(data.dateTo) } } : {} },
            { $sort: { "initDate": -1 } }
        ])
        const faktorList = faktorData.slice(offset,
            (parseInt(offset)+parseInt(pageSize))) 
        for(var i=0;i<faktorList.length;i++){
            var faktorNo = faktorData[i].faktorNo
            var userDetail = await customers.findOne({_id:ObjectID(faktorData[i].userId)})
            const faktorItemData = await faktorItems.find({faktorNo:faktorNo})
            faktorData[i].items = faktorItemData
            faktorData[i].rahId	=faktorNo
            faktorData[i].userDetail=userDetail
            //itemRefs.push(faktorItem)
        }
        res.json({data:faktorData,size:faktorData.length})
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
})

router.post('/fetch-faktor-2', async (req,res)=>{
    const userId =req.body.userId?req.body.userId:req.headers['userid'];
    const faktorID=req.body.faktorID
    try{
        const faktorList = await FaktorSchema.aggregate
        ([
          {$match:{_id:ObjectID(faktorID)}},
        { $addFields: { "manageId": { "$toObjectId": "$manageId" }}},
        {$lookup:{
            from : "customers", 
            localField: "customerID", 
            foreignField: "CustomerID", 
            as : "userData"
        }}, 
        {$lookup:{
            from : "users", 
            localField: "userId", 
            foreignField: "_id", 
            as : "adminData"
        }},
        {$lookup:{
            from : "users", 
            localField: "manageId", 
            foreignField: "_id", 
            as : "managerData"
        }}])
        var faktorData = faktorList&&faktorList[0]
        var faktorDetail = ''
        if(faktorData){
            faktorDetail = (faktorData.userId +" "+ faktorData.manageId)
            if(faktorData.userId != faktorData.manageId){
            var userShow = await users.findOne({_id:ObjectID(faktorData.userId)})
            faktorList[0].userData[0] = userShow
            }
        }
        var orderData={cartPrice:0,cartCount:0}
        var cartPrice = 0
        var cartItems = (faktorList&&faktorList[0].faktorItems)?
            faktorList[0].faktorItems:[]
        for(var i = 0;i<cartItems.length;i++){
            cartPrice +=parseInt(cartItems[i].price)*
                cartItems[i].count
        }
        orderData.cartPrice=cartPrice
        
        res.json({faktor:faktorList,orderData:orderData,faktorDetail:faktorDetail})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/register-faktor',auth, async (req,res)=>{
    const faktorNo=req.body.faktorNo
    try{
        const result = await RegisterFaktor(faktorNo)
        
        res.json({...result})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/register-faktor-item',auth, async (req,res)=>{
    const faktorNoId=req.body.id
    try{
        const result = await RegisterFaktorItem(faktorNoId)
        
        res.json({...result})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/update-faktor',jsonParser, async (req,res)=>{
    const userId =req.body.userId?req.body.userId:req.headers['userid']
    const data={
        //
        manageId:req.headers['userid'],
        date:req.body.date,
        progressDate:Date.now() 
    }
    const cartID=req.body.cartID
    try{
        const cartList = await cart.aggregate
        ([{$match:{manageId:userId}},
            { $addFields: { "cartID": { "$toString": "$_id" }}},
            (cartID&&cartID.length)?{$match:{cartID:{$in:cartID}}}:{$match:{}},
            { $addFields: { "manageId": { "$toObjectId": "$manageId" }}},
            
        {$lookup:{
            from : "customers", 
            localField: "userId", 
            foreignField: "Code", 
            as : "userData"
        }},
        {$lookup:{
            from : "users", 
            localField: "manageId", 
            foreignField: "_id", 
            as : "adminData"
        }}])
        const faktorSeprate = totalCart(cartList)
        const faktorDetail = await IntegrateCarts(faktorSeprate)
        
        var sepidarQuery=[]
        var addFaktorResult=[]
        var faktorNo=0
        for(var i=0;i<faktorDetail.length;i++){
            faktorNo= await createfaktorNo("F","02","21")
            sepidarQuery[i] = await SepidarFunc(faktorDetail[i],faktorNo)
            //console.log(sepidarQuery[i])
            addFaktorResult[i] = await sepidarPOST(sepidarQuery[i],"/api/invoices",req.headers['userid'])
            //console.log(addFaktorResult[i])
            if(!addFaktorResult[i]||addFaktorResult[0].Message||!addFaktorResult[i].Number){
                res.status(400).json({error:addFaktorResult[0].Message?addFaktorResult[0].Message:"error occure",
                    query:sepidarQuery[i],status:"faktor"})
                return
            }
            else{
                const cartDetail =findCartSum(faktorDetail[i].cartItems)
                await FaktorSchema.create(
                    {...data,faktorItems:faktorDetail[i].cartItems,
                        userId:faktorDetail[i].userTemp,
                        customerID:faktorDetail[i].userId,
                        faktorNo:faktorNo,
                        totalPrice:cartDetail.totalPrice,
                        totalCount:cartDetail.totalCount,
                        InvoiceNumber:addFaktorResult[i].Number,
                        InvoiceID:addFaktorResult[i].InvoiceID})
                
            }
        }
        
        (cartID&&cartID.length)?await cart.deleteMany({_id:{$in:cartID}}):
        await cart.deleteMany({manageId:userId})

        const recieptQuery = 1//await RecieptFunc(req.body.receiptInfo,addFaktorResult[0],faktorNo)
        const recieptResult = 1//await sepidarPOST(recieptQuery,"/api/Receipts/BasedOnInvoice")
        //const SepidarFaktor = await SepidarFunc(faktorDetail)
        if(!recieptQuery||recieptResult.Message){
            res.json({error:recieptResult.Message,query:recieptQuery,status:"reciept"})
                return
        }
        else{
            res.json({recieptInfo:faktorDetail,
                users:users,
                faktorInfo:addFaktorResult,
                faktorData:sepidarQuery,
                status:"done"})
            }
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
const IntegrateCarts = async(carts)=>{
    var cartList=carts
    for(var i =0 ;i<cartList.length;i++){
        cartList[i].cartItems= setCart(cartList[i].cartItems)
        
    }
    return(cartList)
}
const setCart=(cartItems)=>{
    var tempCart=[]
    for(var i=0;i<cartItems.length;i++){
        repeat = 0
        for(var j=0;j<tempCart.length;j++){
            if(cartItems[i].id===tempCart[j].id){
                tempCart[j].count=parseInt(tempCart[j].count)+
                                    parseInt(cartItems[i].count)
                repeat=1
                break
            }
        }
        !repeat&&tempCart.push({...cartItems[i]})
    }
    return(tempCart)
}
const SepidarFunc=async(data,faktorNo)=>{
    const notNullCartItem = []
    for(var i=0;i<data.cartItems.length;i++)
        data.cartItems[i].count?
        notNullCartItem.push(data.cartItems[i]):''
    //console.log(data)
    var query ={
        "GUID": "124ab075-fc79-417f-b8cf-2a"+faktorNo,
        "CustomerRef": toInt(data.userId),
        "AddressRef": toInt(data.userAddress)?toInt(data.userAddress):'',
        "CurrencyRef":1,
        "Description":faktorNo,
        "DescriptionRef":faktorNo,
        "SaleTypeRef": data.payValue?toInt(data.payValue):4,
        "Duty":0.0000,
        "Items": 
        notNullCartItem.map((item,i)=>(
            {
            "ItemRef": toInt(item.id),
            "TracingRef": null,
            "Description":item.description,
            "StockRef":"5",//data.stockId,
            "Quantity": toInt(item.count),
            "Fee": toInt(item.price),
            "Price": normalPriceCount(item.price,item.count,1),
            "Discount": findDiscount(item),
            "Tax": normalPriceCount(item.price,item.count,TaxRate),
            "Duty": 0.0000,
            "Addition": 0.0000
          }))
        
      }
    return(query)
}

const createfaktorNo= async(Noun,year,userCode)=>{
    var faktorNo = '';
    for(var i=0;i<10;i++){
        faktorNo = Noun+year+userCode+
        Math.floor(Math.random()* (99999 - 10000) + 10000)
        const findFaktor = await FaktorSchema.findOne({faktorNo:faktorNo})
        if(!findFaktor)
            return(faktorNo)
    }
}
const toInt=(strNum,count,align)=>{
    if(!strNum)return(0)
    
    return(parseInt(parseInt((align?"-":'')+strNum.toString().replace( /,/g, ''))*
    (count?parseFloat(count):1)))
}
const normalPriceCount=(priceText,count,tax)=>{
    if(!priceText||priceText === null||priceText === undefined) return("")
    var rawCount = parseFloat(count.toString())
    var rawTax = parseFloat(tax.toString())
    var rawPrice = Math.round(parseInt(priceText.toString().replace( /,/g, '')
        .replace(/\D/g,''))*rawCount*rawTax/1000)
    rawPrice = parseInt(rawPrice)*1000
    return(
      (rawPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace( /^\D+/g, ''))
    )
  }
const findDiscount=(item)=>{
    if(!item.discount) return(0.00)
    var off = Number(item.discount)
    var discount = off
    if(off<100){
        discount = Number(item.price) * Number(item.count) * discount/100
    }
    return(roundNumber(discount))
}
const roundNumber = (number)=>{
    var rawNumber = parseInt(number.toString().replace( /,/g, ''))
    return(parseInt(Math.round(rawNumber/1000))*1000)

} 
router.post('/customer-find', async (req,res)=>{
    const search = req.body.search
    try{ 
        var searchCustomer = await users.
        aggregate([{$match:
            {$or:[
                {username:{$regex: search, $options : 'i'}},
                {Code:{$regex: search, $options : 'i'}}
            ]}
        }])
        //if(!searchCustomer.length){
        
        const searchUser = await customerSchema.
            aggregate([{$match:
                {$or:[
                    {username:{$regex: search, $options : 'i'}},
                    {Code:{$regex: search, $options : 'i'}}
                ]}
            }])
        //}
        const allUser = searchCustomer.concat(searchUser)  
        //logger.warn("main done")
        res.json({customers:allUser})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/bankCustomer', async (req,res)=>{
    const search = req.body.search
    try{ 
        var bankCustomer = await bankAccounts.find()
        
        res.json({bankList:bankCustomer})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/add-bank-to-cart', async (req,res)=>{
    
    const data = {
        userId: req.body.userId,
        title: req.body.title,
        bankCode: req.body.bankCode,
        payValue: req.body.payValue,
        description: req.body.description
    }
    try{ 
        await transaction.create(data)
        var bankDetail = await transaction.find({userId:data.userId,orderNo:{$exists:false}})
        res.json({transData:bankDetail,remain:134500
            ,totalPay:4350000
        })
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/remove-bank-from-cart', async (req,res)=>{
    const userId = req.body.userId
    const id = req.body.id
    try{ 
        await transaction.deleteOne({_id:ObjectID(id),userId:userId})
        var bankDetail = await transaction.find({userId:userId,orderNo:{$exists:false}})
        res.json({transData:bankDetail,remain:134500
            ,totalPay:4350000
        })
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/edit-addCart', async (req,res)=>{
    const cartNo=req.body.cartNo
    const data=req.body.data
    try{
        //const userData = await users.findOne({_id:req.headers['userid']})
        //const stockId = userData.StockId?userData.StockId:"13"
        var status = "";
        //const cartData = await cart.find({userId:userId})
        const CartData = await cart.findOne({cartNo:cartNo})
        
        const availItems = await checkAvailable(data,CartData.stockId)
        if(!availItems){
            res.status(400).json({error:"موجودی کافی نیست"}) 
            return
        }
        const cartItems = createCart(CartData?CartData.cartItems:[],
            data)
            CartData.cartItems =(cartItems)
        if(!CartData){
            
        }
        else{
            cartLog.create({...CartData,ItemID:data,action:"edit cart"})
            await cart.updateOne(
                {cartNo:cartNo},{$set:CartData})
            status = "edit cart"
        }
        const cartDetails = await findCartData(cartNo)
        res.json({...cartDetails,message:"آیتم اضافه شد"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/edit-removeCart',jsonParser, async (req,res)=>{
    const cartNo=req.body.cartNo
    const cartID=req.body.cartID
    
    try{
        var status = "";
        const cartData = await cart.findOne({cartNo:cartNo})
        const cartItems = removeCart(cartData,cartID)
        //cartData.cartItems =(cartItems)
        await cart.updateOne({cartNo:cartNo},
            {$set:{cartItems:cartItems}})
        //console.log(req.body.cartItem)
        cartLog.create({...cartData,ItemID:cartID,action:"edit delete"})
            
        const cartDetails = await findCartData(cartNo)
        res.json({...cartDetails,message:"آیتم حذف شد"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/edit-updateFaktor',jsonParser, async (req,res)=>{
    const data={
        //
        manageId:req.headers['userid'],
        date:req.body.date,
        progressDate:Date.now() 
    }
    const cartNo=req.body.cartNo
    try{
        const adminUser = await users.findOne({_id:ObjectID(req.headers["userid"])})
        
        if(!adminUser.access== "manager") {
            res.status(400).json({error:"no access"})
            return
        }
        const cartList = await cart.aggregate
        ([{$match:{cartNo:cartNo}},
            { $addFields: { "manageId": { "$toObjectId": "$manageId" }}},
            { $addFields: { "userId": { "$toObjectId": "$userId" }}},
            
        {$lookup:{
            from : "customers", 
            localField: "userId", 
            foreignField: "_id", 
            as : "userData"
        }},
        {$lookup:{
            from : "users", 
            localField: "manageId", 
            foreignField: "_id", 
            as : "adminData"
        }}])
        const faktorSeprate = totalCart(cartList)
        const faktorDetail = await IntegrateCarts(faktorSeprate)
        
        var sepidarQuery=[]
        var addFaktorResult=[]
        var faktorNo=0
        
        for(var i=0;i<faktorDetail.length;i++){
            faktorNo= await createfaktorNo("F","02","21")
            sepidarQuery[i] = await SepidarFunc(faktorDetail[i],faktorNo)
            
            addFaktorResult[i] = await sepidarPOST(sepidarQuery[i],"/api/invoices",req.headers['userid'])
            
            //console.log(addFaktorResult[i])
            if(!addFaktorResult[i]||addFaktorResult[0].Message||!addFaktorResult[i].Number){
                res.status(400).json({error:addFaktorResult[0].Message?addFaktorResult[0].Message:"error occure",
                    query:sepidarQuery[i],status:"faktor"})
                return
            }
            else{
                //console.log(addFaktorResult[i].Number)
                const cartDetail =findCartSum(faktorDetail[i].cartItems)
                await FaktorSchema.create(
                    {...data,faktorItems:faktorDetail[i].cartItems,
                        userId:faktorDetail[i].userTemp,
                        customerID:faktorDetail[i].userId,
                        faktorNo:faktorNo,
                        totalPrice:cartDetail.totalPrice,
                        totalCount:cartDetail.totalCount,
                        InvoiceNumber:addFaktorResult[i].Number,
                        InvoiceID:addFaktorResult[i].InvoiceID})
                
            }
        }
        
        await cart.deleteOne({cartNo:cartNo})
        

        const recieptQuery = 1//await RecieptFunc(req.body.receiptInfo,addFaktorResult[0],faktorNo)
        const recieptResult = 1//await sepidarPOST(recieptQuery,"/api/Receipts/BasedOnInvoice")
        //const SepidarFaktor = await SepidarFunc(faktorDetail)
        if(!recieptQuery||recieptResult.Message){
            res.json({error:recieptResult.Message,query:recieptQuery,status:"reciept"})
                return
        }
        else{
            res.json({recieptInfo:faktorDetail,
                users:users,
                faktorInfo:addFaktorResult,
                faktorData:sepidarQuery,
                status:"done"})
            }
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/price', async (req,res)=>{
    try{ 
        const cPrice = await FindPrice()
        res.json({data:cPrice})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/sliders', async (req,res)=>{
    try{
        const SlidersList = await slider.find()
        res.json({data:SlidersList,message:"slider list"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/list-complete-faktor',auth, async (req,res)=>{
    var userId = req.headers['userid']
    const userCode = await customers.findOne({_id:ObjectID(userId)})
    if(!userCode){
        res.status(400).json({error:"user not found"})
        return('')
    }
    try{
        const creditData = await GetTahHesab(
            {
                "getmandehesabbycode":
                [userCode.cCode]
            }
        )
        res.json({data:creditData,user:userCode,message:"user Credit"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
module.exports = router;