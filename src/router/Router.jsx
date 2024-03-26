import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ForgotPassword from "../Pages/forgotPassword/Index.jsx";
import ResetPassword from "../Pages/resetPassword/Index.jsx";
import LogIn from "../Pages/Login";
import PlayList from "../components/playList/Playlist.jsx";
import Layout from "../layout/Layout";
import Controls from "../Pages/play&puss_Song_Controls/Index.jsx";
import ProtectedRoute from "./ProtectedRoute";
import AddPage from "../Pages/Add&Edite/AddPage";
import EditPage from "../Pages/Add&Edite/EditPage";
import CategoriesPage from "../components/categories/Index.jsx";
import Error from "../Pages/error/Index.jsx";
const RoutesPage = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route
          path="/forgot-password"
          element={
            <Layout>
              <ForgotPassword />
            </Layout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <Layout>
              <ResetPassword />
            </Layout>
          }
        />
        <Route
          path="/song-playList"
          element={
            <Layout>
              <PlayList />
            </Layout>
          }
        />
        <Route
          path="/play-list"
          element={
            <ProtectedRoute>
              <Layout>
                <PlayList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/song-controls" element={<Controls />} />
        <Route
          path="/addPage"
          element={
            <ProtectedRoute>
              <Layout>
                <AddPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sound/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Layout>
                <CategoriesPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Layout>
              <Error />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default RoutesPage;
