import axios from "axios";
import React, { useEffect } from "react";

const Dashboard = () => {
  const token = JSON.parse(localStorage.getItem("jwt_token"));
  console.log(token);

  const fetch_product_details = async () => {
    const url =
      "https://bb2e-2401-4900-8fd2-f1a8-2ddd-c976-5ab7-94c.ngrok-free.app";
    // const url = "http://localhost:8080";
    const result = await axios.get(
      `${url}/api/v1.0/product/category?category=FMCG&sorting=ASC`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      },
    );
    const { data } = result;
    console.log(data.payload);
  };

  useEffect(() => {
    fetch_product_details();
  }, []);

  return <div>Dashboard</div>;
};

export default Dashboard;
