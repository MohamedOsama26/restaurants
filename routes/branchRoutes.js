const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const {auth} = require("../middleware/authMiddleware");
const {isAdmin} = require("../middleware/roleMiddleware");


router.get('/branches',auth,branchController.listBranches); //OK

// Admin routes
router.post('/admin/branches',auth,isAdmin,branchController.createBranch);
router.put('/admin/branches/:id',auth,isAdmin,branchController.updateBranch);
router.delete('/admin/branches/:id',auth,isAdmin,branchController.deleteBranch);


module.exports = router;