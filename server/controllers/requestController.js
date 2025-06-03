import Request from "../models/Request.js"

export const createRequest = async (req, res) => {
  const { bookId, requesterId, ownerId, message } = req.body;

  try {
    // Avoid duplicate requests
    const existing = await Request.findOne({ book: bookId, requester: requesterId });
    if (existing) {
      return res.status(400).json({ error: "You already requested this book." });
    }

    const request = await Request.create({
      book: bookId,
      requester: requesterId,
      owner: ownerId,
      message,
    });

    res.status(201).json({ success: true, request });
  } catch (err) {
    console.error("Request creation failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};



export const getRequestsForUser = async (req, res) => {
  try {
    const ownerId = req.params.userId; // we get the userId from the URL param

    if (!ownerId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Find all requests where ownerId matches
    const requests = await Request.find({ ownerId }).populate("bookId").populate("requesterId", "username email");

    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Server error" });
  }
};