const express = require("express");
const router = express.Router();
const Restaurant = require("../models/RestaurantModel");


const {
    GetAllProducts,
     GetAllProductsTesting } = 
    require( "../contoller/product")

router.route("/").get(GetAllProducts);
router.route("/Testing").get(GetAllProductsTesting)



async function createRestaurant(restaurantData) {
    try {
      const restaurant = new Restaurant(restaurantData);
      const savedRestaurant = await restaurant.save();
      console.log("Created Restaurant:", savedRestaurant);
      return savedRestaurant;
    } catch (error) {
      throw error;
    }
  }
  
  router.post('/restaurant', async (req, res) => {
    try {
      console.log(req.body)
      const savedRestaurant = await createRestaurant(req.body);
      res.status(201).json({ message: 'Restaurant added', restaurant : savedRestaurant });
    } catch (error) {
      console.log({ error })
      res.status(500).json({ error: 'Failed to add restaurant' });
    }
  });



    async function readRestaurantByName(restaurantname){
      try {
        const findname  = await Restaurant.findOne({name : restaurantname})
        return(findname)
      } catch (error) {
        console.log(error)
      }
      
      }
      
      router.get("/restaurant/:name" , async (req,res) => {
        try {
          const restaurant = await readRestaurantByName(req.params.name)
          res.status(201).json({restaurant : restaurant})
        } catch (error) {
          res.status(404).json({error: "error not found"})
        }
      })

   
      
    async function readAllRestaurant(){
      try {
        const findname  = await Restaurant.find({})
        return(findname)
      } catch (error) {
        console.log(error)
      }
      
      }
      
      router.get("/read" , async (req,res) => {
        try {
          const restaurant = await readAllRestaurant(req.params.read)
          res.status(201).json({restaurant : restaurant})
        } catch (error) {
          res.status(404).json({error: "error not found"})
        }
      })
    

      async function readRestaurantByCuisine(restaurantCuisine){
        try {
          const findCuisine  = await Restaurant.find({ cuisine : restaurantCuisine})
          return(findCuisine)
        } catch (error) {
          console.log(error)
        }
        
        }
        
        router.get("/cuisine/:cuisineName" , async (req,res) => {
          try {
            const restaurant = await readRestaurantByCuisine(req.params.cuisineName)
            console.log(restaurant)
            res.status(201).json({restaurant : restaurant})
          } catch (error) {
            res.status(404).json({error: "error not found"})
          }
        })
  
      

        


async function updateRestaurant(restaurantId, updatedData) {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(restaurantId, updatedData, { new: true });
    return updatedRestaurant;
  } catch (error) {
    throw error;
  }
}

router.post('/update/:restaurantId', async (req, res) => {
  try {
    const updatedRestaurant = await updateRestaurant(req.params.restaurantId, req.body);
    if (updatedRestaurant) {
      res.json(updatedRestaurant);
    } else {
      res.status(404).json({ error: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
});



async function updateDataById(movieId){
  try {
    const updateRestaurant = await Restaurant.findByIdAndDelete(movieId)
    return updateRestaurant
  } catch (error) {
    throw error
  }
  }
  
  router.delete("/delete/:restaurantId" , async (req,res) => {
    try {
      const updateRestaurantData = await updateDataById(req.params.restaurantId)
      res.json(updateRestaurantData)
    } catch (error) {
      res.status(404).json({error:"error hai"})
    }
  
  })


  async function readRestaurantByLocation(restaurantQuery) {
    try {
      const findLocation = await Restaurant.find({
        $or: [
          { city: { $regex: new RegExp(restaurantQuery, "i") } },
          { address: { $regex: new RegExp(restaurantQuery, "i") } },
        ],
      });
      return findLocation;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  router.get("/search/:location", async (req, res) => {
    try {
      const { location } = req.params;
      const restaurant = await readRestaurantByLocation(location);
  
      console.log(restaurant);
      res.status(200).json({ restaurant: restaurant });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  
  async function createRestaurantMenuDish(restaurantId, dishData) {
    try {
      const restaurant = await Restaurant.findById(restaurantId);
  
      // Create a new dish
      const newDish = {
        name: dishData.name,
        price: dishData.price,
        description: dishData.description,
        isVeg: dishData.isVeg,
      };
  
      // Add the dish to the restaurant's menu
      restaurant.menu.push(newDish);
  
      // Save the updated restaurant
      const updatedRestaurant = await restaurant.save();
      
      console.log("Added Dish to Restaurant's Menu:", updatedRestaurant);
      return updatedRestaurant;

    } catch (error) {
      throw error;
    }
  }
  
  router.post('/restaurant/:restaurantId/add-dish', async (req, res) => {
    const { restaurantId } = req.params;
  
    try {
      const savedRestaurant = await createRestaurantMenuDish(restaurantId, req.body);
      res.status(201).json({ message: 'Dish added to the menu', restaurant: savedRestaurant });
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: 'Failed to add dish to the menu' });
    }
  });



  async function removeDishFromMenu(restaurantId, dishId) {
    try {
      const updateRestaurant = await Restaurant.findByIdAndUpdate(
        restaurantId, { menu: { _id: dishId } } , { new: true } 
      );
  
  
      console.log("Removed Dish from Restaurant's Menu:", updateRestaurant);
      return updateRestaurant;
    } catch (error) {
      throw error;
    }
  }
  
  router.delete('/restaurant/:restaurantId/remove-dish/:dishId', async (req, res) => {
    const { restaurantId, dishId } = req.params;
  
    try {
      const updatedRestaurant = await removeDishFromMenu(restaurantId, dishId);
      res.status(200).json({ message: 'Dish removed from the menu', restaurant: updatedRestaurant });
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: 'Failed to remove dish from the menu' });
    }
  });



  async function addRatingAndReview(restaurantId, userId, reviewText, rating) {
    try {
      const restaurant = await Restaurant.findById(restaurantId);
  
  
      // Create a new review object
      const newReview = {
        user: userId,
        text: reviewText,
        rating: rating,
      };
  
      // Add the review to the restaurant's reviews array
      restaurant.reviews.push(newReview);
  
      // Update the averageRating based on the new review
      const totalRating = restaurant.reviews.reduce((sum, review) => sum + review.ratings, 0);
      restaurant.averageRating = totalRating / restaurant.reviews.length;
  
      // Save the updated restaurant
      const restaurantWithReview = await restaurant.save();
  
      console.log("Added Review and Rating to Restaurant:", restaurantWithReview);
      return restaurantWithReview;
    } catch (error) {
      throw error;
    }
  }
  
  // POST route to add reviews and ratings for a restaurant
  router.post('/restaurant/:restaurantId/ratings', async (req, res) => {
    try {
      const restaurantId = req.params.restaurantId;
      const { userId, review, rating } = req.body;
  
      const updatedRestaurant = await addRatingAndReview(restaurantId, userId, review, rating);
      res.status(201).json({ message: 'Review added successfully', restaurant: updatedRestaurant });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add review and rating' });
    }
  });
  
   

  async function getRestaurantReviewsWithUserDetails(restaurantId) {
    try {
      const restaurant = await Restaurant.findById(restaurantId).populate({
        path: 'reviews',
        populate: {
  
          path: 'user', select: 'username profilePictureUrl'
        },
      });
      const reviewsWithUserDetails = restaurant.reviews.slice(0, 3).map(review => ({
        reviewText: review.text,
        user: review.user,
      }));
      return reviewsWithUserDetails;
    } catch (error) {
      throw error;
    }
  }
  
  router.get('/restaurant/:restaurantId/ratings', async (req, res) => {
    try {
      const restaurantId = req.params.restaurantId;
      const reviewsWithUserDetails = await getRestaurantReviewsWithUserDetails(restaurantId);
      res.json(reviewsWithUserDetails);
    } catch (error) {
      res.status(404).json({ error: 'Restaurant not found' });
    }
  });



   
  

module.exports = router;