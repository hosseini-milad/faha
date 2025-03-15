import StyleInput from "../../../components/Button/Input";
import StyleSelect from "../../../components/Button/AutoComplete";
import { notNull } from "../../../env";

function CustomerFilters(props) {
  const handleFilterChange = (property, value) => {
    const newValue = value ? (value._id ? value._id : value) : "";
    props.setFilters((prevState) => ({
      ...prevState,
      [property]: newValue,
    }));
    // Update URL here
    props.updateUrlWithFilters({
      ...props.currentFilters,
      [property]: newValue,
    });
  };
  return (
    <div className="user-filter">
      {/* <StyleSelect
        title={"نقش"}
        class="filterComponent"
        direction={props.lang.dir}
        options={props.options}
        action={(e) => handleFilterChange("access", e)}

      /> */}
      {/* <StyleSelect
        title={"گروه"}
        class="filterComponent"
        label="group"
        direction={props.lang.dir}
        options={notNull(props.groupList,"group")}
        action={(e) => handleFilterChange("groupCode", e?e.groupCode:'')}

      /> */}

      <div className="serach-input">
        <StyleInput
          title={"مشتری"}
          direction={props.lang.dir}
          action={(e) => handleFilterChange("customer", e)}
        />
      </div>
    </div>
  );
}
export default CustomerFilters;
