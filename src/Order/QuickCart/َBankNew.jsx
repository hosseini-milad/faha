import { useState,useEffect } from "react"
import env, { normalPriceCount, normalPriceRound } from "../../env"
import StyleSelect from "../../components/Button/AutoComplete"
function BankNew(props){
  const token=props.token
  const bankList=props.bankList
  const setTransData=props.setTransData
  const user = props.user
  const [SelectedBank,setSelectedBank]=useState("")
  const [SendBank,setSendBank]=useState("")
  
  const addBank=()=>{
    const postOptions={
        method:'post',
        headers: { 'Content-Type': 'application/json' ,
        "x-access-token": token&&token.token,
        "userId":token&&token.userId},
        body:JSON.stringify({
          ...SendBank,
          userId:user._id
        })}
    fetch(env.siteApi + "/panel/faktor/add-bank-to-cart",postOptions)
    .then(res => res.json())
    .then(
        (result) => {
         setTransData(result.transData);
         props.setLoadBank(Math.random())
        },
        (error) => {
            console.log(error)
        })

   }

  console.log(SendBank)
  return(
    <div className="add-bank">
    <tr className="product-tr bank-tr">
      <td>
         <StyleSelect
               class={"select-input"}
               title="انتخاب بانک"
               // direction={props.lang.dir}
               options={bankList}
               label="title"
               action={(e)=>setSendBank(prevState => ({
                 ...prevState,
                 title:e.title,bankCode:e.code
               }))}
         />
      </td>
      <td>
         <input
         type="number"
         placeholder="مبلغ"
         className="pay-input"
         onChange={(e)=>setSendBank(prevState => ({
           ...prevState,
           payValue:e.target.value
         }))}
         />
      </td>
      <td>
         <input
         type="text"
         placeholder="توضیحات"
         className="desc-input"
         onChange={(e)=>setSendBank(prevState => ({
           ...prevState,
           description:e.target.value
         }))}
         />
      </td>
      <td className="btn-td"><i className="fa-solid fa-plus" type="submit" onClick={addBank}></i></td>
    </tr>
  </div>
)
}
export default BankNew