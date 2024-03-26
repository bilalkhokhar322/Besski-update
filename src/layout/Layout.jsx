import React from "react";
import "./layout.scss";
const Layout = ({ children }) => {
  const Token = localStorage.getItem("token");

  return (
    <>
      <div className="w-100 d-flex">{children}</div>
    </>
  );
};

export default Layout;
