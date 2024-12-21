import React,{useEffect,useState} from 'react'
import env,{normalPriceRound,normalPriceCount} from '../../env'
const ProductInfoHolder = (props) => {
  const sku=props.ProductInfo.sku
  const token = props.token
  const [Content , setContent]=useState("")
  const [Price,setPrice]=useState("")
  useEffect(() => {
    
    const postOptions={
        method:'post',
        headers: {'Content-Type': 'application/json',
        "x-access-token":token&&token.token,"userId":token&&token.userId},
        body:JSON.stringify({sku:sku})
      }
  fetch(env.siteApi + "/esale/fetch-product",postOptions)
  .then(res => res.json())
  .then(
    (result) => {
      
        
        setTimeout(()=> setContent(result.data),200)
        setPrice(result.data.priceDetail&&result.data.priceDetail)
    },
    (error) => {
      console.log(error);
    }
    
  )},[sku])
  console.log(Price)
  return (
    <div className="admin-table-sec" >
      <table>
        <caption><p >هر گرم تمام شده: <span>{normalPriceCount(Price.unitGold)}</span></p></caption>
        <thead>
          <tr>
            <th data-cell="نام کالا">
              <p>نام کالا</p>
            </th>
            <th data-cell="کد کالا">
              <p>کد کالا</p>
            </th>

            <th data-cell="هر گرم طلا خام" ><p>هر گرم طلا خام</p></th>
            <th data-cell={"اجرت هر گرم"+"("+(Price&&Price.ojratValue)+"%)"} >
              <p>{"اجرت هر گرم"+"("+(Price&&Price.ojratValue)+"%)"}</p>
              </th>
            <th data-cell="وزن"><p>وزن</p></th>
            <th data-cell="قیمت طلا"><p>قیمت طلا</p></th>
            <th data-cell="سود"><p>سود</p></th>
            <th data-cell="متعلقات"><p>متعلقات</p></th>
            <th data-cell="مالیات"><p>مالیات</p></th>
            <th data-cell="قیمت نهایی"><p>قیمت نهایی</p></th>
          </tr>
        </thead>
        <tbody>
          <tr className="product-tr product-info">
            <td data-cell="نام کالا">
              <p>{Content.title}</p>
            </td>
            <td data-cell="کد کالا">
              <p>{Content.sku}</p>
            </td>
            <td data-cell="سایز">
              <p>{Content.size}</p>
            </td>
            <td data-cell="هر گرم طلا خام"><p>{normalPriceCount(Price.unitPrice)}</p></td>
            <td data-cell={"اجرت هر گرم"+"("+(Price&&Price.ojratValue)+"%)"}><p>{normalPriceRound(Price.ojratPrice)}</p></td>
            <td data-cell="وزن"><p>{Content.weight}</p></td>
            <td data-cell="قیمت طلا"><p>{normalPriceRound(Price.goldPrice)}</p></td>
            <td data-cell="سود"><p>{normalPriceRound(Price.senfiPrice)}</p></td>
            <td data-cell="متعلقات"><p>{normalPriceRound(Price.poolSang)}</p></td>
            <td data-cell="مالیات"><p>{normalPriceRound(Price.taxPrice)}</p></td>
            <td className="long-td" data-cell="قیمت نهایی"><p>{normalPriceRound(Price.roundPrice)}</p></td>
          </tr>
        </tbody>
      </table>
      
    </div>
  )
}

export default ProductInfoHolder
