import { useState } from "react";
import env from "../../env";
import ManageUser from "./ManageUser";
import { useNavigate } from "react-router-dom";

function OrderHeader(props) {
  const navigate = useNavigate();
  const token = props.token;
  const [showDrop, setShowDrop] = useState(0);
  const [showProduct, setShowProduct] = useState(0);
  const [showUsers, setShowUsers] = useState(0);
  const [customers, setCustomers] = useState();
  const [ProductList,setProductList]=useState("")
  const ProductInfo=props.ProductInfo
  const setProductInfo=props.setProductInfo
  const findCustomer = (search) => {
    if (search.length < 3) {
      //setShowPop(0)
      return;
    }
    //console.log(search)
    const postOptions = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token && token.token,
        userId: token && token.userId,
      },
      body: JSON.stringify({ search: search }),
    };
    fetch(env.siteApi + "/panel/faktor/customer-find", postOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.customers)
            if (result.error) {
              props.setError({ message: result.error, color: "brown" });
            } else {
              setCustomers(result.customers);
            }
        },
        (error) => {
          console.log(error);
        }
      );
  };
  const findProduct = (search) => {
    
    const postOptions = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token && token.token,
        userId: token && token.userId,
      },
      body: JSON.stringify({ search: search }),
    };
    fetch(env.siteApi + "/esale/list-product", postOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          setProductList(result)
        },
        (error) => {
          console.log(error);
        }
      );
  };
  const gotToOpenOrders = () => {
    navigate("/orders/open");
  };
  return (
    <div className="nav-bar">
      <div className="logo-wrapper">
        <img src="\img\zar-logo.PNG" alt="Logo" />
      </div>
      {props.user ? (
        <div className="f-customer">
          <div className="user-item">
            <b>
              {props.user.username}
              {props.user.agent ? (
                <></>
              ) : (
                <i className="fa-solid fa-check-circle" aria-hidden="true"></i>
              )}

              <small>
                ({props.user.phone ? props.user.phone : props.user.mobile})
              </small>
            </b>
            <small>{props.user.Address ? props.user.Address : "-"}</small>
          </div>
          <i
            className="fa-solid fa-remove"
            style={{ margin: "0", color: "#000" }}
            onClick={() => props.setUser("")}
          ></i>
        </div>
      ) : (<>
        <div className="f-customer">
          <input
            type="search"
            name=""
            id="f-search"
            placeholder="مشتری"
            onChange={(e) => findCustomer(e.target.value)}
            onFocus={() => setShowDrop(1)}
            onBlur={() => setTimeout(() => setShowDrop(0), 200)}
          />
          <i
            className="fa-solid fa-plus"
            style={{ margin: "0", color: "#000" }}
            onClick={() => setShowUsers(1)}
          ></i>
        </div>
        
        </>
      )}
      {props.user ?(<></>):
        ProductInfo?
        <div className="f-customer">
          <div className="user-item">
            <b>
              {ProductInfo.title}
              

              <small>
                ({ProductInfo.sku})
              </small>
            </b>
            
          </div>
          <i
            className="fa-solid fa-remove"
            style={{ margin: "0", color: "#000" }}
            onClick={() => props.setProductInfo("")}
          ></i>
        </div>:
        
        <div className="f-customer">
          <input
            type="search"
            name=""
            id="p-search"
            placeholder="جستجوی اتیکت"
            onChange={(e) => findProduct(e.target.value)}
            onFocus={() => setShowProduct(1)}
            onBlur={() => setTimeout(() => setShowProduct(0), 200)}
          />
          <i
            className="fa-solid fa-search"
            style={{ margin: "0", color: "#000" }}
          ></i>
        </div>}
      {showDrop ? (
        <div className="f-customer-dropdpwn">
          {customers &&
            customers.map((customer, i) => (
              <div
                className="menu-item"
                key={i}
                onClick={() => {props.setUser(customer);props.setProductInfo("")}}
              >
                <p className="bu-name">
                  {customer.username}

                  {customer.agent ? (
                    <></>
                  ) : (
                    <i
                      className="fa-solid fa-check-circle"
                      aria-hidden="true"
                    ></i>
                  )}
                </p>
                <div className="info-holder col">
                  <span>
                    <i
                      className="fa-solid fa-phone no-font id-icon"
                      aria-hidden="true"
                    ></i>
                    {customer.phone ? customer.phone : "........"}
                  </span>
                </div>
                <p className="bu-address">
                  {customer.Address ? customer.Address : "-"}
                </p>
              </div>
            ))}
        </div>
      ) : (
        <></>
      )}
      {!0 ? (
              <div className="f-customer-dropdpwn">
                {ProductList &&
                  ProductList.data.map((product, i) => (
                    <div
                      className="menu-item"
                      key={i}
                      onClick={() => setProductInfo(product)}
                    >
                      <p className="bu-name">
                        {product.title}
                      </p>
                      <div className="info-holder col">
                        <span>
                          <i
                            className="fa-solid fa-barcode no-font id-icon"
                            aria-hidden="true"
                          ></i>
                          {product.sku}
                        </span>
                        <span className="icon-span">
                          <img src="/img/weight-icon.png" alt="weight"/>
                          {product.weight}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
      ):<></>}
      <ManageUser show={showUsers} close={() => setShowUsers(0)} />
    </div>
  );
}
export default OrderHeader;
