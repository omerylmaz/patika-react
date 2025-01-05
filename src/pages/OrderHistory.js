import React, { useEffect, useState } from "react";
import orderService from "../services/orderService";
import Spinner from "../components/LoadingSpinner";
import alertify from "alertifyjs";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemsToShow, setItemsToShow] = useState(5);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await orderService.getAllOrders();
        console.log(response);
        setAllOrders(response.orders);
        setOrders(response.orders.slice(0, itemsToShow));
      } catch (err) {
        setError(err.message);
        alertify.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [itemsToShow]);

  const handleShowMore = () => {
    setItemsToShow((prev) => prev + 5); 
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center my-4">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (allOrders.length === 0) {
    return <div className="text-center mt-4">You have no orders yet.</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Order History</h1>
      <div className="row">
        {orders.map((order) => (
          <div key={order.id} className="col-md-12 mb-4">
            <div className="card shadow-sm d-flex flex-row align-items-center">
              <div
                className="image-container"
                style={{
                  width: "220px",
                  height: "220px",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "10px",
                  borderRadius: "10px",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <img
                  src={order.imageUrl}
                  alt={order.courseName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="card-body d-flex flex-column justify-content-center ms-3 flex-grow-1">
                <h5 className="card-title">{order.courseName}</h5>
                <p className="card-text mb-1">
                  <strong>Category:</strong> {order.courseCategoryName}
                </p>
                <p className="card-text mb-0">
                  <strong>Payment Date:</strong>{" "}
                  {new Date(order.paymentDate).toLocaleDateString()}
                </p>
              </div>
              <div
                className="price-container text-end"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginRight: "20px",
                  color: "#007bff",
                }}
              >
                {order.price.toFixed(2)}₺
              </div>
            </div>
          </div>
        ))}
      </div>
      {itemsToShow < allOrders.length && (
        <div
          className="text-center mt-4"
          style={{
            cursor: "pointer",
            color: "#007bff",
            fontWeight: "bold",
            textDecoration: "underline",
          }}
          onClick={handleShowMore}
          onMouseEnter={(e) => (e.target.style.color = "#0056b3")}
          onMouseLeave={(e) => (e.target.style.color = "#007bff")}
        >
          Show More
        </div>
      )}
    </div>
  );
}
