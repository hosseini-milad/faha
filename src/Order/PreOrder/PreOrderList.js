import PreOrderItem from "./PreOrderItem"
import env from "../../env"
import { useEffect,useState } from "react"
function PreOrderHolder(props){
  const cart=props.cart
  const total= props.cart&&props.cart.cartDetail
  const token = props.token
  // useEffect(() => {
    
  //   const postOptions = {
  //     method: "post",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "x-access-token": token && token.token,
  //       userId: token && token.userId,
  //     },
  //     body: JSON.stringify(),
  //   };
  //   fetch(env.siteApi + "/panel/faktor/list-faktor", postOptions)
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         setCart(result)
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  // }, []);

  if(!cart) return(<></>)
  else return(
        <section className="orders-sec">
        <div className="title">
          <p>سفارشات اخیر</p>
          <div className="orders-total">
            <p>تعداد سفارشات : {cart.faktorSize}</p>
          </div>
        </div>
        {cart.faktorData&&cart.faktorData.map((cart,i)=>(
          <PreOrderItem key={i} data={cart}
            total={total} index={i}/>
        ))}
      </section>
    )
}
export default PreOrderHolder