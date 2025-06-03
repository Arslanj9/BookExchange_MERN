import { useState, useEffect } from "react";
import "./styles/BookRequests.css";

const BookRequests = () => {
    const [activeTab, setActiveTab] = useState("incoming");
    const [requests, setRequests] = useState([
        {
            id: 1,
            bookTitle: "Book Title",
            requesterName: "John Doe",
            requestDate: "2 days ago",
            message:
                "I would love to exchange this book. I can meet anywhere in downtown.",
            status: "pending",
            bookCover: "/placeholder-book.jpg",
        },
        // Add more sample requests as needed
    ]);

    const user = JSON.parse(localStorage.getItem("user"));
    

    // Fetch incoming requests when activeTab is 'incoming' or when component mounts
    useEffect(() => {
        if (activeTab === "incoming" && user?._id) {
            fetchIncomingRequests();
        }
        // You can also add fetching outgoing requests here if needed
    }, []);

    const fetchIncomingRequests = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/requests/${user._id}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch incoming requests");
            }
            const data = await response.json();

            console.log(`Hello G: ${JSON.stringify(data)}`)

            // Map backend request data to shape your component expects:
            const formattedRequests = data.map((req) => ({
                id: req._id,
                bookCover: req.book?.coverImage || "",
                bookTitle: req.book?.title || "No Title",
                requesterName: req.requester?.username || "Unknown",
                requestDate: new Date(req.createdAt).toLocaleDateString(),
                message: req.message,
                status: req.status || "pending", 
            }));

            setRequests(formattedRequests);
        } catch (error) {
            console.error("Error fetching incoming requests:", error);
            setRequests([]);
        }
    };

    return (
        <div className="requests-container">
            <div className="requests-header">
                <h1>Book Exchange Requests</h1>
                <div className="tabs">
                    <button
                        className={`tab ${
                            activeTab === "incoming" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("incoming")}
                    >
                        Incoming Requests
                    </button>
                    <button
                        className={`tab ${
                            activeTab === "outgoing" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("outgoing")}
                    >
                        Outgoing Requests
                    </button>
                </div>
            </div>

            <div className="requests-list">
                {activeTab === "incoming" ? (
                    <IncomingRequests
                        requests={requests}
                        onAction={fetchIncomingRequests}
                    />
                ) : (
                    <OutgoingRequests requests={requests} />
                )}
            </div>
        </div>
    );
};

const IncomingRequests = ({ requests, onAction }) => {
    return (
        <div className="requests-grid">
            {requests.map((request) => (
                <div key={request.id} className="request-card">
                    <div className="request-book-info">
                        <img src={request.bookCover} alt="Book cover" />
                        <div>
                            <h3>{request.bookTitle}</h3>
                            <p>Requested by: {request.requesterName}</p>
                            <p className="request-date">
                                {request.requestDate}
                            </p>
                        </div>
                    </div>
                    <p className="request-message">"{request.message}"</p>

                    {request.status === "pending" ? (
                        <div className="request-actions">
                            <button
                                className="accept-button"
                                onClick={() => onAction(request.id, "accept")}
                            >
                                Accept
                            </button>
                            <button
                                className="reject-button"
                                onClick={() => onAction(request.id, "reject")}
                            >
                                Reject
                            </button>
                        </div>
                    ) : (
                        <div className={`request-status ${request.status}`}>
                            {request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const OutgoingRequests = ({ requests }) => {
    return (
        <div className="requests-grid">
            {requests
                .filter((request) => request.status !== "pending")
                .map((request) => (
                    <div key={request.id} className="request-card">
                        <div className="request-book-info">
                            <img src={request.bookCover} alt="Book cover" />
                            <div>
                                <h3>{request.bookTitle}</h3>
                                <p>Owner: {request.requesterName}</p>
                                <p className="request-date">
                                    {request.requestDate}
                                </p>
                            </div>
                        </div>
                        <p className="request-message">"{request.message}"</p>
                        <div className={`request-status ${request.status}`}>
                            {request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)}
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default BookRequests;
