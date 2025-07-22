import { useState, useEffect } from "react";
import FilterGrid from "./FilterGrid";
import StyleSelect from "../../components/Button/AutoComplete";
import StyleInput from "../../components/Button/Input";
import { notNull } from "../../env";
import env from "../../env";
import PostReq from "../../utils/PostReq";
function OrderFilters(props) {
  const [SubCat, setSubCat] = useState();
  const [FiltersList, setFiltersList] = useState();

  const filters = props.filters;
  const brands =
    filters && filters.brands ? notNull(filters.brands, "title") : [];
  const cat = filters && filters.cats;

  const updateFilter = (kind, value) => {
    //console.log(kind ,value)
    props.setFilters((prevState) => ({
      ...prevState,
      [prevState[kind]]: value,
    }));
    props.appFilter
      ? props.setAppFilter((prevState) => ({
          ...prevState,
          [prevState[kind]]: value,
        }))
      : props.setAppFilter({ [kind]: value });
  };
  const fetchFilters = async () => {
    const result = await PostReq({
      method: "post",
      url: "/panel/product/list-category",
    });
    setFiltersList(result);
  };
  // Debounce state for search input
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    if (searchValue === "") return;
    const handler = setTimeout(() => {
      props.setAppFilter((prevState) => ({
        ...prevState,
        title: searchValue,
      }));
    }, 2000);
    return () => clearTimeout(handler);
  }, [searchValue]);
  useEffect(() => {
    fetchFilters();
  }, []);
  return (
    <div className="filter-sec">
      <div className="list-filter-wrapper">
        <div className="main-filters">
          <div className="f-company">
            <StyleInput
              title={"جستجو"}
              direction={"rtl"}
              action={(e) => setSearchValue(e || "")}
            />
          </div>
          {/* <StyleSelect
            title={"برند"}
            direction={"rtl"}
            options={(FiltersList && FiltersList.brands) || []}
            label="title"
            class="f-company"
            action={(e) =>
              props.setAppFilter((prevState) => ({
                ...prevState,
                brand: e ? e.brandCode : "",
              }))
            }
          /> */}
          <StyleSelect
            title={"دسته بندی"}
            direction={"rtl"}
            options={(FiltersList && FiltersList.cats) || []}
            label="title"
            class="f-company"
            action={(e) => {
              props.setAppFilter((prevState) => ({
                ...prevState,
                category: e ? e.catCode : "",
              }));
              props.setFilters((prevState) => ({
                ...prevState,
                category: e ? e.catCode : "",
              }));
            }}
          />
          {/* <StyleSelect
              title={"زیر دسته بندی"}
              direction={"rtl"}
              options={SubCat || []}
              label="title"
              class="f-company"
              action={(e) =>
                props.setAppFilter((prevState) => ({
                  ...prevState,
                  subCat: e ? e.catCode	 : " ",
                }))
              }
            /> */}
        </div>
      </div>
    </div>
  );
}
export default OrderFilters;
