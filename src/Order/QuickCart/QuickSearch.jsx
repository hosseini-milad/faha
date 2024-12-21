import { useEffect, useState } from "react"
import env,{findBox} from "../../env"
import CountCalculator from "./CountCalculator"
import CartTab from "./CartTab"
import StyleSelect from "../../components/Button/AutoComplete"
function SalesQuickSearch(props){
    const data = props.data
    const [showDrop,setShowDrop] = useState(0)
    const [query,setQuery] = useState('')
    useEffect(() => {
        const timeOutId = setTimeout(() => props.setSearch(query), 1000);
        return () => clearTimeout(timeOutId);
        //props.setSearch
      }, [query]);
    return(<>
        <CartTab setSelectedItem={props.setSelectedItem} setTab={props.setTab} tab={props.tab} />
        {!props.tab?<div className="code-input-wrapper">
            <input 
            className="dp-input" 
            type="text" 
            placeholder="جستجوی اتیکت "
            onChange={(e)=>setQuery(e.target.value)}
            />
            <i className="fa-solid fa-angle-down"></i>
        </div>:
        
            <StyleSelect
            class={"code-input-wrapper"}
            title="نوع خرید"
            // direction={props.lang.dir}
            options={props.pType}
            label="title"
            action={(e) => props.setSelectedItem(e?e:"")}
            />
        }
        
        {query?
        <div className="code-drop-menu">
            {data?data.data&&data.data.map((item,i)=>(
                    <div
                        key={i}
                        className="menu-item"
                        onClick={(e)=>{
                        (props.setSelectedItem(item));
                        (setQuery(""))
                        }
                    }>
                        <div className="item-img">
                            <img src={env.siteApiUrl+item.imageUrl} alt=""/>
                        </div>
                        <div className="item-info">
                            <div className="item-p">
                                <p>{item.title}</p>
                            </div>
                            <div className="item-amount">
                                <p>{item.sku}</p>
                                <p>{item.weight}</p>
                                <p>{item.isMojood?"موجود":"ناموجود"}</p>
                            </div>
                        </div>
                    </div>
            
            )):<div className="roader">{env.loader}</div>}
        </div>:<></>}
    </>
    )
}
export default SalesQuickSearch