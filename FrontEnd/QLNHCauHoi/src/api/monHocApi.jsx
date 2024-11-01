import React from "react";
import axiosClient from "./axiosClient";
const MonHocApi = {
  getAll: (params) => {
    const url = "MonHoc/DSMonHoc";
    return axiosClient.get(url, { params });
  },
};

export default MonHocApi;
