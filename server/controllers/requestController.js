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
    const requests = await Request.find({ owner: ownerId }).populate("book").populate("requester");

    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Server error" });
  }
};



export const updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('book requester owner');

        if (!updatedRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.status(200).json(updatedRequest);
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ error: 'Failed to update request status' });
    }
};