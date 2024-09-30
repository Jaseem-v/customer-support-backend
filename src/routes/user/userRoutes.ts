import express from "express"
import { getUserProfile, userLogin, userRegister } from "../../controller/user/userController"
import authenticate from "../../middleware/authMiddleware"

const router = express.Router()

router.route("/login").post(userLogin)
router.route("/register").post(userRegister)
router.route("/profile").get(authenticate, getUserProfile)

export default router