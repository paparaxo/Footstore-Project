import express from "express";
import { getAllProducts, getFeaturedProducts, getProductsBycategory, getSingleProduct } from "../controllers/product.js";

const router = express.Router()

//get featured products

router.get('/featured', getFeaturedProducts)

//get all products

router.get('/', getAllProducts)

//get single products

router.get('/:slug', getSingleProduct)

// get products by category
router.get('/category/:categoryid', getProductsBycategory)



export default router
