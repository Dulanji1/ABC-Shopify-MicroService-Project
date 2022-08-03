import "./orderList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { green, red } from "@material-ui/core/colors";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUsers = user && JSON.parse(user).currentUser;
  const TOKEN = currentUsers?.accessToken;

  const headers = { token: `Bearer ${TOKEN}` };

  useEffect(async () => {
    const response = await axios.get(
      "http://a070e3166c7174c39b04aab6c1466a76-1087190230.us-west-2.elb.amazonaws.com:5000/api/orders",
      {
        headers: headers,
      }
    );
    setOrders(response.data);
  }, [orders]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      cancelButtonColor: "#3CB371",
      confirmButtonColor: "#FF0000",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(
          "http://a070e3166c7174c39b04aab6c1466a76-1087190230.us-west-2.elb.amazonaws.com:5000/api/orders/" +
            id,
          {
            headers: headers,
          }
        );
        Swal.fire("Deleted!", "Order deleted successfully", "success");
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire("Cancelled");
      }
    });
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "amount", headerName: "Amount", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 160,
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/orderItems/" + params.row._id}>
              <button className="orderListEdit">View Items</button>
            </Link>
            <Link to={"/order/" + params.row._id}>
              <button className="orderListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="orderListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="orderList">
      <DataGrid
        rows={orders}
        disableSelectionOnClick
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}
