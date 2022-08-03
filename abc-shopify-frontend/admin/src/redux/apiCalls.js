import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import { publicRequest, userRequest } from "../requestMethods";
import axios from "axios";
import {
  getProductFailure,
  getProductStart,
  getProductSuccess,
  deleteProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  updateProductFailure,
  updateProductStart,
  updateProductSuccess,
  addProductFailure,
  addProductStart,
  addProductSuccess,
} from "./productRedux";

const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
const currentUsers = user && JSON.parse(user).currentUser;
const TOKEN = currentUsers?.accessToken;

const headers = { token: `Bearer ${TOKEN}` };

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(
      "http://a749384d347a840de8a1f30b4afcd786-1852372676.us-west-2.elb.amazonaws.com:5000/api/auth/login",
      user,
      { headers: headers }
    );
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};

export const getProducts = async (dispatch) => {
  dispatch(getProductStart());
  try {
    const res = await axios.get(
      "http://a6a4e9e6b445641958090689d07dfd75-993476866.us-west-2.elb.amazonaws.com:5000/api/products",
      { headers: headers }
    );
    dispatch(getProductSuccess(res.data));
  } catch (err) {
    dispatch(getProductFailure());
  }
};

export const deleteProduct = async (id, dispatch) => {
  dispatch(deleteProductStart());
  try {
    // const res = await userRequest.delete(`/products/${id}`);
    dispatch(deleteProductSuccess(id));
  } catch (err) {
    dispatch(deleteProductFailure());
  }
};

export const updateProduct = async (id, product, dispatch) => {
  dispatch(updateProductStart());
  try {
    // update
    dispatch(updateProductSuccess({ id, product }));
  } catch (err) {
    dispatch(updateProductFailure());
  }
};
export const addProduct = async (product, dispatch) => {
  dispatch(addProductStart());
  try {
    const res = await axios.post(
      `http://a6a4e9e6b445641958090689d07dfd75-993476866.us-west-2.elb.amazonaws.com:5000/api/products`,
      product,
      { headers: headers }
    );
    dispatch(addProductSuccess(res.data));
  } catch (err) {
    dispatch(addProductFailure());
  }
};
