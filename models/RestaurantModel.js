const mongoose = require("mongoose")

const RestaurantSchema = new mongoose.Schema({
  
  name: String,
  cuisine: [String],
  address: String,
  city: String,
  rating: Number,
  menu: [
    {
      name: String,
      price: Number,
      description: String,
      isVeg: String
    }
  ],
  averageRating: Number,
 
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: String, 
      ratings : [{
        type : Number,
        min : 0 ,
        max: 10
      }]
    },
  ],
});

const Restaurants = mongoose.model("Restaurant" , RestaurantSchema)

module.exports = Restaurants ; 
