import express from 'express'
import { adminLogin, loginUser, registerAdmin, registerUser } from '../controllers/userController.js';



const userRouter = express.Router();
userRouter.post('/login',loginUser)
userRouter.post('/register',registerUser)
userRouter.post('/admin-login',adminLogin)
userRouter.post('/admin-register',registerAdmin)
// userRouter.get('/profile', getProfile);
// userRouter.post("/google", google)

export default userRouter;

