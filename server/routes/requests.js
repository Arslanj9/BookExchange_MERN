import express from 'express';
const router = express.Router();
// import { createRequest } from "../controllers/requestController";
import { createRequest, getRequestsForUser } from "../controllers/requestController.js"

// POST /api/requests
router.post("/", createRequest);
router.get("/:userId", getRequestsForUser);

export default router;
