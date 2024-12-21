import { useState } from "react"
import ErrorAction from "../../components/Modal/ErrorAction"
import env, { normalPriceCount, payValue ,normalPriceRound} from "../../env"
import DataModal from "../../components/Modal/dataModal"
import QuickOff from "./QuickOff"
import QuickCounter from "./QuickCounter"

function QuickRow(props){
    const data = props.data
    const token = props.token
    const user = props.user
    const tab = props.tab
    const [showDesc,setShowDesc] = useState(0)
    const [editMode,setEditMode] = useState(0)
    const [changes,setChanges]= useState()
    const [showRemove,setShowRemove] = useState()
    const [Weight,setWeight] = useState("")
    const [Ayar,setAyar] = useState("")
    const [Total,setTotal] = useState("")
    const updateField=()=>{
        
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:
                user._id,
                price:Total,
                weight:Weight,
                ayar:Ayar,
            id:data._id})
          }
          console.log(postOptions)
        fetch(env.siteApi + "/panel/faktor/update-purchase-cart" ,postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.error){
                    props.setError({message:result.error,color:"brown"})
                    setTimeout(()=>props.setError({message:'',
                        color:"brown"}),3000)
                    
                }
                else{
                    props.setCart(result) 
                    props.setError({message:result.message,color:"orange"})
                    setTimeout(()=>props.setError({message:'',
                        color:"brown"}),3000)
                    setEditMode(false)    
                }
            },
            (error) => {
                console.log(error)
            })
    }
    
  
    const removeItem=()=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({
                userId:user._id,
                id:data._id})
          }
          console.log(postOptions)
        fetch(env.siteApi + "/panel/faktor/remove-cart-item",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(result.error){
                    props.setError({message:result.error,color:"brown"})
                    setTimeout(()=>props.setError({message:'',
                        color:"brown"}),3000)
                }
                else{
                    props.setCart(result.cart) 
                    props.setError({message:result.message,color:"orange"})
                    setTimeout(()=>props.setError({message:'',
                        color:"brown"}),3000)

                }
            },
            (error) => {
                console.log(error)
            })
    }
    const defAction=()=>{
        props.action({cartID:data.id})
    }
    const saveChanges=()=>{
        updateField(changes)
        console.log(changes)
        setEditMode(0)
    }
    return(<>
        <tr className={`product-tr ${data.purchase?"purchase-tr":""}`}>
            <td data-cell="ردیف">
            <p>{props.index}</p>
            </td>

            
            <td  className="long-td">
            
                <p className="name">{data.title}</p>
            
            </td>
            <td data-cell="کد کالا">
                {data.purchase?<p>خرید</p>:<p>{data.sku}</p>}
            </td>
            {data.count?
              <td data-cell="تعداد">
              <p>{data.count}</p>
              </td>:<></>  

            }
            <td data-cell="وزن">
                {editMode?<div className="code-input-wrapper new-input">
                    <input 
                        className="dp-input" 
                        type="number" 
                        placeholder="وزن"
                        onChange={(e)=>setWeight(e.target.value)}
                    /></div>:
                <p>{data.weight+"g"}</p>}
            </td>
            <td data-cell="عیار">
            {editMode?<div className="code-input-wrapper new-input">
                    <input 
                        className="dp-input" 
                        type="number" 
                        placeholder="عیار"
                        onChange={(e)=>setAyar(e.target.value)}
                    /></div>:
                        <p>{data.priceDetail&&data.priceDetail.Ayar}</p>}
            </td>
            {data.lab?
              <td data-cell="آزمایشگاه">
              <p>{data.lab}</p>
              </td>:<></>  

            }
            {data.riang	?
              <td data-cell="ری انگ">
              <p>{data.riang}</p>
              </td>:<></>  

            }
            <td data-cell="مبلغ واحد">
            <p>{normalPriceCount(data.unitPrice)}</p>
            </td>
            {data.purchase?<></>:<td data-cell="مبلغ به ازای هر گرم">
            <p>{normalPriceCount(data.priceDetail&&data.priceDetail.unitGold)}</p>
            </td>}
            
            <td data-cell="مبلغ کل" className={!data.count&&data.purchase?"long-td":""}>
                {editMode?<div className="code-input-wrapper new-input">
                    <input 
                        className="dp-input" 
                        type="number" 
                        placeholder="مبلغ کل"
                        onChange={(e)=>setTotal(e.target.value)}
                    /></div>:
                    <p>{normalPriceCount(data.fullPrice)}</p>}
            </td>
            <td className="long-td">
            {editMode?<div className="more-btn">
                <i className="fa-solid fa-save"
                onClick={updateField}></i>
                <i className="fa-solid fa-remove"
                onClick={()=>setEditMode(0)}></i>
                </div>:
                <div className="more-btn">
                {props.canEdit?<i className="fa-solid fa-pen"
                onClick={()=>setEditMode(1)}></i>:<></>}
                <i className="fa-solid fa-comment"
                onClick={()=>setShowDesc(1)}></i>
                {/* {data.stock?<i className="fa-solid fa-sign-out storeSelect"
                onClick={()=>updateField({stock:""})}></i>:
                <i className="fa-solid fa-sign-out"
                    onClick={()=>updateField({stock:"9"})}></i>} */}
                <i className="fa-solid fa-trash" style={{color: "red"}}
                onClick={()=>setShowRemove(1)}></i>
            </div>}
            </td>
        </tr>
        {showRemove?
          <ErrorAction status={"DELETE"} title={"حذف آیتم"} 
            text={"آیتم انتخاب شده حذف خواهد شد. آیا مطمئن هستید؟"} linkText={""} style={{direction:"rtl"}}
            buttonText="حذف" close={()=>setShowRemove()}
            color="red" action={()=>props.action?defAction():removeItem()}/>:
          <></>}
          {showDesc?<DataModal action={
            (e)=>updateField({description:e})}
            close={()=>setShowDesc(0)} color="darkblue"
            buttonText="تغییر توضیحات" def={data.description} 
            title={"تغییر توضیحات"}/>:
            <></>}
        </>
    )
}
export default QuickRow