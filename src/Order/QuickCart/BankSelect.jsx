import { useState,useEffect } from "react"
import env, { normalPriceCount, normalPriceRound } from "../../env"
import StyleSelect from "../../components/Button/AutoComplete"
import BankTable from "./BankTable"
import BankNew from "./َBankNew"
function BankSelect(props){
  const token=props.token
  const bankList=props.bankList
  const user = props.user
  const [loadBank,setLoadBank]=useState()
  useEffect(()=>{
    if(loadBank){
      setTimeout(()=>setLoadBank(0),200)
    }
  },[loadBank])
  
  return(
    <div className="bank-wrapper">
      {loadBank?<></>:<BankNew bankList={bankList} setTransData={props.setTransData} user={user} loadBank={loadBank}
      setLoadBank={setLoadBank} token={token}/>}
      <div className="amount">
        <p>جمع پرداختی:{normalPriceCount(props.totalPay)}</p>
        <p>باقی مانده فاکتور:{normalPriceCount(props.remain)}</p>
      </div>
      {props.TransData?<BankTable TransData={props.TransData} setTransData={props.setTransData} user={user} token={token}/>:<></>}
    </div>
    )
}
export default BankSelect