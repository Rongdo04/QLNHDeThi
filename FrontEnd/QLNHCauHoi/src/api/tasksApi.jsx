import React from "react";
import axiosClient from "./axiosClient";
const tasksApi = {
  getAll: (params) => {
    const url = "CauHoi/DSCauHoi";
    return axiosClient.get(url, { params });
  },
  delete: (id) => {
    const url = `CauHoi/XoaCauHoi/${id}`;
    return axiosClient.delete(url);
  },
  add: (params) => {
    const url = "CauHoi/ThemCauHoi";
    return axiosClient.post(url, params);
  },

  updateName: (params) => {
    const url = "CauHoi/SuaCauHoi";
    return axiosClient.put(url, params);
  },
  updateStatus: (id) => {
    const url = `CauHoi/updateStatus?TasksID=${id}`;
    return axiosClient.put(url);
  },
};

export default tasksApi;
