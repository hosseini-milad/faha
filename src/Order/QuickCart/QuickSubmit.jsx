import { useState,useEffect } from "react"
import env, { normalPriceCount, normalPriceRound } from "../../env"

function QuickSubmit(props){
  const token = props.token
  const user = props.user
  const NeedToRe=props.NeedToRe
  const setNeedToRe=props.setNeedToRe
  
  
  //console.log(qCart)
  const SetOrder=()=>{
    
    const postOptions={
        method:'post',
        headers: { 'Content-Type': 'application/json' ,
        "x-access-token": token&&token.token,
        "userId":token&&token.userId},
        body:JSON.stringify({userId:user&&user._id})
      }
      //console.log(postOptions)
    fetch(env.siteApi + "/panel/faktor/cart-to-faktor-sale",postOptions)
    .then(res => res.json())
    .then(
        (result) => {
            if(!result.error){
                props.setError({message:result.message,color:"green"})
                setTimeout(()=>props.setError({message:"",color:"brown"}),2000)
                props.setCart(result)
                setNeedToRe(true)
                props.setShowBank(false)
            }
            else{
              props.setError({message:result.error,color:"brown"})
                setTimeout(()=>props.setError({message:"",color:"brown"}),5000)
            }
                
        },
        (error) => {
            console.log(error)
        })
}

  if(NeedToRe){
    return;
  }
  else return(
    
      <button onClick={SetOrder} type="button" className="final-submit-btn">
        <p>ثبت سفارش</p>
      </button>
    
    )
}
export default QuickSubmit