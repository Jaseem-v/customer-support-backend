import express from "express"
import userRoutes from "./user/userRoutes";

const router = express.Router()
const AppError = require("../utils/errorHandler");


router.use("/user", userRoutes)



export default router;
