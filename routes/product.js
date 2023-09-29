const express = require("express");
const router = express.Router();

const {
    GetAllProducts,
     GetAllProductsTesting } = 
    require( "../contoller/product")

router.route("/").get(GetAllProducts);
router.route("/Testing").get(GetAllProductsTesting)


module.exports = router;