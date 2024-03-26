import React from "react";
import { Container } from "reactstrap";
import "./ErrorPage.scss";
const errorImage = require("../../assets/Image/error.png");

const ErrorPage = () => {
  return (
    <Container id="error" className="w-100 min-vh-100">
      <center className="danger">
        <div className="img ">
          <img src={errorImage} alt="" className="image-fluid w-25"  />
        </div>
        <h1 className="display-1">Page Not Found!</h1>
        <p>
          We're sorry, but the page you are looking for might not exist or has
          been moved.
        </p>
      </center>
    </Container>
  );
};

export default ErrorPage;
