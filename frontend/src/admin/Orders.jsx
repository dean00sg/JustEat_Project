import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import NavbarAdmin from "../components/Navbar/NavbarAdmin";
import "../styles/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [completedTotal, setCompletedTotal] = useState(0); // State for total of completed orders

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/Orders/orders/");
        const data = await response.json();

        console.log("Fetched orders data:", data);

        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updatedData = {
        status_working: newStatus,
      };

      console.log("PUT request data for status change:", updatedData);

      // Send PUT request to update the order status
      await fetch(`http://127.0.0.1:8000/Orders/orders/${orderId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      // Update the order status in the state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orders_id === orderId
            ? { ...order, status_working: newStatus }
            : order
        )
      );

      // If the new status is "Complete", send a POST request
      if (newStatus === "Complete") {
        const paymentData = {
          orders_id: orderId, // use the correct property name
        };

        console.log("POST request data for payment:", paymentData);

        await fetch(`http://127.0.0.1:8000/Payment/`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        });

        Swal.fire({
          title: "Payment Recorded",
          text: `Payment for Order ID: ${orderId} has been recorded.`,
          icon: "success",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleCancelNoteChange = (orderId, newNote) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orders_id === orderId ? { ...order, remark: newNote } : order
      )
    );
  };

  const handleSendCancelNote = async (orderId) => {
    const orderToUpdate = orders.find((order) => order.orders_id === orderId);
    const updatedData = {
      remark: orderToUpdate.remark,
    };

    try {
      console.log(
        "PUT request data for sending cancellation note:",
        updatedData
      );

      await fetch(`http://127.0.0.1:8000/Orders/orders/${orderId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      Swal.fire({
        title: "Cancellation Note Sent",
        text: `Cancellation reason for Order ID: ${orderId} has been sent.`,
        icon: "info",
        confirmButtonText: "Ok",
      });
    } catch (error) {
      console.error("Error sending cancellation note:", error);
    }
  };

  const handlePaymentClick = (totalAmount) => {
    Swal.fire({
      title: "Payment QR Code",
      html: `<img src="https://promptpay.io/0638313471/${totalAmount}.png" alt="QR Code" />`,
      showCloseButton: true,
      confirmButtonText: "Success",
    });
  };

  // Function to calculate the total price of completed orders
  const calculateCompletedTotal = () => {
    const total = orders.reduce((acc, order) => {
      return order.status_working === "Complete"
        ? acc + order.total_price
        : acc;
    }, 0);
    setCompletedTotal(total);
  };

  // Update the completed total whenever the orders change
  useEffect(() => {
    calculateCompletedTotal();
  }, [orders]);

  return (
    <div className="orders-page">
      <NavbarAdmin />
      <div className="orders-container">
        <h1 className="orders-title">Manage Orders</h1>

        {orders.map((order) => (
          <div className="order-card" key={order.orders_id}>
            <div className="order-header">
              <h2 className="order-id">Order ID: {order.orders_id}</h2>
              <span
                className={`order-status status-${order.status_working.toLowerCase()}`}
              >
                {order.status_working}
              </span>
              <span className="order-date">{order.date}</span>
            </div>

            <div className="order-items">
              <div className="order-item">
                <img
                  src={`http://127.0.0.1:8000/${order.image}`}
                  alt={order.name_menu}
                  className="order-item-image"
                />
                <div className="order-item-details">
                  <h3>{order.name_menu}</h3>
                  <p>Quantity: {order.qty}</p>
                  <p>Price: ${order.price.toFixed(2)}</p>
                  {/* Options section */}
                  {order.option_name.length > 0 ? (
                    <div className="order-options">
                      <h4 style={{ display: "inline" }}>Options: </h4>
                      <p style={{ display: "inline" }}>
                        {order.option_name.join(", ")}
                      </p>
                    </div>
                  ) : (
                    <p>No options selected</p>
                  )}

                  {/* Display customer note */}
                  {order.remark && (
                    <div className="order-note">
                      <h4 style={{ display: "inline" }}>
                        Note from customer:{" "}
                      </h4>
                      <p style={{ display: "inline" }}>{order.remark}</p>
                    </div>
                  )}
                  <br />
                  {/* Total price calculation */}
                  <h4>Total Price: ${order.total_price.toFixed(2)}</h4>
                </div>
              </div>
            </div>

            {/* Order status change section */}
            <div className="order-status-control">
              <label htmlFor={`status-${order.orders_id}`}>
                Change Status:
              </label>
              <select
                id={`status-${order.orders_id}`}
                value={order.status_working}
                onChange={(e) =>
                  handleStatusChange(order.orders_id, e.target.value)
                }
              >
                <option value="Inprogress">In Progress</option>
                <option value="Complete">Complete</option>
                <option value="Cancel">Cancel</option>
              </select>

              {/* Show note input when Cancel is selected */}
              {order.status_working === "Cancel" && (
                <div className="order-cancel-note">
                  <textarea
                    value={order.remark}
                    onChange={(e) =>
                      handleCancelNoteChange(order.orders_id, e.target.value)
                    }
                    placeholder="Add a reason for cancellation"
                  />
                  <button
                    className="send-cancel-note-button"
                    onClick={() => handleSendCancelNote(order.orders_id)}
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Display total price of completed orders */}
        <div className="completed-total">
          <h2>Total of Completed Orders: ${completedTotal.toFixed(2)}</h2>

          {/* QR Code button for payment, only shown if total is greater than 0 */}
          {completedTotal > 0 && (
            <div className="qr-code-container">
              <button
                className="qr-code-button"
                onClick={() => handlePaymentClick(completedTotal)}
              >
                Show QR Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
