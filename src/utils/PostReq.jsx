import Cookies from "universal-cookie";
import env from "../env";
import ReactDOM from "react-dom/client";
import { useState } from "react";

const PostReq = async (props) => {
  const cookies = new Cookies();
  const error = ReactDOM.createRoot(document.getElementById("error"));
  const method = props.method ? props.method : "GET";
  const token = cookies.get(env.cookieName);
  const body = props.body;
  const header = {
    "Content-Type": "application/json",
    "x-access-token": token && token.token,
    userid: token && token.userId,
  };
  var color = props.color?props.color:"lignBlue"
    var icon = props.icon?props.icon:"info-circle"
  var options =
    method == "GET"
      ? {
          method: "GET",
          headers: header,
        }
      : {
          method: "POST",
          headers: header,
          body: JSON.stringify(body),
        }; 
  const res= await fetch(env.siteApi + props.url, options)
    .then((res) => res.json())
    .then(
      (result) => { 
        if (result.error) {
          error.render(<div className="notification-modal">
            <div className="n-m-box" style={{borderColor:color}}>
              <p className="top-p" style={{backgroundColor:color}}>
                    {"status"}</p>
              <i className={`fa fa-lg fa-${icon}` }
                style={{color: color}}></i>
              <p>{result.error}</p>
              <a href="#" style={{color:color}}>{"Text"}</a>
            </div>
        </div>);
        setTimeout(()=>error.render(),3000)
        } else {
          error.render(<div className="notification-modal">
            <div className="n-m-box" style={{borderColor:color}}>
              <p className="top-p" style={{backgroundColor:color}}>
                    {"status"}</p>
              <i className={`fa fa-lg fa-${icon}` }
                style={{color: color}}></i>
              <p>{result.message}</p>
              <a href="#" style={{color:color}}>{"Text"}</a>
            </div>
        </div>);
        setTimeout(()=>error.render(),3000)
        return result;
        }
      },
      (error) => {
        return error.render(<h1>{error}</h1>);
      }
    );
  return(res)
};

export default PostReq;
