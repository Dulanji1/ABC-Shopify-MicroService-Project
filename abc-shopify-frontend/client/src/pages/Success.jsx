import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";
import { mobile } from "../responsive";
import { setInitial } from "../redux/cartRedux";
import { useDispatch } from "react-redux";

const Success = () => {
  const location = useLocation();
  const data = location.state.stripeData;
  const cart = location.state.products;
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const [orderId, setOrderId] = useState(null);

  const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUsers = user && JSON.parse(user).currentUser;
  const TOKEN = currentUsers?.accessToken;

  console.log(data);
  console.log(cart);
  console.log(currentUser);

  const headers = { token: `Bearer ${TOKEN}` };

  const completeOrder = async () => {
    dispatch(setInitial());
    const res = await axios.get(
      "http://a21f6cee680614373bf75e2759b51e67-1616939274.us-west-2.elb.amazonaws.com:5000/api/carts/find/" +
        currentUser._id,
      {
        headers: headers,
      }
    );
    await axios.delete(
      "http://a21f6cee680614373bf75e2759b51e67-1616939274.us-west-2.elb.amazonaws.com:5000/api/carts/" +
        res.data._id,
      {
        headers: headers,
      }
    );
    window.location = "/cart";
  };

  useEffect(() => {
    const createOrder = async () => {
      try {
        const res = await axios.post(
          "http://a070e3166c7174c39b04aab6c1466a76-1087190230.us-west-2.elb.amazonaws.com:5000/api/orders",
          {
            userId: currentUser._id,
            products: cart.products.map((item) => ({
              productId: item._id,
              quantity: item._quantity,
            })),
            amount: cart.total,
            address: data.billing_details.address,
          },
          { headers: headers }
        );
        setOrderId(res.data._id);
      } catch {}
    };

    data && createOrder();
  }, [cart, data, currentUser]);

  return (
    <Container>
      <Wrapper>
        {orderId
          ? `Order has been created successfully. Your order number is ${orderId}`
          : `Successfull. Your order is being prepared...`}
        <Button style={{ padding: 10, marginTop: 20 }}>
          <Link
            onClick={completeOrder}
            style={{ textDecoration: "none", color: "black" }}
          >
            Go to Homepage
          </Link>
        </Button>
      </Wrapper>
    </Container>
  );
};

export default Success;

const Button = styled.button`
  padding: 10px;
  font-size: 20px;
  background-color: transparent;
  cursor: pointer;
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://cc-prod.scene7.com/is/image/CCProdAuthor/Fashion-photography_P1_900x420?$pjpeg$&jpegSize=200&wid=900")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 25%;
  padding: 20px;
  background-color: #fff7f7;
  justify-content: "center", ${mobile({ width: "75%" })};
`;
