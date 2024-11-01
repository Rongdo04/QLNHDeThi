import React from "react";
import axiosClient from "./axiosClient";
const authApi = {
  login: (params) => {
    const url = "Auth/login";
    return axiosClient.post(url, params);
  },
};

export default authApi;
