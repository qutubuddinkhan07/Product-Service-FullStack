import React from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div>
      Home <br />
      <NavLink to={"/login"} className="text-blue-500">
        Click to go Login
      </NavLink>
    </div>
  );
};

export default Home;
