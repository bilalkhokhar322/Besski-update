import React from "react";
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
import './resetPassword.scss'
import { Formik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useNavigate } from "react-router";

const ResetPassword = () => {

  const navigate = useNavigate();

  const ResetPasswordSchema = Yup.object().shape({
    newPassword: Yup.string().email("Invalid New Password").required("New Password is required"),
    token: Yup.string().required("Unique Code is required"),
  });

  const handleResetPassword = async (values, { setSubmitting }) => {

    try {
      const response = await axios.post(
        "http://15.206.61.14/api/v1/admin/resetPassword",
        { ...values }
      );
      
      if (response?.data?.success) {
        navigate("/");
        toast.success("Password reset successfully")
      }
    } catch (error) {
      toast.error(error?.response?.data?.data?.message)
    }

    setSubmitting(false);
  };

  return (
    <>
      <div className="" id="layout">
        <Container>
          <Row>
            <Col lg={5} md={7} xs={11}>
              <h2 className="mb-4">Reset Password</h2>

              <Formik
                initialValues={{ newPassword: "", token: "" }}
                validationSchema={ResetPasswordSchema}
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
                      <Label for="New Password">New Password</Label>
                      <Input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        placeholder="Enter your new password"
                        value={values.newPassword}
                        onChange={handleChange}
                        invalid={touched.newPassword && !!errors.newPassword}
                      />
                      <FormFeedback>{errors.newPassword}</FormFeedback>
                    </FormGroup>

                    <FormGroup>
                      <Label for="unique code">Enter OTP</Label>
                      <Input
                        type="text"
                        name="token"
                        id="token"
                        placeholder="Enter otp"
                        value={values.token}
                        onChange={handleChange}
                        invalid={touched.token && !!errors.token}
                      />
                      <FormFeedback>{errors.token}</FormFeedback>
                    </FormGroup>

                    <Row>
                      <Col xs={12}>
                        <Button
                          className="px-4 button1"
                          color="primary"
                          type="submit"
                        >
                          Reset Password
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

export default ResetPassword;
