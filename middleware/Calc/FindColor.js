const Colors = require("../../models/product/Colors")

const FindColor=async(search)=>{
    const colorData = await Colors.findOne({title:search},{_id:0})
    if(colorData)
        return(colorData)
    else
        return(search)
}

module.exports =FindColor