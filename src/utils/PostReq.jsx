import Cookies from "universal-cookie";
import env from "../env";
import ReactDOM from "react-dom/client";

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
          error.render(<h1>{result.error}</h1>);
        } else {
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
