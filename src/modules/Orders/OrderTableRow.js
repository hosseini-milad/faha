import React, { useState,useEffect } from "react";
import Status from "../Components/Status";
import PayStatus from "../Components/PayStatus";
import { normalPriceCount, normalPriceRound, rxFindCount } from "../../env";
import OrderQuickDetail from "./OrderComponent/OrderQuickDetail";
import tabletrans from "../../translate/tables";
import OrderQuickCart from "./OrderComponent/OrderQuickCart";
import env from "../../env"

function OrderTableRow(props) {
  const [openOption, setOpenOption] = useState(0);
  const [checkState, setCheckState] = useState(0);
  const activeAcc = props.index === props.detail;
  const order = props.order;
  const lang = props.lang;
  const cart = props.cart;
  useEffect(()=>{
    setCheckState(props.allcheck)
  },[props.allcheck])
  
  const updateCheckBox=(field,action)=>{
    setCheckState(action?false:true)
    if(!action){
      if(props.selectedOrder){
        var index = props.selectedOrder&&
          props.selectedOrder.length
        props.setSelectedOrder(existingItems => {
          return [
            ...existingItems.slice(0, index),
            field,
            ...existingItems.slice(index + 1),
          ]
        }) 
      }
      else{
          props.setSelectedOrder([field])
        
      }
    }
    else{
      //const cartNo = e.target.getAttribute("cartNo")
      props.setSelectedOrder(l => 
        l.filter(item => item.cartNo !== field.cartNo));
    }
    console.log(props.selectedOrder)
  }
  return (
    <React.Fragment>
      <tr className={activeAcc ? "activeAccordion" : "accordion"}>
        <td>{props.index+1}</td>
        <td className="checkBoxStyle">
          {order.taskInfo&&order.taskInfo[0]&&
          order.taskInfo[0].taskStep=="done"?<input
            type="checkbox"
            checked={checkState}
            onChange={(e) =>  updateCheckBox(order,checkState)}
          />:<></>}
        </td>
        <td>
          <div className="order-id">
            <p onClick={() =>
                  (window.location.href = "/orders/detail/" + order.faktorNo)
                }>
                {order.faktorNo}
              </p>
            
          </div>
        </td>
        <td>
          <div className="cu-avatar">
            <img src="/img/avatar/avatar_1.jpg" alt="avatar" />
            <div className="cu-name">
              <p className="name">
                {order.userInfo&&order.userInfo[0]
                  ? order.userInfo[0].cName + "---" + order.userInfo[0].sName
                  : "---"}
              </p>
            </div>
            {order.moreInformation ? (
              <i className="fa fa-comment-o" title={order.moreInformation}></i>
            ) : (
              <></>
            )}
          </div>
        </td>
        <td>
          <div className="order-num">
            <p className="email">
              {order.userInfo&&order.userInfo[0]
                ? order.userInfo[0].phone
                : tabletrans.notEntered[lang]}
            </p>
          </div>
        </td>
        <td>
          <PayStatus
            payStatus={order.payStatus}
            class={"order-status"}
            lang={props.lang}
          />
        </td>
        <td>
          <div className="order-num">
            <p>{order.transport}</p>
          </div>
        </td>
        <td>
            <div className="or-date">
              <p className="date">
                {new Date(order.initDate).toLocaleDateString(
                  "fa")}
              </p>
              <p className="time">
                {new Date(order.initDate).toLocaleTimeString(
                  props.lang === "persian" ? "fa" : "en"
                )}
              </p>
            </div>
          
        </td>

        <td>
          <div className="order-price">
            <p>{normalPriceRound(order.totalCart&&
              order.totalCart.totalPrice)}</p>
          </div>
        </td>
        <td>
          {order.taskInfo&&order.taskInfo[0]&&
          order.taskInfo[0].taskStep=="archive"?"آماده":""}
          <Status
            status={order.status}
            class={"order-status"}
            lang={props.lang}
          />
        </td>

        <td>
          <div className="more-btn">
            <i
              className={`tableIcon fas ${
                activeAcc ? "fa-chevron-up" : "fa-chevron-down"
              }`}
              onClick={() => props.showDetail(activeAcc ? "-1" : props.index)}
            ></i>
            {/* <i
              className="tableIcon fas fa-edit"
              onClick={() =>
                (window.location.href = "/orders/detail/" + order.cartNo)
              }
            ></i> */}
            <i
              className="tableIcon fas fa-print"
              onClick={() =>(window.location.href = "/print/official/" + order.faktorNo)}
            ></i>
            
          </div>
          
          
        </td>
      </tr>
      {activeAcc ? (
        <tr className="sub-order">
          <td colSpan="10">
          {order?<div className="sub-order-table">
                {order&&order.items.map((item,i)=>(
                    <div className="sub-row" key={i}>
                      <div className="sub-avatar">
                        <div className="sub-avatar-container">
                          <img src={env.siteApiUrl+item.thumbUrl}
                          alt={item.sku}/>
                          <div className="sub-info">
                          <p className="sub-name">{item.title}</p>
                          <p className="sub-id">کد محصول: {item.sku}</p>
                          </div>
                        </div>
                      </div>
                      <div className="sub-num">{item.weight+"g"}</div>
                    <div className="sub-price">{normalPriceCount(item.price)}</div>
                </div>))}
                
            </div>:env.loader}
          </td>
        </tr>
      ) : (
        <React.Fragment></React.Fragment>
      )}
    </React.Fragment>
  );
}
export default OrderTableRow;
