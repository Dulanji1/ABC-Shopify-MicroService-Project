import axios from "axios";

const BASE_URL =
  "http://a749384d347a840de8a1f30b4afcd786-1852372676.us-west-2.elb.amazonaws.com:5000/api/";
const TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)
  .currentUser.accessToken;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },
});
