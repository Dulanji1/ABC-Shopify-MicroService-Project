import { useLocation } from "react-router-dom";
import "./cart.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@material-ui/data-grid";

export default function CartItems() {
  const location = useLocation();
  const cartId = location.pathname.split("/")[2];
  const [products, setProducts] = useState([]);

  const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUsers = user && JSON.parse(user).currentUser;
  const TOKEN = currentUsers?.accessToken;

  const headers = { token: `Bearer ${TOKEN}` };

  useEffect(async () => {
    const response = await axios.get(
      "http://a21f6cee680614373bf75e2759b51e67-1616939274.us-west-2.elb.amazonaws.com:5000/api/carts",
      {
        headers: headers,
      }
    );
    const value = response.data.find((element) => {
      return element._id === cartId;
    });

    setProducts(value.products);
  }, [products]);

  const columns = [
    { field: "productId", headerName: "Product ID", width: 200 },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 160,
    },
  ];
  return (
    <div className="cartList">
      <DataGrid
        rows={products}
        disableSelectionOnClick
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}
