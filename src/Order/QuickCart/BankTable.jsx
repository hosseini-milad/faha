import { useState,useEffect } from "react"
import env, { normalPriceCount, normalPriceRound } from "../../env"
import StyleSelect from "../../components/Button/AutoComplete"
function BankTable(props){
  const token=props.token
  const TransData=props.TransData
  const setTransData=props.setTransData
  const user = props.user
  const [SelectedBank,setSelectedBank]=useState("")
  const [SendBank,setSendBank]=useState("")
  const removeBank=(bankId)=>{
    const postOptions={
        method:'post',
        headers: { 'Content-Type': 'application/json' ,
        "x-access-token": token&&token.token,
        "userId":token&&token.userId},
        body:JSON.stringify({
          id:bankId,
          userId:user._id
        })}
    fetch(env.siteApi + "/panel/faktor/remove-bank-from-cart",postOptions)
    .then(res => res.json())
    .then(
        (result) => {
          setTransData(result.transData)
        },
        (error) => {
            console.log(error)
        })

}

  return(
    <div className="bank-list">
      {TransData.map((bank,i)=>(
        <tr className="product-tr bank-tr" key={i}>
          <td data-cell="بانک" >{bank.title}</td>
          <td data-cell="مبلغ" >{bank.payValue?bank.payValue:"--"}</td>
          <td data-cell="توضیحات">{bank.description?bank.description:"--"}</td>
          <td><i className="fa-solid fa-trash" onClick={()=>removeBank(bank._id)}></i></td>
        </tr>
      ))}
    </div>
  )
}
export default BankTable