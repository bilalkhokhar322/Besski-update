import React, { useState } from "react";
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
import './forgot.scss'
import { Formik } from "formik";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import * as Yup from "yup";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const generateRandomCode = () => {
  // Generate a random 6-digit code
  return Math.floor(100000 + Math.random() * 900000);
};

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleResetPassword = async (values, { setSubmitting }) => {
    console.log(values)
    try {
      // API call to authenticate user
      const response = await axios.post(
        "/admin/forgetPassword",
        { ...values }
      );

      if (response?.data?.success) {
        navigate("/reset-password");
        toast.success("OTP has sent to your email");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    setSubmitting(false);
  };

  return (
    <>
      <div className="" id="layout">
        <Container>
          <Row>
            <Col lg={5} md={7} xs={11}>
              <h2 className=" mb-4 text-white">Forgot Password</h2>
              


              <Formik
                initialValues={{ email: ""}}
                validationSchema={ForgotPasswordSchema}
                onSubmit={handleResetPassword}
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

                    <Row>
                      <Col xs={12}>
                        <Button
                          className="px-4 button1 text-white"
                          color="primary"
                          type="submit"
                          onClick={""}
                        >
                          Send OTP
                        </Button>
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

export default ForgotPassword;
