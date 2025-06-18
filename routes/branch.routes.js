const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branch.controller');
const {authorize} = require("../middleware/role.middleware");


// GET
router.get(
    '/branches',
    authorize,
    branchController.listBranches,
);

// GET
router.get(
    '/branches',
    authorize,
    branchController.listBranches,
);

// POST
router.post(
    '/branches',
    authorize('admin','owner'),
    branchController.createBranch,
);

// PUT
router.put(
    '/branches/:id',
    authorize('admin','owner'),
    branchController.updateBranch,
);

// DELETE
router.delete(
    '/branches/:id',
    authorize('admin','owner'),
    branchController.deleteBranch,
);


module.exports = router;