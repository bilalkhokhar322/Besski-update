import React, { useEffect, useState } from "react";
import "./SideBar.scss";
import {
  SignOutIcon,
  SignOutIconActive,
  HomeIcon,
  HomeIconActive,
  Dashboard,
  DashboardActive,
} from "../../assets/SvgIcons/icons.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import PopUpModal from "../../shears/Modal.jsx";

const SideBar = ({ events }) => {
  const [show, setShow] = useState(false);
  let navigate = useNavigate();
  const clearData = () => {
    const clear = localStorage.clear("token");
    setSignOutModal(!signOutModal);
    if (clear === undefined) {
      navigate("/");
    }
    console.log(clear, "clear token null");
  };
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const [isShow, setIsHide] = useState("userinfon");
  const hideAndShow = () => {
    setIsHide(!isShow);
  };

  const [signOutModal, setSignOutModal] = useState(false);
  const ModalSignOut = () => {
    setSignOutModal(!signOutModal);
  };

  const Items = [
    {
      name: "Home",
      route: "/play-list",
      icon1: HomeIcon,
      iconActive: HomeIconActive,
    },
    {
      name: "Categories",
      route: "/categories",
      icon1: Dashboard,
      iconActive: DashboardActive,
    },
    {
      name: "SignOut",
      icon1: SignOutIcon,
      iconActive: SignOutIconActive,
    },
  ];

  const [activeTab, setActiveTab] = useState("/play-list");
  let location = useLocation();

  useEffect(() => {
    if (location.pathname === "/play-list") {
      setActiveTab("/play-list");
    } else {
      setActiveTab(location.pathname);
    }
  }, [location.pathname]);

  const [browserWidth, setBrowserWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setBrowserWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div
        className={`sidebar border ${isOpen ? "active" : ""} ${
          browserWidth < 552 ? "d-none" : ""
        }`}
      >
        <div className="sd-header">
          <Button
            className="btn btn-primary"
            id="closeBtn"
            onClick={() => {
              toggleSidebar();
              hideAndShow();
            }}
          >
            <FontAwesomeIcon icon={faBars} />
          </Button>
        </div>
        <div className="sd-body">
          <ul>
            {Items?.map((event, i) => {
              if (event.name === "Logout") {
                return (
                  <p key={i}>
                    <li
                      onClick={() => {
                        setShow(true);
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-center">
                        <i className="p-2 ">{event.icon1}</i>
                        <p className="sd-link m-0">{event.name}</p>
                      </div>
                    </li>
                  </p>
                );
              } else {
                return (
                  <li key={i}>
                    <Link
                      to={event.route}
                      onClick={() => setActiveTab(event.route)}
                      className="text-decoration-none"
                    >
                      <div
                        onClick={
                          event.name === "SignOut" ? ModalSignOut : () => {}
                        }
                        className={`${
                          activeTab === event.route
                            ? "activeNav d-flex align-items-center justify-content-center"
                            : "fontColorNav d-flex align-items-center justify-content-center"
                        }`}
                      >
                        {activeTab === event.route ? (
                          <i className="p-2">{event.iconActive}</i>
                        ) : (
                          <i className="p-2">{event.icon1}</i>
                        )}
                        <p className="sd-link m-0">{event.name}</p>
                      </div>
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </div>
        <div></div>
      </div>
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={toggleSidebar}
      />
      <PopUpModal
        isOpen={signOutModal}
        handleClick={clearData}
        handleClose={ModalSignOut}
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
        <h4 className="text-center">Are you sure you want to sign out?</h4>
      </PopUpModal>
    </>
  );
};

export default SideBar;
