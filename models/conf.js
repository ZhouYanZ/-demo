// conf 集合
const mongoose = require("../config/db");

const confSchema = new mongoose.Schema({
  onlyId: { type: Number, default: 1 },
  // access_token
  token: { type: String, default: "" },
  // token 过期时间
  tokenTime: {
    type: Number,
    default: () => {
      return Math.floor(new Date().getTime() / 1000) + 7000;
    }
  },
  // jsapi_ticket
  ticket: { type: String, default: "" },
  // ticket 过期时间
  ticketTime: {
    type: Number,
    default: () => {
      return Math.floor(new Date().getTime() / 1000) + 7000;
    }
  }
});

module.exports = mongoose.model("conf", confSchema);
