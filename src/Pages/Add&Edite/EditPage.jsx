import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useLocation } from "react-router";
import * as Yup from "yup";
import "./add&edit.scss";
import { toast } from "react-toastify";
import axios from "../../utils/axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";

import {
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
  Spinner,
  Form,
  Button,
} from "reactstrap";

const EditPage = () => {
  const navigate = useNavigate();
  const getEditData = useLocation();
  const [loading, setLoading] = useState(true);
  const [categories, setcategories] = useState([]);

  const [keyWords, setkeyWords] = useState(
    getEditData.state.keyWords ? getEditData.state.keyWords : []
  );
  const [song, setSong] = useState({});
  const [getCategoriesData, setGetCategoriesData] = useState([]);
  const [useCategories, setUseCategories] = useState();

  const validation = Yup.object().shape({
    movieName: Yup.string().trim().required("Move Name is required"),
    title: Yup.string().trim().required("Title is required"),
    situation: Yup.string().trim().required("Situation is required"),
    artist: Yup.string().trim().required("Artist is required"),
  });

  const params = useParams();

  const updateSong = async (values) => {
    if (categories.length == 0) {
      toast.error("At least one categories is required");
      return;
    } else {
      const formData = new FormData();
      formData.append("categories", JSON.stringify(categories));
      formData.append("keyWords", JSON.stringify(keyWords));
      formData.append("avatar", values.avatar);
      formData.append("movieName", values.movieName);
      formData.append("title", values.title);
      formData.append("situation", values.situation);
      formData.append("artist", values.artist);

      try {
        const response = await axios.put(
          `/admin/updateSound/${params.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLoading(false);
        navigate("/play-list");
        toast.success("Song updated successfully");
      } catch (error) {
        setLoading(false);
        console.error("Error updating song:", error);
      }
    }
  };
  const { values, errors, setFieldValue, handleSubmit, handleChange } =
    useFormik({
      initialValues: {
        avatar: null,
        movieName: getEditData.state.movie ? getEditData.state.movie : "",
        title: getEditData.state.title ? getEditData.state.title : "",
        artist: getEditData.state.artist ? getEditData.state.artist : "",
        situation: getEditData.state.situation
          ? getEditData.state.situation
          : "",
      },
      validationSchema: validation,
      onSubmit: updateSong,
    });

  const GetSingleSong = async () => {
    try {
      const response = await axios.get(`/admin/singleSound/${params.id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSong(response.data);
      setkeyWords(response.data.data.music.keyWords);
      setcategories(response.data.data.music.categoryIds);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(
        "/admin/getAllCategory",

        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data.data, "data4");
      setGetCategoriesData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategories = (e) => {
    if (categories.includes(parseInt(e.target.id))) {
      const arr = categories.filter((item) => item !== parseInt(e.target.id));
      setcategories(arr);
    } else {
      const temp = [...categories];
      temp.push(parseInt(e.target.id));
      setcategories(temp);
      categories.push(e.target.id);
    }
  };

  const handleKeywords = (e) => {
    setkeyWords(e);
  };

  useEffect(() => {
    GetSingleSong();
    getCategories();
  }, [params.id]);

  useEffect(() => {
    console.log(getCategoriesData, "data000");
    console.log(categories, "categories");

    if (getCategoriesData.length > 0) {
      console.log("data3");
      let cats = getCategoriesData.map((category) => {
        const isSelected = categories.some(
          (selectedCategory) => selectedCategory === category.id
        );
        category.selected = isSelected;
        return category;
        setLoading(false);
      });

      setUseCategories(cats);
      setLoading(false);
    }
  }, [categories]);

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
                <Col xs={12} className="mainCol rounded-4 GetData py-5 px-4">
                  <Row className="mainColRow p-0 m-0 justify-content-center align-content-between">
                    <Col lg={4} md={4} sm={5} className="">
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
                          onChange={(data) => {
                            const file = data.currentTarget.files[0];
                            setFieldValue("avatar", file);
                          }}
                        />
                        {/* <p className="border border-danger " style={{
                          width:"100%",
                          overflowWrap:"anywhere"
                        }}>{getEditData.state.musicUrl}</p> */}
                        <p className="text-danger">
                          {errors.avatar ? errors.avatar : ""}
                        </p>
                      </FormGroup>
                      <FormGroup>
                        <TagsInput
                          value={keyWords}
                          onChange={handleKeywords}
                          name="keywords"
                          placeHolder="keywords"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg={1} className="d-lg-block d-none p-0"></Col>
                    <Col lg={7} md={8} sm={7} className="">
                      <FormGroup>
                        <Input
                          type="text"
                          name="title"
                          id="title"
                          value={values?.title}
                          placeholder="Title Name"
                          onChange={handleChange}
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
                          placeholder="Situation"
                          onChange={handleChange}
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
                          placeholder={"Artist Name"}
                          onChange={handleChange}
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
                          placeholder={"Movie Name"}
                          onChange={handleChange}
                        />
                        <p className="text-danger">
                          {errors.movieName ? errors.movieName : ""}
                        </p>
                      </FormGroup>
                    </Col>
                    <>
                      <Col sm={12} className="p-0 ps-3 ">
                        <Row className="m-0 p-0 ">
                          <p className="fw-bold text-white p-0">Categories</p>
                          <>
                            {console.log(getCategoriesData, "categories")}
                            {getCategoriesData &&
                              getCategoriesData?.map((item, index) => (
                                <>
                                  <Col
                                    xs={4}
                                    className="  p-0 m-0 mb-3 d-flex align-items-center ju text-white"
                                  >
                                    <input
                                      key={index}
                                      type="checkbox"
                                      id={item.id}
                                      className="mt-0"
                                      name={item.Name}
                                      onChange={(e) => handleCategories(e)}
                                      style={{
                                        cursor: "pointer",
                                        margin: "4px 0 0",
                                        lineHeight: "normal",
                                        width: "20px ",
                                        height: "20px ",
                                      }}
                                      checked={item.selected}
                                    />
                                    &nbsp;&nbsp;
                                    <label
                                      htmlFor={item.id}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                    >
                                      {item.Name}
                                    </label>
                                  </Col>
                                </>
                              ))}
                          </>
                        </Row>
                      </Col>
                    </>
                    <Row>
                      <Col md={12} className=" mt-5">
                        <div className="text-end">
                          <Button
                            type="submit"
                            className="button1 me-3 w-25"
                            color="secondary"
                            onClick={handleSubmit}
                          >
                            Edit
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

export default EditPage;
