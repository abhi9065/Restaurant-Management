require("dotenv").config()

const ConnectDB = require("./db/connect")
const product = require("./models/product")

const productJson = require("./product.json")

const Start = async()=>{
  try {
    await ConnectDB(process.env.MONGODB_URL);
    console.log("ConnectDB");
    await product.create(productJson);
    console.log("success")
  } catch (error) {
    console.log(error)
  }
}


Start()