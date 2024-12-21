import { useState } from "react"
import QuickNew from "./QuickNew"
import QuickRowOrder from "./QuickRowOrder"

function QuickTable(props){
  const qCart= props.cart
  const [reload,setReload] = useState(1)
    return(
    <table>
          <thead>
            <tr>
              <th data-cell="ردیف">
                <p>ردیف</p>
              </th>
              <th data-cell="کد کالا">
                <p>کد کالا</p>
              </th>
              <th data-cell="شرح کالا">
                <p>شرح کالا</p>
              </th>
              <th data-cell="عیار">
                <p>عیار</p>
              </th>
              <th data-cell="وزن">
                <p>وزن</p>
              </th>
              <th data-cell="مبلغ واحد">
                <p>مبلغ واحد</p>
              </th>
              <th data-cell="مبلغ کل">
                <p>مبلغ کل</p>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reload?<QuickNew pType={props.pType} cart={qCart} setTab={props.setTab} tab={props.tab} data={props.data} token={props.token}
              payValue={props.payValue?props.payValue:"4"} setCart={props.setCart}
              user={props.user} action={props.action} setError={props.setError}
              search={props.search} setSearch={props.setSearch}
              setReload={setReload}/>:
              <tr className="input-tr">
              <td colSpan={5}><p>در حال ثبت</p></td>
            </tr>}
            {qCart.map((item,i)=>(
              <QuickRowOrder tab={props.tab} data={item} key={i} index={i+1} payValue={props.payValue?props.payValue:"4"}
              action={props.delete} setError={props.setError}
              token={props.token} user={props.user} setCart={props.setCart}
              cartNo={props.cartNo} canEdit={props.canEdit}/>
            ))}
          </tbody>
        </table>
    )
}
export default QuickTable