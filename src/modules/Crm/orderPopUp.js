import { useEffect, useState } from "react"
import TaskMainPart from "./Tasks/TaskMainPart"
import env, { defPay } from "../../env"
import QuickCartHolder from "../../Order/QuickCart/QuickCartHolder"
import ShowError from "../../components/Modal/ShowError"
import TaskAction from "./Tasks/TaskAction"
import QuickRow from "../../Order/QuickCart/QuickRow"

function OrderPopUp(props){
    const data =props.data
    const token = props.token
    const [payValue,setPayValue] = useState(defPay)
    const [content,setContent] = useState()
    //console.log(content)
    const [error,setError] = useState({message:'',color:"brown"})
    useEffect(()=>{
        const postOptions={
            method:'post',
            headers: {'Content-Type': 'application/json',
                "x-access-token": token&&token.token,
                "userId":token&&token.userId
            },
            body:JSON.stringify({faktorNo:data?data.faktorNo:''})
          }
      fetch(env.siteApi + "/panel/faktor/fetch-faktor",postOptions)
      .then(res => res.json())
      .then(
        (result) => {
            setContent(result)
        },
        (error) => {
          console.log(error);
        })
    },[])
    
    if(!content){
        return
    } else
    return(
    <section className="delete-modal">
        <div className="modal-backdrop show-modal">
            <div className="task-popup fullPopUp">
                <div className="orderModalTitle">
                    <span>{data.cName} </span>
                    <sub>({data.phone})</sub>
                    <span> شماره سفارش: {data.faktorNo}</span>
                    <div className="address-status">
                         آدرس:  
                    {(props.customer&&props.customer[0])?
                        props.customer[0].Address:"-"} </div>
                </div>
                <div className="orderModalDate">
                <p className="date">{new Date(data.initDate)
                  .toLocaleDateString('fa')}</p>
                  <p className="time">{new Date(data.initDate)
                  .toLocaleTimeString('fa')}</p>
                </div>
                <i className="fa fa-remove closeModal" 
                    onClick={props.close}></i>
                <div className="sharif" style={{padding: "70px 10px 10px"}}>
                    <main className="sharif-order-main">
                        <section className="admin-table-sec ">
                            <table>
                                <tbody>
                                    <tr>
                                        <th data-cell="ردیف"><p>ردیف</p></th>
                                        <th data-cell="شرح"><p>شرح</p></th>
                                        <th data-cell="عیار"><p>عیار</p></th>
                                        <th data-cell="وزن"><p>وزن</p></th>
                                        <th data-cell="اجرت"><p>اجرت</p></th>
                                        <th data-cell="مبلغ(ریال)"><p>ریال</p></th>
                                        </tr>
                                    {content?
                                    content.data&&content.data.items.map((item,i)=>(
                                        <QuickRow data={item} key={i} index={i+1} payValue={props.payValue?props.payValue:"4"}
                                        action={props.delete} setError={props.setError}
                                        token={props.token} user={props.user} setCart={props.setCart}
                                        cartNo={props.cartNo} canEdit={props.canEdit}/>
                                    )):
                                    <div>{env.loader}</div>}
                                    
                                </tbody>
                            </table>
                        </section>
                    </main>
                </div>
            {/* {props.access&&props.access==="edit"?
            <div className="crmAction">
                <TaskAction content={content} token={token}
                data={props.data} setBoard={(e)=>props.setBoardArray(e)}
                close={props.close}/>
            </div>:<></>} */}
            </div>
            
        </div>
        {error&&error.message?
        <ShowError color={error.color} status={"مدیریت"} 
        text={error.message} />:<></>}
    </section>
    )
}
export default OrderPopUp