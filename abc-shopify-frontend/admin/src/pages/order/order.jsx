import { useLocation } from "react-router-dom";
import "./order.css";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Order() {
  const location = useLocation();
  const orderId = location.pathname.split("/")[2];
  const [status, setStatus] = useState();

  const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUsers = user && JSON.parse(user).currentUser;
  const TOKEN = currentUsers?.accessToken;

  const headers = { token: `Bearer ${TOKEN}` };

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    axios.put(
      "http://a070e3166c7174c39b04aab6c1466a76-1087190230.us-west-2.elb.amazonaws.com:5000/api/orders/" +
        orderId,
      {
        status: status,
      },
      { headers: headers }
    );
    Swal.fire("Success!", "Order updated successfully", "success");
  };

  return (
    <div className="order">
      <div className="orderTitleContainer">
        <h1 className="orderTitle">Order Information</h1>
      </div>
      <div className="orderTop">
        <div className="productTopLeft"></div>
      </div>
      <div className="orderBottom">
        <h1 className="orderTitle">Update Order status</h1>
        <br />
        <form className="orderForm">
          <div className="orderFormLeft">
            <label>Status</label>
            <select name="inStock" onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button className="orderButton" onClick={handleClick}>
            Update Order Status
          </button>
        </form>
      </div>
    </div>
  );
}
