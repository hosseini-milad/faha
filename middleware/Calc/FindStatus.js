const crmlist = require("../../models/crm/crmlist")
const Colors = require("../../models/product/Colors")

const FindStatus=async(enStep)=>{
    const crmData = await crmlist.findOne()
    if(!crmData) return('')
    const steps = crmData.crmSteps
    const faStep = steps.find(item=>item.enTitle==enStep)
    if(faStep){
        return(faStep.title)
    }
    else
        return('')
}

module.exports =FindStatus