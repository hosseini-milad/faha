import { useState } from "react"

function CartTab(props){
    //const [tab,setTab] = useState(0)
    return(
      <nav className="slidemenu">

      <input type="radio" name="slideItem" id="slide-item-1" className="slide-toggle" defaultChecked />
      <label htmlFor="slide-item-1" onClick={()=>{props.setTab(0);props.setSelectedItem("")}} className={props.tab===0?"sliderMenuSelect":"sliderMenu"}>
        <span>فاکتور فروش</span>
        <div className="sliderMenu"></div>
      </label>

      <input type="radio" name="slideItem" id="slide-item-2" className="slide-toggle" />
      <label htmlFor="slide-item-2" onClick={()=>{props.setTab(1);props.setSelectedItem("")}} className={props.tab===1?"sliderMenuSelect":""}>
        <span>فاکتور خرید</span>
        <div className="sliderMenu"></div>
      </label>


    </nav>
    )
}
export default CartTab