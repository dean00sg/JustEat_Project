import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import NavbarAdmin from "../components/Navbar/NavbarAdmin";
import "../styles/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch orders from the API on component mount
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/Orders/orders/");
        const data = await response.json();

        // Log the fetched data
        console.log("Fetched Orders Data:", data);

        // Adjust the data structure if necessary
        const formattedOrders = data.map((order) => ({
          id: order.orders_id,
          status: order.status_working,
          items: [
            {
              name: order.name_menu,
              quantity: order.qty,
              price: order.price,
              image: order.image,
              note: order.remark,
              options: order.option_name.map((option) => ({
                name: option,
                price: 0,
              })),
            },
          ],
          totalPrice: order.total_price, // Use the total price directly from the order
          cancelNote: "",
        }));

        // Log the formatted orders
        console.log("Formatted Orders:", formattedOrders);

        setOrders(formattedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await fetch(`http://127.0.0.1:8000/Orders/orders/working/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status_working: newStatus }),
      });

      // Log status change
      console.log(`Order ID: ${orderId}, Status changed to: ${newStatus}`);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // If status is Complete, POST to payment API
      if (newStatus === "Complete") {
        const formData = new URLSearchParams();
        formData.append("orders_id", orderId);

        const response = await fetch("http://127.0.0.1:8000/Payment/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error posting payment: ${response.statusText}`);
        }

        // Log status change
        console.log(`Order ID: ${orderId}, Status changed to: ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleCancelNoteChange = (orderId, newNote) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, cancelNote: newNote } : order
      )
    );

    // Log cancellation note change
    console.log(`Order ID: ${orderId}, New Cancel Note: ${newNote}`);
  };

  const handleSendCancelNote = async (orderId) => {
    try {
      await fetch(`http://127.0.0.1:8000/Orders/orders/remark/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          remark: orders.find((o) => o.id === orderId).cancelNote,
        }),
      });

      // Log the cancellation note sent
      console.log(`Cancellation note sent for Order ID: ${orderId}`);

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

  const handlePaymentClick = async (totalAmount, orderId) => {
    // ตรวจสอบว่า orderId มีค่า
    if (!orderId) {
      Swal.fire("Error", "Invalid order ID provided.", "error");
      console.log("Error: orderId is undefined or null.");
      return; // หยุดการทำงานหาก orderId เป็น undefined
    }

    console.log("Payment initiated for amount:", totalAmount);
    console.log("Using orderId:", orderId); // Log orderId

    // แสดง QR Code สำหรับการชำระเงิน
    Swal.fire({
      title: "Payment QR Code",
      html: `<img src="https://promptpay.io/0638313471/${totalAmount}.png" alt="QR Code" />`,
      showCloseButton: true,
      confirmButtonText: "Payment has been made",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // ดึง pay_id จาก orderId
          const pay_id = await getPaymentIdFromOrderId(orderId);
          console.log("Retrieved pay_id:", pay_id); // Log pay_id

          // ทำการ PUT เพื่ออัปเดตสถานะการชำระเงิน
          const response = await fetch(
            `http://127.0.0.1:8000/Payment/${pay_id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${token}`,
              },
              body: "status_payment=Complete",
            }
          );

          if (response.ok) {
            console.log("Payment status updated successfully.");
            Swal.fire(
              "Success",
              "Payment status updated successfully!",
              "success"
            );
          } else {
            console.error(
              "Failed to update payment status:",
              response.statusText
            );
            Swal.fire("Error", "Failed to update payment status.", "error");
          }
        } catch (error) {
          console.error("Error during payment update:", error);
          Swal.fire(
            "Error",
            "An error occurred while processing the payment.",
            "error"
          );
        }
      }
    });
  };

  const getPaymentIdFromOrderId = async (orderId) => {
    console.log("Fetching payment ID for orderId:", orderId); // Log orderId ที่ใช้ในการค้นหา
    try {
      const response = await fetch("http://127.0.0.1:8000/Payment/");
      if (!response.ok) {
        throw new Error("Failed to fetch payment data.");
      }

      const data = await response.json();
      console.log("Fetched payment data:", data); // Log ข้อมูลที่ดึงมา

      // ค้นหา pay_id ที่ตรงกับ orders_id
      const paymentInfo = data.find((payment) => payment.orders_id === orderId);

      if (paymentInfo) {
        console.log("Found paymentInfo:", paymentInfo); // Log paymentInfo
        return paymentInfo.pay_id; // คืนค่า pay_id
      } else {
        throw new Error(`No payment found for order_id: ${orderId}`);
      }
    } catch (error) {
      console.error("Error fetching payment ID:", error);
      throw error; // สามารถจัดการกับข้อผิดพลาดที่เกิดขึ้นได้
    }
  };

  return (
    <div className="orders-page">
      <NavbarAdmin />
      <div className="orders-container">
        <h1 className="orders-title">Manage Orders</h1>

        {orders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-header">
              <h2 className="order-id">Order ID: {order.id}</h2>
              <span
                className={`order-status status-${order.status.toLowerCase()}`}
              >
                {order.status}
              </span>
              {/* Display total price directly from the order */}
              <h3 className="order-total-price">
                Total Price: ${order.totalPrice.toFixed(2)}
              </h3>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div className="order-item" key={index}>
                  <img
                    src={`http://127.0.0.1:8000/${item.image}`}
                    alt={item.name}
                    className="order-item-image"
                  />
                  <div className="order-item-details">
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price.toFixed(2)}</p>

                    {/* Options section */}
                    <div className="order-options">
                      {item.options.length > 0 ? (
                        <>
                          <h4 style={{ display: "inline" }}>Options: </h4>
                          <ul
                            style={{
                              display: "inline",
                              listStyleType: "none",
                              padding: 0,
                              margin: 0,
                            }}
                          >
                            {item.options.map((option, idx) => (
                              <li
                                key={idx}
                                style={{
                                  display: "inline",
                                  marginRight: "10px",
                                }}
                              >
                                {option.name}
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <p style={{ display: "inline" }}>No options selected</p>
                      )}
                    </div>

                    {/* Display customer note */}
                    {item.note && (
                      <div className="order-note" style={{ display: "inline" }}>
                        <h4 style={{ display: "inline", marginRight: "5px" }}>
                          Note :
                        </h4>
                        <p style={{ display: "inline" }}>{item.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Order status change section */}
            <div className="order-status-control">
              <label htmlFor={`status-${order.id}`}>Change Status:</label>
              <select
                id={`status-${order.id}`}
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
              >
                <option value="Inprogress">Inprogress</option>
                <option value="Complete">Complete</option>
                <option value="Cancel">Cancel</option>
              </select>

              {/* Show note input when Cancel is selected */}
              {order.status === "Cancel" && (
                <div className="order-cancel-note">
                  <textarea
                    value={order.cancelNote}
                    onChange={(e) =>
                      handleCancelNoteChange(order.id, e.target.value)
                    }
                    placeholder="Add a reason for cancellation"
                  />
                  <button
                    className="send-cancel-note-button"
                    onClick={() => handleSendCancelNote(order.id)}
                  >
                    Send
                  </button>
                </div>
              )}

              {/* QR Code button for payment */}
              {order.status === "Complete" && (
                <button
                  className="qr-code-button"
                  onClick={() =>
                    handlePaymentClick(order.totalPrice.toFixed(2), order.id)
                  }
                >
                  Show QR Code
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
