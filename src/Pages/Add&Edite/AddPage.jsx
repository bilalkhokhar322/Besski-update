import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./add&edit.scss";
import { toast } from "react-toastify";
import axios from "../../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { BackToPage } from "../../assets/SvgIcons/icons";
import { TagsInput } from "react-tag-input-component";
import {
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
  Form,
  Button,
} from "reactstrap";

const AddPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setcategories] = useState([]);
  const [getCategoriesData, setGetCategoriesData] = useState({});
  const [keyWords, setkeyWords] = useState([]);
  const Validation = Yup.object().shape({
    avatar: Yup.string().required("file is required"),
    movieName: Yup.string().trim().required("Move Name is required"),
    title: Yup.string().trim().required("Title is required"),
    situation: Yup.string().trim().required("Situation is required"),
    artist: Yup.string().trim().required("Artist is required"),
    library: Yup.string().trim().required("Language is required"),
  });
  useEffect(() => {
    getCategories();
  }, []);

  const ClearCategories = () => {
    setcategories([]);
  };

  const handleAddTag = (tag) => {
    if (keyWords.length < 5) {
      setkeyWords([...keyWords, tag]);
    }
  };

  const handleDeleteTag = (tagIndex) => {
    const newTags = keyWords.filter((keyWord, index) => index !== tagIndex);
    setkeyWords(newTags);
  };

  const AddNewData = async (values, { setSubmitting }) => {
    if (categories.length == 0) {
      toast.error("At least one categories is required");
      return;
    } else {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("categories", JSON.stringify(categories));
        formData.append("inspiration", JSON.stringify([]));
        formData.append("keyWords", JSON.stringify(keyWords));
        formData.append("avatar", values.avatar);
        formData.append("movieName", values.movieName);
        formData.append("title", values.title);
        formData.append("situation", values.situation);
        formData.append("artist", values.artist);
        formData.append("library", values.library);

        const response = await axios.post("/admin/addSound", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLoading(false);
        navigate("/play-list");
        toast.success("Song is successfully created");
        // toast.success(response?.data?.message)
        console.log(response?.data?.message);
        setSubmitting(false);
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
        console.log(error.message);
        setSubmitting(false);
      }
    }
  };

  const { handleSubmit, values, handleChange, errors, setFieldValue } =
    useFormik({
      initialValues: {
        avatar: null,
        movieName: "",
        title: "",
        situation: "",
        artist: "",
        library: "English",
      },
      validationSchema: Validation,
      onSubmit: AddNewData,
    });
  console.log(errors);

  const handleCategories = (e) => {
    if (categories.includes(e.target.id)) {
      const arr = categories.filter((item) => item !== e.target.id);
      console.log("arr", arr);
      setcategories(arr);
    } else {
      const temp = [...categories];
      temp.push(e.target.id);
      setcategories(temp);

      categories.push(e.target.id);
    }
  };

  console.log("{categories}");
  console.log(categories);

  const getCategories = async () => {
    try {
      const response = await axios.get("/admin/getAllCategory", {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setGetCategoriesData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("getCategoriesData", getCategoriesData);

  console.log(getCategoriesData?.data);

  return (
    <>
      {loading ? (
        <div className="w-100 min-vh-100 d-flex justify-content-center align-items-center">
          <div className={"loadingOverlay"}>
            <div className={"loadingContent"}>
              <Spinner
                color="primary"
                style={{ width: "3rem", height: "3rem" }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div id="newPlayList" className="">
          <Container fluid>
            <Form onSubmit={(e) => handleSubmit(e)}>
              <Row className="vh-100 justify-content-center  align-items-center">
                <Col
                  xs={12}
                  className="mainCol rounded-4 GetData py-3 border pb-5 px-4"
                >
                  <Row className="mainColRow p-0 m-0 justify-content-center align-content-between">
                    <Col lg={4} md={4} sm={5} className="">
                      <FormGroup>
                        <Row>
                          <Col sm={12}>
                            <Label className="fw-bold custom-label text-white">
                              Choose Library
                            </Label>
                          </Col>
                          <Col sm={6} className="d-flex align-items-center ">
                            <div
                              onClick={() => {
                                if (values?.library !== "English") {
                                  ClearCategories();
                                }
                              }}
                            >
                              <input
                                id="english"
                                type="checkbox"
                                className="mt-0"
                                onChange={() =>
                                  setFieldValue("library", "English")
                                }
                                checked={
                                  values?.library == "English" ? true : false
                                }
                                style={{
                                  cursor: "pointer",
                                  margin: "4px 0 0",
                                  lineHeight: "normal",
                                  width: "20px ",
                                  height: "20px ",
                                }}
                              />
                              <Label
                                htmlFor="english"
                                className=" p-0 m-0 ps-2 fw-bold custom-label text-white"
                                style={{
                                  cursor: "pointer",
                                }}
                              >
                                English
                              </Label>
                            </div>
                          </Col>
                          <Col
                            sm={6}
                            className="d-flex align-items-center justify-content-center"
                          >
                            <div
                              className=""
                              onClick={() => {
                                if (values?.library !== "French") {
                                  ClearCategories();
                                }
                              }}
                            >
                              <input
                                id="french"
                                type="checkbox"
                                onChange={() =>
                                  setFieldValue("library", "French")
                                }
                                checked={
                                  values?.library == "French" ? true : false
                                }
                                className="mt-0"
                                style={{
                                  cursor: "pointer",
                                  margin: "4px 0 0",
                                  lineHeight: "normal",
                                  width: "20px ",
                                  height: "20px ",
                                }}
                              />
                              <Label
                                htmlFor="french"
                                className=" p-0 m-0 ps-2 fw-bold custom-label text-white"
                                style={{
                                  cursor: "pointer",
                                }}
                              >
                                French
                              </Label>
                            </div>
                          </Col>
                          <p className="text-danger">
                            {errors.library ? errors.library : ""}
                          </p>
                        </Row>
                      </FormGroup>
                      <FormGroup id="File-upload">
                        <Label className="fw-bold custom-label text-white">
                          Select the only audio file . . .
                        </Label>
                        <Input
                          type="file"
                          name="avatar"
                          id="file"
                          accept="audio/*"
                          className="custom-input"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            setFieldValue("avatar", file);
                          }}
                        />
                        <p className="text-danger">
                          {errors.avatar ? errors.avatar : ""}
                        </p>
                      </FormGroup>
                      <FormGroup>
                        <TagsInput
                          value={keyWords}
                          onChange={setkeyWords}
                          name="keywords"
                          placeHolder="keywords"
                          onAddTag={handleAddTag}
                          onDeleteTag={handleDeleteTag}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg={1} className="d-lg-block d-none p-0"></Col>
                    <Col
                      lg={7}
                      md={8}
                      sm={7}
                      className="d-flex justify-content-center align-items-center flex-column"
                    >
                      <div className="w-100">
                        <FormGroup>
                          {/* <Label for="email">Enter the artist name</Label> */}
                          <Input
                            type="text"
                            name="title"
                            id="title"
                            value={values?.title}
                            onChange={handleChange}
                            placeholder="Title Name"
                          />
                          <p className="text-danger">
                            {errors.title ? errors.title : ""}
                          </p>
                        </FormGroup>

                        <FormGroup>
                          <textarea
                            className="form-control"
                            name="situation"
                            id="situation"
                            rows={3}
                            value={values?.situation}
                            onChange={handleChange}
                            placeholder="Situation"
                          />
                          <p className="text-danger">
                            {errors.situation ? errors.situation : ""}
                          </p>
                        </FormGroup>

                        <FormGroup>
                          <Input
                            type="text"
                            name="artist"
                            id="artist"
                            value={values?.artist}
                            onChange={handleChange}
                            placeholder={"Artist Name"}
                          />
                          <p className="text-danger">
                            {errors.artist ? errors.artist : ""}
                          </p>
                        </FormGroup>
                        <FormGroup>
                          <Input
                            type="text"
                            name="movieName"
                            id="movie"
                            value={values?.movieName}
                            onChange={handleChange}
                            placeholder={"Movie Name"}
                          />
                          <p className="text-danger">
                            {errors.movieName ? errors.movieName : ""}
                          </p>
                        </FormGroup>
                      </div>
                    </Col>

                    <Col sm={12} className="ps-3">
                      <Row className="m-0 p-0 ">
                        <p className="fw-bold text-white p-0">Categories</p>
                        <>
                          {getCategoriesData?.data &&
                            getCategoriesData?.data
                              .filter(
                                (inspi) =>
                                  inspi.Name.toLowerCase() !==
                                    "Derniers ajouts".toLowerCase() &&
                                  inspi?.library === values?.library
                              )
                              .map((categ, index) => (
                                <>
                                  <Col
                                    xs={2}
                                    className="p-0 m-0 mb-3 d-flex align-items-center text-white"
                                  >
                                    <abbr
                                      title={categ.Name}
                                      className="d-flex text-decoration-none"
                                    >
                                      <input
                                        key={index}
                                        type="checkbox"
                                        id={categ.id}
                                        className="mt-0"
                                        name={categ.Name}
                                        onChange={(e) => handleCategories(e)}
                                        style={{
                                          cursor: "pointer",
                                          margin: "4px 0 0",
                                          lineHeight: "normal",
                                          width: "20px ",
                                          height: "20px ",
                                          padding: "20px",
                                        }}
                                        checked={categories.includes(
                                          categ.id.toString()
                                        )}
                                      />
                                      &nbsp;&nbsp;
                                      <label
                                        htmlFor={categ.id}
                                        style={{
                                          cursor: "pointer",
                                          overflow: "hidden",
                                          textWrap: "nowrap",
                                          textOverflow: "ellipsis",
                                          width: "136px",
                                        }}
                                      >
                                        {categ.Name}
                                      </label>
                                    </abbr>
                                  </Col>
                                </>
                              ))}
                        </>
                      </Row>
                    </Col>
                    <Row>
                      <Col md={12} className=" mt-5">
                        <div className="text-end">
                          <Button
                            type="submit"
                            className="button1 me-3 w-25"
                            color="secondary"
                            onClick={handleSubmit}
                          >
                            Add
                          </Button>

                          <Button
                            type="reset"
                            className="w-25"
                            color="secondary"
                            onClick={() => navigate("/play-list")}
                          >
                            Cancel
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Container>
        </div>
      )}
    </>
  );
};

export default AddPage;
