import Cookies from "universal-cookie";
import env from "../env";

const PostReq = async (props) => {
  const cookies = new Cookies();
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
  return await fetch(env.siteApi + props.url, options)
    .then((res) => res.json())
    .then(
      (result) => {
        if (result.error) {
          return <h2>{result.error}</h2>;
        } else {
          return result;
        }
      },
      (error) => {
        return <h2>hiiiiiii</h2>;
      }
    );
};

export default PostReq;
