import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import GeographyPage from "../pages/Geography/GeographyPage";
import ExternalDataPage from "../pages/ExternalData/ExternalDataPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/geography"
            element={<GeographyPage />}
          />

          <Route
            path="/external-data"
            element={<ExternalDataPage />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}