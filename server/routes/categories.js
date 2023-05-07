import express from 'express'
import { getCategories } from '../controllers/category.js'

const router = express.Router()

//get all category
router.get('/', getCategories)

export default router