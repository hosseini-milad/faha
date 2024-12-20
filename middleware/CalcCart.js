const customers = require("../models/auth/customers");
const transactions = require("../models/param/transaction");
const cart = require("../models/product/cart");
const faktor = require("../models/product/faktor");
const faktorItems = require("../models/product/faktorItems");
const products = require("../models/product/products");
const FloatDec = require("./FloatDec");
const NormalNumber = require("./NormalNumber");
var ObjectID = require('mongodb').ObjectID;

const CalcCart=async(userId,remainRaw,manageId)=>{
    var totalWeight = 0
    var remain = remainRaw?remainRaw:0
    var totalPrice = 0
    var totalTax = 0
    var unitPrice = 0
    var goldUnit = []
    const cartDetails = await cart.find({userId:userId}).lean()
    for(var c=0;c<cartDetails.length;c++){
        unitPrice = cartDetails[c].unitPrice
        var cartPrice = parseFloat(cartDetails[c].price)
        if(cartDetails[c].purchase){
            var count = cartDetails[c].count?cartDetails[c].count:1
            totalPrice -= cartPrice*count
            totalWeight -= parseFloat(cartDetails[c].weight&&
                cartDetails[c].weight.replace(/\//g,'.'))*count
        } 
        else {
            var weight = parseFloat(cartDetails[c].weight&&
                cartDetails[c].weight.replace(/\//g,'.'))
            goldUnit.push({weight:weight,price:cartPrice})
            totalTax += cartDetails[c].priceDetail&&cartDetails[c].priceDetail.taxPrice
            totalPrice += cartPrice 
            totalWeight += weight
        }
    }
    var faktorData = await faktor.aggregate([
        { $match: { manageId: manageId } },
        { $match: userId ? { userId: userId } : {} },
        { $sort: { "initDate": -1 } }
    ])
    for(var i=0;i<faktorData.length;i++){
        const userDetail = await customers.findOne({_id:ObjectID(faktorData[i].userId)})
        const items = await faktorItems.find({faktorNo:faktorData[i].faktorNo})
        faktorData[i].userDetail = userDetail
        faktorData[i].items = items
    }
    var transData = userId?await transactions.find({userId:userId,orderNo:{$exists:false}}):''
    return({cart:cartDetails,
        cartDetail: {
            "unitPrice": unitPrice,
            "cartDiscount": 0,
            "cartPrice": totalPrice,
            "totalTax": totalTax,
            "cartWeight": FloatDec(totalWeight,2),
            "cartWeightRaw": totalWeight,
            "remainUser":remain,
            "finalGoldUnit":calcUnit(goldUnit),
            "finalPrice":NormalNumber(totalPrice-remain)
        },
        purchaseType:[
            {title:"خرید متفرقه",id:1,unitPrice:unitPrice,
                parameters:[
                    
                ],isOptional:false
            },
            {title:"خرید آبشده",id:2,unitPrice:unitPrice,
                parameters:[
                    {title:"نام آزمایشگاه",value:"lab",icon:"fa-cog",
                        options:["سعدی","حافظ","مولوی"],isOptional:true
                    },
                    {title:"شماره ری.انگ",value:"riang",icon:"fa-headphones",
                        options:[41,51,61,71,81,91],isOptional:true
                    }
                ]
            },
            {title:"سکه تمام بهار",id:10,unitPrice:unitPrice,
                ayar:"740",weight:"4.06", isCoin:true,
                parameters:[
                    {title:"تعداد",value:"count",icon:"fa-comment",
                        options:[1,2,3,4,5,6,7,8,9,10],isOptional:true
                    },
                    {title:"قیمت",value:"price",icon:"fa-headphones",
                        isOptional:false
                    }
                ]
            },
            {title:"سکه نیم بهار",id:11,unitPrice:unitPrice,
                ayar:"740",weight:"2.03", isCoin:true,
                parameters:[
                    {title:"تعداد",value:"count",icon:"fa-comment",
                        options:[1,2,3,4,5,6,7,8,9,10],isOptional:true
                    },
                    {title:"قیمت",value:"price",icon:"fa-headphones",
                        isOptional:false
                    }
                ]
            }
        ],
        faktorData,faktorSize:faktorData&&faktorData.length,transData,
        remain:134500,totalPay:4350000
    })
}
const calcUnit=(goldArray)=>{
    if(!goldArray || !goldArray.length)return(0)
    var total = 0;
    var weight = 0
    for(var i=0; i<goldArray.length;i++){
        var count = goldArray[i].count?goldArray[i].count:1
        total += goldArray[i].price*count
        weight += goldArray[i].weight*count
    }
    return(NormalNumber(total/weight))
}
module.exports =CalcCart