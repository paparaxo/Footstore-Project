import Category from "../model/Category.js"

//get categories
export const getCategories = async (req, res) => {
    try {
      const categories = await Category.find()
      res.status(200).json(categories)
    } catch (err) {
     res.status(500).json(err)
    }
}