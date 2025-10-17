import express from 'express';
import { registerUser, loginUser,  updateUser, deleteUser, resetPassword, uploadProfilePic, getActivePatients} from '../controllers/UserController.js';
import { protect } from '../middlewares/auth.js';
import upload from '../middlewares/uploadMiddleware.js';

import { authorizeRoles } from '../middlewares/roleMiddleware.js';
const router = express.Router();
router.get('/doctor/:id/active', protect, authorizeRoles('Doctor'),getActivePatients);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update/:id', protect, updateUser);
router.delete('/delete/:id', protect, deleteUser);
router.post('/reset-password', resetPassword);
router.post('/upload-profile-pic/:id', protect, upload.single('profilePic'), uploadProfilePic);


export default router;
