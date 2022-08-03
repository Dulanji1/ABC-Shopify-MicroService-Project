import { Link, useLocation } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart";
import { Publish } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import axios from "axios";
import Swal from "sweetalert2";

export default function Product() {
  const location = useLocation();
  const productId = location.pathname.split("/")[2];
  const [pStats, setPStats] = useState([]);
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState([]);
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);
  const [inputs, setInputs] = useState({});

  const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUsers = user && JSON.parse(user).currentUser;
  const TOKEN = currentUsers?.accessToken;

  const headers = { token: `Bearer ${TOKEN}` };

  const product = useSelector((state) =>
    state.product.products.find((product) => product._id === productId)
  );

  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get(
          "http://a070e3166c7174c39b04aab6c1466a76-1087190230.us-west-2.elb.amazonaws.com:5000/api/orders/income?pid=" +
            productId,
          { headers: headers }
        );
        const list = res.data.sort((a, b) => {
          return a._id - b._id;
        });
        list.map((item) =>
          setPStats((prev) => [
            ...prev,
            { name: MONTHS[item._id - 1], Sales: item.total },
          ])
        );
      } catch (err) {
        console.log(err);
      }
    };
    getStats();
  }, [productId, MONTHS]);

  const handleClick = async (e) => {
    e.preventDefault();
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      async () => {
        await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          axios.put(
            "http://a6a4e9e6b445641958090689d07dfd75-993476866.us-west-2.elb.amazonaws.com:5000/api/products/" +
              productId,
            {
              ...inputs,
              img: downloadURL,
              categories: cat,
              size: size,
              color: color,
            },
            { headers: headers }
          );
        });
        Swal.fire("Success!", "Product updated successfully", "success");
      }
    );
  };

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handleCat = (e) => {
    setCat(e.target.value.split(","));
  };

  const handleSizes = (e) => {
    setSize(e.target.value.split(","));
  };

  const handleColors = (e) => {
    setColor(e.target.value.split(","));
  };

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product Information</h1>
        <Link to="/newproduct">
          <button className="productAddButton">Add Product</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopLeft">
          <Chart data={pStats} dataKey="Sales" title="Sales Performance" />
        </div>
        <div className="productTopRight">
          <div className="productInfoTop">
            <img src={product.img} alt="" className="productInfoImg" />
            <span className="productName">{product.title}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">id:</span>
              <span className="productInfoValue">{product._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">sales:</span>
              <span className="productInfoValue">5123</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">in stock:</span>
              <span className="productInfoValue">{product.inStock}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <h1 className="productTitle">Update Product Information</h1>
        <br />
        <form className="productForm">
          <div className="productFormLeft">
            <label>Title</label>
            <input
              name="title"
              type="text"
              placeholder={product.title}
              onChange={handleChange}
            />
            <label>Description</label>
            <input
              name="desc"
              type="text"
              placeholder={product.desc}
              onChange={handleChange}
            />
            <label>Price</label>
            <input
              name="price"
              type="number"
              placeholder={product.price}
              onChange={handleChange}
            />
            <label>Categories</label>
            <input
              type="text"
              placeholder="Jeans, Skirts"
              onChange={handleCat}
            />
            <label>Available Sizes</label>
            <input type="text" placeholder="XS, S" onChange={handleSizes} />
            <label>Available Colors</label>
            <input
              type="text"
              placeholder="Pink, Red"
              onChange={handleColors}
            />
            <label>Stock</label>
            <select name="inStock" onChange={handleChange}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img src={product.img} alt="" className="productUploadImg" />
              <label for="file">
                <Publish />
              </label>
              <input
                type="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <button className="productButton" onClick={handleClick}>
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
