import React, { useState } from "react";
// import axios from "axios";
import { BiEye, BiEyeSlash } from "react-icons/bi";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Container,
  Row,
  Col,
} from "reactstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../utils/axios";
import { Spinner } from "react-bootstrap";
const SignIn = () => {
  const [addLoading, setAddLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const showPasswordFunction = () => {
    setShowPassword(!showPassword);
    // console.log(showPassword);
  };

  // Yup schema for form validation
  const SignInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Function to handle sign-in
  const handleSignIn = async (values, { setSubmitting }) => {
    try {
      setAddLoading(true);
      const response = await axios.post("/admin/login", { ...values });
      const userDataToken = response.data?.data?.token;
      let token = localStorage.setItem("token", userDataToken);

      setAddLoading(false);

      navigate("/play-list");
      toast.success(response?.data?.message);
    } catch (error) {
      setAddLoading(false);
      toast.error(error?.response?.data?.data?.message);
    }

    setSubmitting(true);
  };

  return (
    <>
      <div className="" id="layout">
        <Container>
          <Row>
            <Col lg={5} md={7} xs={11}>
              <h2 className="mb-4 text-white">Sign In</h2>
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={SignInSchema}
                onSubmit={handleSignIn}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  errors,
                  touched,
                  isSubmitting,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        value={values.email}
                        onChange={handleChange}
                        invalid={touched.email && !!errors.email}
                      />
                      <FormFeedback>{errors.email}</FormFeedback>
                    </FormGroup>

                    <FormGroup>
                      <Label for="password">Password</Label>
                      <div
                        className="password-input-wrapper"
                        style={{ position: "relative" }}
                      >
                        <Input
                          type={!showPassword ? "password" : "text"}
                          name="password"
                          id="password"
                          placeholder="Enter your password"
                          value={values.password}
                          onChange={handleChange}
                          invalid={touched.password && !!errors.password}
                        />
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                          }`}
                          onClick={showPasswordFunction}
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                          }}
                        ></i>
                      </div>
                      <FormFeedback>{errors.password}</FormFeedback>
                    </FormGroup>
                    <Row>
                      <Col xs={6}>
                        {addLoading ? (
                          <>
                            <Button
                              className="px-4 button1 text-white"
                              color="primary"
                              type="submit"
                            >
                              <span class="h5 bi-bi-plus-circle-fill">
                                <Spinner
                                  className={"spinner text-white fw-light"}
                                />
                              </span>
                            </Button>
                          </>
                        ) : (
                          <Button
                            className="px-4 button1 text-white"
                            color="primary"
                            type="submit"
                          >
                            Sign In
                          </Button>
                        )}
                      </Col>
                      <Col xs={6} className="text-end ">
                        <Link to="/forgot-password">Forgot Password</Link>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default SignIn;
