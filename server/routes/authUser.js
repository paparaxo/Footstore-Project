import express  from "express";
import { loginUser, registerUser, getUserProfile} from "../controllers/authUser.js";
import authorize from "../controllers/middleware/auth.js";

const router = express.Router()

//register user
router.post('/register', registerUser)

// Login user
router.post('/login', loginUser)

//get user profile
router.get('/profile/:id', authorize, getUserProfile)

export default router
