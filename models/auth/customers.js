const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  username: { type: String},
  cName: { type: String},
  sName:{ type: String},
  phone: { type: String, unique: true },
  password: { type: String },
  mobile:{type: String },
  email: { type: String},
  profile:{type:String},
  class: {type:Array,default:[]},
  access:{type:String},
  group: { type:String },
  groupCode: { type:String },
  credit: { type: String },
  token: { type: String },
  otp:{ type: String , default: null },
  active:{ type: Boolean },
  status:{ type: String },
  cCode:{ type: String },
  birthDay:{ type: Object },

  CustomerID:{ type: String },
  Address:{ type: String },
  AddressID:{ type: String },
  meliCode:{ type: String },  
  postalCode:{ type: String },   
  
  state:{ type: String },
  stateId:{ type: String },
  city:{ type: String },
  cityId:{ type: String },

  type:{ type: String },
  Liability:{ type: String },
  Credits:{ type: String },
  date:{type:Date} 
});

module.exports = mongoose.model("customers", customerSchema);