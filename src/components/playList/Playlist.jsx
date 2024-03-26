import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
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
import PopUpModal from "../../shears/Modal";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { toast } from "react-toastify";
import songImage from "../../assets/Image/songImage.jpg";
import play from "../../assets/Image/play.png";
import pause from "../../assets/Image/pause.png";
import "./playList.scss";
import { Await, Navigate, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import PaginationComponent from "../../shears/Pagination";

const PlayList = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const [tableData, setTableData] = useState([]);
  const [modal, setModal] = useState(false);

  const [currentIndex, setCurrentIndex] = useState("");
  const [playingSongIndex, setPlayingSongIndex] = useState(null);
  const [playListEdit, setPlayListEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(30); // yiha sy page select hota hy ky paginayion me kitna page show hoo ga
  const [signOut, setSignOut] = useState(false);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = tableData?.slice(indexOfFirstPost, indexOfLastPost);
  const navigate = useNavigate();
  const [soundData, setSoundData] = useState({
    editedArtist: "",
    editedSituation: "",
    editedTitle: "",
    editedMovie: "",
    editedSoundFile: "",
  });

  const playSound = (index) => {
    stopSound();
    setPlayingSongIndex(index);
    setPlayListEdit(index);
  };

  const clearData = () => {
    const clear = localStorage.clear("token");
    if (clear === undefined) {
      navigate("/");
    }
    console.log(clear, "clear token null");
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
      .delete(`/admin/deleteSound/${index}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((dele) => {
        const updatedTableData = [...tableData];
        let data = updatedTableData.filter((item) => item.id !== index);
        getAllSongs();
        console.log("delete message", dele?.data?.message);
        toast.success(dele?.data?.message);
      })
      .catch((error) => {
        console.log("Error deleting data bilal:", error?.data?.message);
        toast.error(error?.response?.data?.data?.message);
      });
  };

  const saveEdit = () => {
    if (
      soundData?.editedTitle === "" &&
      soundData?.editedArtist === "" &&
      soundData?.editedSituation === "" &&
      soundData?.editedMovie === ""
    ) {
      toast.error("Fill all fields");
      return;
    } else if (soundData?.editedTitle === "") {
      toast.error("Fill Title");
      toast.error("Fill Situation");
      toast.error("Fill Artist");
      toast.error("Fill Movie");
      return;
    } else if (soundData?.editedSituation === "") {
      toast.error("Fill Situation");
      toast.error("Fill Artist");
      toast.error("Fill Movie");
      return;
    } else if (soundData?.editedArtist === "") {
      toast.error("Fill Artist");
      toast.error("Fill Movie");
      return;
    } else if (soundData?.editedMovie === "") {
      toast.error("Fill Movie");
      return;
    }
    setAddLoading(true);

    const updatedSoundBody = new FormData();
    updatedSoundBody.append("title", soundData?.editedTitle);
    updatedSoundBody.append("situation", soundData?.editedSituation);
    updatedSoundBody.append("artist", soundData?.editedArtist);
    updatedSoundBody.append("movieName", soundData?.editedMovie);
    updatedSoundBody.append("avatar", soundData?.editedSoundFile);

    axios
      .put(`/admin/updateSound/${currentIndex}`, updatedSoundBody, {
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
        toast.success(response?.data?.message);
      })
      .catch((error) => {
        setAddLoading(false);
        toast.error(error?.message);
        console.log(error?.message);
        console.log("Error updating data uzair:", error?.message);
      });
  };

  const resetSoundData = () => {
    setSoundData({
      editedArtist: "",
      editedSituation: "",
      editedTitle: "",
      editedMovie: "",
      editedSoundFile: "",
    });
  };

  const addSound = () => {
    if (
      soundData?.editedTitle === "" &&
      soundData?.editedArtist === "" &&
      soundData?.editedSituation === "" &&
      soundData?.editedMovie === "" &&
      soundData?.editedSoundFile === ""
    ) {
      toast.error("Fill all fields");
      return;
    } else if (soundData?.editedTitle === "") {
      toast.error("Fill Title");
      toast.error("Fill Situation");
      toast.error("Fill Artist");
      toast.error("Fill Movie");
      return;
    } else if (soundData?.editedSituation === "") {
      toast.error("Fill Situation");
      toast.error("Fill Artist");
      toast.error("Fill Movie");
      return;
    } else if (soundData?.editedArtist === "") {
      toast.error("Fill Artist");
      toast.error("Fill Movie");
      return;
    } else if (soundData?.editedMovie === "") {
      toast.error("Fill Movie");
      return;
    } else if (soundData?.editedSoundFile === "") {
      toast.error("File not found");
      return;
    }
    setAddLoading(true);
    const addSoundBody = new FormData();
    addSoundBody.append("title", soundData?.editedTitle);
    addSoundBody.append("artist", soundData?.editedArtist);
    addSoundBody.append("situation", soundData?.editedSituation);
    addSoundBody.append("movieName", soundData?.editedMovie);
    addSoundBody.append("avatar", soundData?.editedSoundFile);
    addSoundBody.append("releaseDate", "12-12-1222");

    axios
      .post(`/admin/addSound`, addSoundBody, {
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
  };
  console.log(currentPage, postsPerPage);
  const getAllSongs = () => {
    setLoading(true);
    axios
      .get(`/admin/getAllSounds?page=${currentPage}&size=${postsPerPage}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      .then((response) => {
        setTableData(response.data?.data?.music?.rows);
        setTotalPages(response.data?.data?.count);
        setTotalPageCount(response.data?.data?.pages);
        setLoading(false);
        stopSound();
        console.log(response?.data?.message);
        // toast.success(response?.data?.message);
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
    setSoundData({
      ...soundData,
      editedArtist: tableData[index]?.artist,
      editedSituation: tableData[index]?.situation,
      editedMovie: tableData[index]?.movie,
      editedTitle: tableData[index]?.title,
    });

    setCurrentIndex(tableData[index]?.id);
    console.log("Editing row:", index);
  };

  const searchSong = (e) => {
    axios
      .get(
        `/admin/getAllSounds?page=${currentPage}&size=${postsPerPage}&search=${e.target.value}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      .then((response) => {
        setTableData(response.data?.data?.music?.rows);
        setTotalPages(response.data?.data?.count);
        setLoading(false);
        stopSound();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.data?.message);
        setLoading(false);
      });
  };

  const SignOut = () => {
    setSignOut(!signOut);
  };

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
          <Container fluid>
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
                  <Link
                    to="/addPage"
                    className="text-decoration-none text-white w-100"
                  >
                    <i
                      class=" bi bi-file-earmark-plus button1"
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "5px",
                        fontSize: "15px",
                        padding: "13px 33px",
                      }}
                    ></i>
                  </Link>
                </div>
              </Col>
              <Col sm={2} xs={1} className="addTable ">
                <div
                  className="h-100 w-100 d-flex justify-content-center"
                  style={{
                    fontSize: "18px",
                    color: "#fff",
                    boxShadow: "none",
                  }}
                >
                  <Link
                    to="/categories"
                    className="text-decoration-none d-flex justify-content-center align-items-center text-white w-100 border rounded-2"
                  >
                    categories
                  </Link>
                </div>
              </Col>
              <Col sm={1} className="d-sm-block d-none "></Col>
              <Col
                sm={6}
                xs={5}
                style={{ position: "relative" }}
                className="d-flex justify-content-end align-items-center "
              >
                <Input
                  id="placeholder"
                  className="bg-transparent text-white white-placeholder custom-placeholder"
                  type="text"
                  onChange={searchSong}
                  placeholder="Search"
                />
              </Col>
              <Col sm={2} xs={3} className="addTable ">
                <div
                  className="h-100 w-100 button1 rounded-2 d-flex align-items-center justify-content-center"
                  style={{
                    fontSize: "18px",
                    color: "#fff",
                    boxShadow: "none",
                    cursor: "pointer",
                  }}
                  onClick={SignOut}
                >
                  Sign Out
                </div>
              </Col>
              <Col xs={12} className="tables">
                <Table>
                  <thead style={{ fontSize: "18px", fontWeight: "bold" }}>
                    <td className="ps-3">#</td>
                    <td>Title</td>
                    <td>Situation</td>
                    <td>Artist</td>
                    <td>Movie</td>
                    <td style={{ textAlign: "center" }}>Action</td>
                  </thead>
                  <tbody style={{ verticalAlign: "baseline" }}>
                    {tableData?.map((data, index) => (
                      <tr>
                        <td className="my-3">
                          <div className="d-flex justify-content-start align-items-center ">
                            <span
                              className="h6 m-0 px-3 fw-bold"
                              style={{ color: "#FFFFFF99" }}
                            >
                              {index + 1}
                            </span>
                            <div
                              className="position-relative cursor-pointer"
                              style={{ width: "60px", height: "60px" }}
                              onClick={() => {
                                playingSongIndex === index
                                  ? stopSound()
                                  : playSound(index);
                              }}
                            >
                              <img
                                src={songImage}
                                alt="thumbNail"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "5px",
                                }}
                              />
                              {playingSongIndex === index ? (
                                <i
                                  className="position-absolute top-50 start-50 translate-middle"
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "bolder",
                                    cursor: "pointer",
                                  }}
                                >
                                  <img src={pause} alt="playIcon" width={20} />
                                </i>
                              ) : (
                                <i
                                  className="position-absolute top-50 start-50 translate-middle"
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "bolder",
                                    cursor: "pointer",
                                  }}
                                >
                                  <img src={play} alt="playIcon" width={20} />
                                </i>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className=" m-0 p-0">
                          <div
                            className="maxWidth text-center text-truncate pb-1 bg-danger rounded-5"
                            style={{
                              alignItems: "center",
                            }}
                          >
                            <span
                              className=" text-nowrap text-white p-0 m-0 px-2"
                              style={{ fontSize: "15px" }}
                            >
                              <abbr title={data?.title}>{data?.title}</abbr>
                            </span>
                          </div>
                        </td>
                        <td className=" m-0 p-0 ">
                          <div className="maxWidth text-truncate">
                            <span
                              className="pb-1 text-nowrap text-white p-0 m-0 px-2"
                              style={{ fontSize: "15px" }}
                            >
                              <abbr title={data?.situation}>
                                {data?.situation}
                              </abbr>
                            </span>
                          </div>
                        </td>
                        <td className=" m-0 p-0">
                          <div className="maxWidth text-truncate">
                            <span
                              className="pb-1 text-nowrap text-white p-0 m-0 px-2"
                              style={{ fontSize: "15px" }}
                            >
                              <abbr title={data?.artist}>{data?.artist}</abbr>
                            </span>
                          </div>
                        </td>
                        <td className=" m-0 p-0">
                          <div className="maxWidth text-truncate">
                            <span
                              className="pb-1 text-nowrap text-white p-0 m-0 px-2"
                              style={{ fontSize: "15px" }}
                            >
                              <abbr title={data?.movie}>{data?.movie}</abbr>
                            </span>
                          </div>
                        </td>

                        <td className="" style={{ textAlign: "center" }}>
                          <div className="maxWidth ">
                            <button
                              onClick={() => {
                                navigate(`/sound/${data.id}`, {
                                  state: data,
                                });
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#FFFF",
                              }}
                            >
                              <i
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

          {playingSongIndex !== null && (
            <Container
              fluid
              className="audio1 py-1"
              style={{ backgroundColor: "rgba(68, 68, 68, 0.6)", zIndex: "10" }}
            >
              <Row className="d-flex align-items-end p-0">
                <Col xs={1} className="d-md-block d-none"></Col>

                <Col sm={12}>
                  <div className="audio">
                    <div className="PlayerApp">
                      <AudioPlayer
                        key={playingSongIndex}
                        autoPlay={true}
                        id={`audio-${playingSongIndex}`}
                        className="audio"
                        src={tableData[playingSongIndex]?.musicUrl}
                        onEnded={() => {
                          stopSound();
                        }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          )}
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
        ModalTitle={isEditing ? "Editing List" : "Add new list"}
        handleClose={() => setModal(false)}
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
          <Col md={6} sm={12} className="">
            <FormGroup id="File-upload">
              <Label for="file" className="fw-bold custom-label">
                Select the only audio file.
              </Label>
              <Input
                type="file"
                name="file"
                id="file"
                accept="audio/*"
                className="custom-input"
                onChange={(data) =>
                  setSoundData({
                    ...soundData,
                    editedSoundFile: data.target.files[0],
                  })
                }
              />
            </FormGroup>
          </Col>
          <Col md={6} sm={12} className="">
            <FormGroup>
              <Input
                type="text"
                name="title"
                id="title"
                value={soundData?.editedTitle}
                placeholder="Title Name"
                onChange={(data) =>
                  setSoundData({
                    ...soundData,
                    editedTitle: data.target.value,
                  })
                }
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                name="situation"
                id="situation"
                value={soundData?.editedSituation}
                placeholder={"Situation"}
                onChange={(data) =>
                  setSoundData({
                    ...soundData,
                    editedSituation: data.target.value,
                  })
                }
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                name="artist"
                id="artist"
                value={soundData?.editedArtist}
                placeholder={"Artist Name"}
                onChange={(data) =>
                  setSoundData({
                    ...soundData,
                    editedArtist: data.target.value,
                  })
                }
              />
            </FormGroup>

            <FormGroup>
              <Input
                type="text"
                name="movie"
                id="movie"
                value={soundData?.editedMovie}
                placeholder={"Movie Name"}
                onChange={(data) =>
                  setSoundData({
                    ...soundData,
                    editedMovie: data.target.value,
                  })
                }
              />
            </FormGroup>
          </Col>
        </Row>
      </PopUpModal>
      <PopUpModal
        isOpen={signOut}
        handleClick={clearData}
        handleClose={SignOut}
        Cancel={
          <span
            class="bi-bi-x-circle-fill"
            style={{
              cursor: "pointer",
            }}
          >
            Cancel
          </span>
        }
        Submit="Sign Out"
      >
        <h4 className="text-center">Are you sure you want to Sign out?</h4>
      </PopUpModal>
    </>
  );
};

export default PlayList;
