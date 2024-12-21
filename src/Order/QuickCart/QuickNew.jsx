import { useState } from "react"
import QuickCounter from "./QuickCounter"
import QuickOff from "./QuickOff"
import QuickSearch from "./QuickSearch"
import env, { payValue,normalPriceCount } from "../../env"
import DataModal from "../../components/Modal/dataModal"

function QuickNew(props){
    const [selectedItem,setSelectedItem] = useState()
    const [count,setCount] = useState(1)
    const [PayInfo,setPayInfo] = useState("")
    const [showDesc,setShowDesc] = useState(0)
    const [description,setDescription] = useState()
    const [TotalPrice,setTotalPrice]=useState("")
    const token = props.token
    const tab = props.tab
    const user=props.user
    const FindTotal=()=>{
        
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({
                
                title:selectedItem.title,
                ayar:PayInfo.ayar,
                weight:PayInfo.weight,
                
                
            })}
        fetch(env.siteApi + "/panel/faktor/find-purchase-price",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                setTotalPrice(result.price)
            },
            (error) => {
                console.log(error)
            })
    
    }
    const addPayItem=()=>{
        if(!selectedItem)return
        props.setReload(0)
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({
                userId:user&&user._id,
                title:selectedItem.title,
                ...PayInfo,
                
                
            })}
        fetch(env.siteApi + "/panel/faktor/add-purchase-cart",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.error){
                    setTimeout(()=>props.setReload(1),500)
                    props.setError({message:result.error,color:"brown"})
                    setTimeout(()=>props.setError({message:'',
                        color:"brown"}),3000)
                }
                else{
                    setTimeout(()=>props.setReload(1),500)
                    
                    props.setCart(result)
                    props.setError({message:result.message,color:"green"})
                    setTimeout(()=>props.setError({message:'',
                        color:"brown"}),3000)
                }
            },
            (error) => {
                console.log(error)
            })
    
    }
    const addItem=()=>{
        if(!selectedItem)return
        props.setReload(0)
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({
                userId:user&&user._id,
                date:Date.now,
                price:selectedItem.price,
                sku:selectedItem.sku,
                count:count?count:1,
                
            })}
        fetch(env.siteApi + "/panel/faktor/add-cart",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.error){
                    setTimeout(()=>props.setReload(1),500)
                    props.setError({message:result.error,color:"brown"})
                    setTimeout(()=>props.setError({message:'',
                        color:"brown"}),3000)
                }
                else{
                    setTimeout(()=>props.setReload(1),500)
                    
                    props.setCart(result)
                    props.setError({message:result.message,color:"green"})
                    setTimeout(()=>props.setError({message:'',
                        color:"brown"}),3000)
                        
                    //setItem('')
                    //setItemPrice('')
                    setCount("1")
                }
            },
            (error) => {
                console.log(error)
            })
    
    }
    const defAction=()=>{
        if(!selectedItem)return
        props.action({
                id:selectedItem.ItemID,
                sku:selectedItem.sku,
                title:selectedItem.title,
                count:count?count:1,
                price:selectedItem.priceData,
                description:"ویرایش شده"})
    }
    const ParamType= (selectedItem&&selectedItem.parameters&&selectedItem.parameters.length)%2
    
    return(
        <tr className={`input-tr ${props.tab?"pay-tr":""}`}>
            <td data-cell="ردیف"></td>
            
            <td className="search-td" data-cell="کد کالا">
                <QuickSearch pType={props.pType} cart={props.cart} tab={props.tab} setTab={props.setTab} data={props.data} setdata={props.setdata} token={token}
                search={props.search} setSearch={props.setSearch}
                setSelectedItem={setSelectedItem}/>
            </td>
            {props.tab?
            <>
                {(selectedItem&&selectedItem.parameters&&selectedItem.parameters.map((param,i)=>(
                    <td data-cell={param.title}> <div className="code-input-wrapper new-input">
                    <input 
                        className="dp-input" 
                        type="text" 
                        placeholder={param.title}
                        onChange={(e)=>setPayInfo(prevState => ({
                            ...prevState,
                            [param.value]:e.target.value
                          }))}
                    /></div></td>
                )))}
            </>
            :<td data-cell="شرح کالا">
                {selectedItem?selectedItem.title:''}<br/>
                <small>{selectedItem?selectedItem.sku:''}</small>
            </td>}
            
            <td data-cell="وزن">
                {props.tab?selectedItem&&selectedItem.weight?selectedItem.weight:<div className="code-input-wrapper new-input">
                    <input 
                        className="dp-input" 
                        type="number" 
                        placeholder="وزن"
                        onChange={(e)=>setPayInfo(prevState => ({
                            ...prevState,
                            weight:e.target.value
                          }))}
                    /></div>:<>{selectedItem&&selectedItem.weight}</>}
                    
                
            </td>
            <td data-cell="عیار">
            {props.tab?
            (selectedItem&&selectedItem.ayar)?selectedItem.ayar:<div className="code-input-wrapper new-input">
                    <input 
                        className="dp-input" 
                        type="number" 
                        placeholder="عیار"
                        onChange={(e)=>setPayInfo(prevState => ({
                            ...prevState,
                            ayar:e.target.value
                          }))}
                    /></div>:<></>}
                    
                
            </td>
            <td data-cell="مبلغ واحد" className={selectedItem&&selectedItem.isCoin?"long-td":""}>
                {selectedItem? 
                normalPriceCount(selectedItem.priceDetail&&selectedItem.priceDetail.unitPrice):''}
            </td>
           
            {props.tab?
            (selectedItem&&!selectedItem.isCoin?<td data-cell="مبلغ کل" className={ParamType?"long-td":""}>
                {selectedItem? 
                (TotalPrice?(normalPriceCount(TotalPrice)):<button className="total-btn" onClick={FindTotal}>محاسبه قیمت</button>)
                :''}
            </td>:<></>):
            (<td data-cell="مبلغ کل">
                {selectedItem? 
                normalPriceCount(selectedItem.price):''}
            </td>)}
            <td>
            <div className="more-btn">
                
                <i className="fa-solid fa-comment"
                onClick={()=>setShowDesc(1)}></i>
                {props.tab?<i className="fa-solid fa-plus"
                onClick={addPayItem}></i>:
                <i className="fa-solid fa-plus"
                onClick={props.action?
                defAction:addItem}></i>}
            </div>
            {showDesc?
            <DataModal action={(e)=>setDescription(e)}
            close={()=>setShowDesc(0)} color="darkblue"
            buttonText="ثبت توضیحات" def={description} title={"افزودن توضیحات"}/>:
            <></>}
            
            </td>
        </tr>
    )
}
export default QuickNew