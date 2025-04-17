import { useState } from "react";
import ErrorAction from "../../components/Modal/ErrorAction";
import env, { normalPriceCount, payValue, normalPriceRound } from "../../env";
import DataModal from "../../components/Modal/dataModal";
import QuickOff from "./QuickOff";
import PostReq from "../../utils/PostReq";
import QuickCounter from "./QuickCounter";
function QuickRow(props) {
  const data = props.data;
  const isEdit = props.isEdit;
  const [Edit, setEdit] = useState(false);
  const [ShowModal, setShowModal] = useState(false);
  const [Count, setCount] = useState(data.count);
  const [Discount, setDiscount] = useState(data.discount);
  const [Price, setPrice] = useState(data.unitPrice);
  const Status = props.faktorData.status;
  const DeleteItem = async () => {
    const result = await PostReq({
      method: "Post",
      url: "/panel/faktor/remove-faktor-item",
      body: { faktorItemNo: data._id },
    });
    props.setContent(result);
  };
  const UpdateItem = async () => {
    const result = await PostReq({
      method: "Post",
      url: "/panel/faktor/update-faktor-item",
      body: {
        faktorItemNo: data._id,
        count: Count,
        discount: Discount,
        unitPrice: Price,
      },
    });
    props.setContent(result);
    setEdit(false);
  };
  console.log(Count);
  return (
    <>
      <tr className={`product-tr ${data.isRecieved ? "receivedTr" : ""}`}>
        <td data-cell="ردیف">
          <p>{props.index}</p>
        </td>
        <td data-cell="نام کالا">
          <div className="product-titleFull">
            {/* <img src="/img/business/oil1.png" alt="avatar"/> */}
            <div className="product-name">
              <p className="name">
                {data.title}({data.sku})
              </p>
            </div>
          </div>
        </td>
        <td data-cell="تعداد">
          {Edit ? (
            <QuickCounter setCount={setCount} count={Count} unit={10} />
          ) : (
            <p>
              {data.count}
              {Status == "prepair" && (
                <span style={{ color: "green" }}>
                  ({data.recieveCount ? data.recieveCount : "0"})
                </span>
              )}
            </p>
          )}
        </td>
        <td data-cell="قیمت واحد(ریال)">
          {Edit ? (
            <input
              type="text"
              defaultValue={data.unitPrice}
              placeholder="قیمت واحد"
              className="price-input"
              onChange={(e) => setPrice(e.target.value)}
            />
          ) : (
            <p>{normalPriceCount(data.unitPrice)}</p>
          )}
        </td>
        <td data-cell="تخفیف">
          {Edit ? (
            <QuickOff
              change={(e) => setDiscount(e)}
              discount={Discount ? Discount : 0}
            />
          ) : (
            <p>{data.discount ? data.discount + "%" : "0%"}</p>
          )}
        </td>
        <td data-cell="قیمت نهایی(ریال)">
          <p>{normalPriceCount(data.price)}</p>
        </td>
        <td className="icon-styles">
          {isEdit ? (
            Edit ? (
              <>
                <i
                  class="fa fa-check"
                  aria-hidden="true"
                  style={{ color: "green" }}
                  onClick={UpdateItem}
                ></i>
                <i
                  className="fa-solid fa-remove"
                  onClick={() => setEdit(false)}
                ></i>
              </>
            ) : (
              <>
                <i
                  class="fa fa-pencil-square-o"
                  aria-hidden="true"
                  onClick={() => setEdit(true)}
                ></i>
              </>
            )
          ) : (
            <></>
          )}
          {isEdit ? (
            <i
              class="fa fa-trash"
              aria-hidden="true"
              onClick={() => setShowModal(true)}
              style={{ color: "red" }}
            ></i>
          ) : (
            <></>
          )}
        </td>
      </tr>
      {ShowModal && (
        <ErrorAction
          status={"DELETE"}
          title={"حذف آیتم"}
          text={"آیتم انتخاب شده حذف خواهد شد. آیا مطمئن هستید؟"}
          linkText={""}
          style={{ direction: "rtl" }}
          buttonText="حذف"
          close={() => setShowModal(false)}
          action={DeleteItem}
          color={"red"}
        />
      )}
    </>
  );
}
export default QuickRow;
