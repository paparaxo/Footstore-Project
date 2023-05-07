import express from 'express'
import { getProductsBySearch } from '../controllers/search.js'

const router = express.Router()

//search product
router.get('/search', getProductsBySearch)

export default router
