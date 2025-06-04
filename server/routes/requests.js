import express from 'express';
const router = express.Router();
// import { createRequest } from "../controllers/requestController";
import { createRequest, getRequestsForUser, updateRequestStatus } from "../controllers/requestController.js"

// POST /api/requests
router.post("/", createRequest);
router.get("/:userId", getRequestsForUser);
router.patch('/:id/status', updateRequestStatus);

export default router;
