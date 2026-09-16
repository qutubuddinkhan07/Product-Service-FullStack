import axiosInstance from "./axiosInstance";

const BASE = "/api/v1.0/product";

export const getProductById = (id) => axiosInstance.get(`${BASE}/${id}`);

export const updateProductById = (id, payload) =>
  axiosInstance.put(`${BASE}/${id}`, payload);

export const deleteProductById = (id) => axiosInstance.delete(`${BASE}/${id}`);

export const addNewProduct = (payload) => axiosInstance.post(BASE, payload);

export const incStock = (id, amount) =>
  axiosInstance.patch(`${BASE}/stock/inc/${id}/${amount}`);

export const decStock = (id, amount) =>
  axiosInstance.patch(`${BASE}/stock/dec/${id}/${amount}`);

// NOTE: only the paths were given for these two, so the param names below
// (page/size, minPrice/maxPrice) are a best guess based on typical Spring
// pageable conventions — check Swagger and adjust if your backend differs.
export const getProductInRangeByPage = ({
  start = 0,
  end = 1000,
  pageNo = 0,
  pageSize = 10,
}) =>
  axiosInstance.get(`${BASE}/range`, {
    params: {
      start,
      end,
      pageNo,
      pageSize,
    },
  });

export const getProductByPage = ({ page = 0, size = 10 }) =>
  axiosInstance.get(`${BASE}/page`, { params: { page, size } });

export const getProductByCategory = ({ category, sorting = "ASC" }) =>
  axiosInstance.get(`${BASE}/category`, { params: { category, sorting } });
