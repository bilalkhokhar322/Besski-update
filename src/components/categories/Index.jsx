import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import PopUpModal from "../../shears/Modal";
import { toast } from "react-toastify";
import PaginationComponent from "../../shears/Pagination";
import "react-h5-audio-player/lib/styles.css";
import { BackToPage } from "../../assets/SvgIcons/icons";
import "./categories.scss";
import {
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
  Spinner,
} from "reactstrap";
import { Link } from "react-router-dom";

const CategoriesPage = () => {
  const [tableData, setTableData] = useState([]);
  const [modal, setModal] = useState(false);
  const [showModalEditImage, setShowModalEditImage] = useState();
  const [currentIndex, setCurrentIndex] = useState("");
  const [playingSongIndex, setPlayingSongIndex] = useState(null);
  const [playListEdit, setPlayListEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(20);
  const [editSetData, setEditSetData] = useState();
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = tableData?.slice(indexOfFirstPost, indexOfLastPost);
  const [avatarError, setAvatarError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [languageError, setLanguageError] = useState(false);
  const [soundData, setSoundData] = useState({
    name: "",
    library: "",
    avatar: null,
  });
  console.log(soundData);

  const playSound = (index) => {
    stopSound();
    setPlayingSongIndex(index);
    setPlayListEdit(index);
  };

  const stopSound = () => {
    if (playingSongIndex !== null) {
      const currentAudioPlayer = document.getElementById(
        `audio-${playingSongIndex}`
      );
      if (currentAudioPlayer) {
        currentAudioPlayer.pause();
        currentAudioPlayer.currentTime = 0;
      }
    }
    setPlayingSongIndex(null);
  };

  const editList = () => {
    if (playListEdit !== null) {
      const currentListEdit = document.getElementById(`audio-${playListEdit}`);
      if (currentListEdit) {
        currentListEdit.pause();
        currentListEdit.currentTime = 0;
      }
    }
    setPlayListEdit(null);
  };

  const deleteRow = (index) => {
    if (playingSongIndex === index) {
      stopSound();
    }
    if (playListEdit === index) {
      editList();
    }

    axios
      .delete(`/admin/deleteCategory/${index}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((dele) => {
        const updatedTableData = [...tableData];
        let data = updatedTableData.filter((item) => item.id !== index);
        getAllSongs();
        toast.success(dele?.data?.message);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.data?.message);
      });
  };

  const saveEdit = () => {
    setAddLoading(true);
    console.log(showModalEditImage);

    const updatedSoundBody = new FormData();
    updatedSoundBody.append(
      "name",
      soundData?.name ? soundData?.name : editSetData
    );
    updatedSoundBody.append(
      "avatar",
      soundData?.avatar ? soundData?.avatar : showModalEditImage
    );

    if (soundData?.name !== "" || soundData?.library !== "") {
      axios
        .put(`/admin/updateCategory/${currentIndex}`, updatedSoundBody, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          if (response?.data?.success) {
            setAddLoading(false);
            getAllSongs();
            resetSoundData();
            setModal(false);
          }
          toast.success("Categories Updated");
          console.log(response?.data);
        })
        .catch((error) => {
          setAddLoading(false);
          toast.error(error?.message);
        });
    } else {
      if (soundData?.name === "" && soundData?.library === "") {
        setNameError(true);
        setLanguageError(true);
      }
      setAddLoading(false);
    }
  };

  const resetSoundData = () => {
    setSoundData({
      name: "",
      library: "",
      avatar: null,
    });
  };

  const addSound = () => {
    console.log(soundData?.name);
    if (!soundData?.name && !soundData?.avatar && !soundData?.library) {
      console.log(soundData);
      setNameError(true);
      setAvatarError(true);
      setLanguageError(true);
      return;
    } else if (!soundData?.avatar && soundData?.name && soundData?.library) {
      setAvatarError(true);
      setNameError(false);
      setLanguageError(false);
      return;
    } else if (!soundData?.name && soundData?.avatar && soundData?.library) {
      setNameError(true);
      setAvatarError(false);
      setLanguageError(false);
      return;
    } else if (!soundData?.library && soundData?.name && soundData?.avatar) {
      setLanguageError(true);
      setAvatarError(false);
      setNameError(false);
      return;
    }
    setAddLoading(true);
    const addSoundBody = new FormData();
    addSoundBody.append("name", soundData?.name);
    addSoundBody.append("avatar", soundData?.avatar);
    addSoundBody.append("library", soundData?.library);
    addSoundBody.append("releaseDate", "12-12-1222");

    if (!avatarError && !nameError && !languageError) {
      axios
        .post(`/admin/addCategory`, addSoundBody, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          toast.success(response?.data?.message);
          getAllSongs();
          resetSoundData();
          setModal(false);
          setAddLoading(false);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.data?.message);
          setAddLoading(false);
          setLoading(false);
        });
    } else {
      setAddLoading(false);
    }
  };
  const getAllSongs = () => {
    setLoading(true);
    axios
      .get(`/admin/getAllCategory`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      .then((response) => {
        console.log(response?.data?.data);
        setTableData(response?.data?.data);
        setTotalPages(response.data?.data?.count);
        setTotalPageCount(response.data?.data?.pages);
        setLoading(false);
        stopSound();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.data?.message);
        console.log(error, "find error");
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllSongs();
  }, [currentPage]);

  const editRow = (index) => {
    setCurrentIndex(tableData[index]?.id);
  };

  const DeletImageEditModal = () => {
    setShowModalEditImage("");
  };

  console.log("languageError", languageError);
  console.log("nameError", nameError);
  console.log("soundData", soundData);

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
        <div id="playList" className="w-100 h-100">
          <Container
            fluid
            style={{
              width: "80%",
            }}
          >
            <Row>
              <Col sm={1} xs={2} className="addTable ">
                <div
                  className="h-100 w-100 d-flex justify-content-center"
                  style={{
                    fontSize: "18px",
                    color: "#fff",
                    boxShadow: "none",
                  }}
                >
                  <Link to="/play-list" className="text-decoration-none">
                    <i className="pb-3 ">{BackToPage}</i>
                  </Link>
                </div>
              </Col>
              <Col sm={1} xs={2} className="addTable ">
                <div
                  className="h-100 w-100 d-flex justify-content-center"
                  style={{
                    fontSize: "18px",
                    color: "#fff",
                    boxShadow: "none",
                  }}
                >
                  <span
                    class="h-100 w-100 bi bi-file-earmark-plus button1"
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "5px",
                      fontSize: "15px",
                      padding: "13px 33px",
                    }}
                    onClick={() => {
                      DeletImageEditModal();
                      setIsEditing(false);
                      resetSoundData();
                      setModal(true);
                      setEditSetData();
                    }}
                  ></span>
                </div>
              </Col>
              <Col sm={2} xs={3} className="addTable ">
                <div
                  className="h-100 button1 w-100 butt rounded-2 d-flex align-items-center justify-content-center"
                  style={{
                    fontSize: "15px",
                    cursor: "pointer",
                    color: "#fff",
                    boxShadow: "none",
                  }}
                >
                  All
                </div>
              </Col>
              <Col sm={2} xs={3} className="addTable ">
                <div
                  className="h-100 w-100 border rounded-2 d-flex align-items-center justify-content-center"
                  style={{
                    fontSize: "15px",
                    cursor: "pointer",
                    color: "#fff",
                    boxShadow: "none",
                  }}
                >
                  English
                </div>
              </Col>
              <Col sm={2} xs={3} className="addTable ">
                <div
                  className="h-100 w-100 border rounded-2 d-flex align-items-center justify-content-center"
                  style={{
                    fontSize: "15px",
                    cursor: "pointer",
                    color: "#fff",
                    boxShadow: "none",
                  }}
                >
                  French
                </div>
              </Col>

              <Col xs={12} className="tables">
                <Table>
                  <thead
                    className=""
                    style={{ fontSize: "18px", fontWeight: "bold" }}
                  >
                    <td className="ps-3"># &nbsp; Image</td>
                    <td className="text-center">Name</td>
                    <td
                      style={{ textAlign: "center" }}
                      className="text-end pe-3"
                    >
                      Action
                    </td>
                  </thead>
                  <tbody className="" style={{ verticalAlign: "baseline" }}>
                    {tableData
                      .filter(
                        (data) =>
                          data.Name.toLowerCase() !==
                          "Derniers ajouts".toLowerCase()
                      )
                      .map((data, index) => (
                        <tr className="">
                          <td className="my-3 ">
                            <div className="d-flex justify-content-start align-items-center ">
                              <span
                                className="h6 m-0 px-3 fw-bold"
                                style={{ color: "#FFFFFF99" }}
                              >
                                {index + 1}
                              </span>
                              <div
                                className="position-relative"
                                style={{ width: "60px", height: "60px" }}
                              >
                                <img
                                  src={data?.image}
                                  alt="thumbNail"
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "5px",
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className=" m-0 p-0  ">
                            <div className=" text-center pb-1 rounded-5">
                              <span
                                className=" text-nowrap text-white p-0 m-0 px-2"
                                style={{ fontSize: "15px" }}
                              >
                                <abbr title={data?.Name}>{data?.Name}</abbr>
                              </span>
                            </div>
                          </td>
                          <td className="pe-3" style={{ textAlign: "end" }}>
                            <div>
                              <button
                                onClick={() => {
                                  setShowModalEditImage(data.image);
                                  setSoundData({
                                    ...soundData,
                                    name: data?.Name,
                                  });
                                  setIsEditing(true);
                                  setEditSetData(data?.Name);

                                  editRow(index);
                                  setPlayListEdit === index
                                    ? editList()
                                    : editRow(index);
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#FFFF",
                                }}
                              >
                                <i
                                  onClick={() => setModal(true)}
                                  className="bi-pencil me-lg-3 me-1"
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bolder",
                                    cursor: "pointer",
                                    color: "#FFFF",
                                  }}
                                ></i>
                              </button>

                              <i
                                className="bi-trash  "
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "bolder",
                                  cursor: "pointer",
                                  color: "#FFFF",
                                }}
                                onClick={() => deleteRow(data.id)}
                              ></i>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
          {tableData && (
            <PaginationComponent
              postsPerPage={postsPerPage}
              totalPosts={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      )}
      <PopUpModal
        isOpen={modal}
        loading={addLoading}
        className="bg-transparent"
        ModalTitle={isEditing ? "Edit Category" : "Add New Category"}
        handleClose={() => {
          setModal(false);
          setAvatarError(false);
          setNameError(false);
          setLanguageError(false);
        }}
        handleClick={isEditing ? saveEdit : addSound}
        Cancel={
          <span
            class="h5 bi-bi-x-circle-fill"
            style={{
              cursor: "pointer",
            }}
          >
            Cancel
          </span>
        }
        Submit={
          <span
            className="px-2"
            style={{
              cursor: "pointer",
            }}
          >
            {addLoading ? (
              <>
                <span class="h5 bi-bi-plus-circle-fill">
                  <Spinner className={"spinner"} />
                </span>
              </>
            ) : isEditing ? (
              <span class="h5 bibi-pencil-square">Edit</span>
            ) : (
              <span class="h5 bi-bi-plus-circle-fill">Add</span>
            )}
          </span>
        }
      >
        <Row className="justify-content-center align-items-center">
          {showModalEditImage && (
            <Col md={3} sm={12} className="">
              <>
                <div className="position-relative">
                  <img
                    src={showModalEditImage}
                    alt=""
                    className="border p-1"
                    style={{
                      width: "100px",
                    }}
                  />
                </div>
                <p
                  className="text-muted text-center m-0"
                  style={{
                    fontSize: "13px",
                  }}
                >
                  current image
                </p>
              </>
            </Col>
          )}
          <Col className="">
            <FormGroup id="File-upload">
              <Row>
                <Col sm={6} className="d-flex align-items-center">
                  <Label
                    className="fw-bold"
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    Which Library for this category ?
                  </Label>
                </Col>
                <Col sm={3} className="d-flex align-items-center">
                  <input
                    id="english"
                    name="english"
                    type="checkbox"
                    className="mt-0"
                    onChange={() => {
                      setSoundData({
                        ...soundData,
                        library: "English",
                      });
                      setLanguageError(false);
                    }}
                    checked={soundData?.library == "English" ? true : false}
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
                    className=" p-0 m-0 ps-2 fw-bold custom-label"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    English
                  </Label>
                </Col>
                <Col
                  sm={3}
                  className="d-flex align-items-center justify-content-center"
                >
                  <input
                    id="french"
                    type="checkbox"
                    name="French"
                    onChange={() => {
                      setSoundData({
                        ...soundData,
                        library: "French",
                      });
                      setLanguageError(false);
                    }}
                    checked={soundData?.library === "French" ? true : false}
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
                    className=" p-0 m-0 ps-2 fw-bold custom-label"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    French
                  </Label>
                </Col>
                <Col sm={6}></Col>
                <Col sm={6}>
                  <p className="text-danger">
                    {languageError ? "Language is required " : ""}
                  </p>
                </Col>
              </Row>
              <Label
                for="file"
                className="fw-bold custom-label"
                style={{
                  fontSize: "14px",
                }}
              >
                Select the Category Image.
              </Label>
              <Input
                type="file"
                name="avatar"
                id="file"
                accept="image/x-png,image/gif,image/jpeg"
                className="custom-input"
                onChange={(event) => {
                  setAvatarError(false);
                  setSoundData({
                    ...soundData,
                    avatar: event.target.files[0], // Access file data from event object
                  });
                }}
              />
              <p className="text-danger">
                {avatarError ? "File is required" : ""}
              </p>
            </FormGroup>
          </Col>
          <Col md={12} sm={12}>
            <FormGroup>
              <Input
                type="text"
                name="name"
                id="name"
                value={soundData?.name}
                placeholder="Enter Category Name "
                onChange={(e) => {
                  setNameError(false);
                  setSoundData({
                    ...soundData,
                    // name: e.target.value.trim(),
                    name: e.target.value.replace(/^\s+/, ""),
                  });
                }}
              />
              <p className="text-danger">
                {nameError ? "Name is required " : ""}
              </p>
            </FormGroup>
          </Col>
        </Row>
      </PopUpModal>
    </>
  );
};

export default CategoriesPage;
