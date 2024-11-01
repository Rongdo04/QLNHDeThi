import React from "react";
import axiosClient from "./axiosClient";
const deThiApi = {
  getAllDeThi: (params) => {
    const url = "deThi/DSDeThi";
    return axiosClient.get(url, { params });
  },
  delete: (id) => {
    const url = `deThi/${id}`;
    return axiosClient.delete(url);
  },
  add: (params) => {
    const url = "deThi";
    return axiosClient.post(url, params);
  },

  updateName: (params) => {
    const url = "deThi/SuaDeThi";
    return axiosClient.put(url, params);
  },
};

export default deThiApi;
