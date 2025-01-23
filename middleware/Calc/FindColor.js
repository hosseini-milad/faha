const Colors = require("../../models/product/Colors")

const FindColor=async(search)=>{
    const colorData = await Colors.findOne({title:search})
    if(colorData)
        return(colorData)
    else
        return(search)
}

module.exports =FindColor