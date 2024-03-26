import React from "react";
import "react-toastify/dist/ReactToastify.css";
import RoutesPage from "./router/Router";
import "./App.css";
import { ToastContainer } from "react-toastify";
const App = () => {
  return (
    <>
      <RoutesPage />
      <ToastContainer />
    </>
  );
};

export default App;
