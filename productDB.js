require("dotenv").config()

const ConnectDB = require("./db/connect")
const Restaurant = require("./models/RestaurantModel")
const User = require("./models/userModel")


const userJson = require("./user.json")
const restaurantJson = require("./Restaurant.json")

const Start = async()=>{
  try {
    await ConnectDB(process.env.MONGODB_URL);
    await User.create(userJson);


    await Restaurant.deleteMany();
    await Restaurant.create(restaurantJson);
    console.log("success")
  } catch (error) {
    console.log(error)
  }
}


Start()