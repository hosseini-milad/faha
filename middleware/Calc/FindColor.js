const Colors = require("../../models/product/Colors")

const FindColor=async(search)=>{
    const colorData = await Colors.findOne({title:search},{_id:0})
    if(colorData)
        return({
            title:colorCode.title,
            value:colorCode.enTitle,
            colorCode:colorCode.colorCode
        })
    else
        return({
            title:search,
            value:search,
            colorCode:''
        })
}

module.exports =FindColor