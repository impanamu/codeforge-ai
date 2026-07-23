import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import RepositoriesPage from "@/features/repositories/pages/RepositoriesPage";
import RepositoryDetailsPage from "@/pages/repository/RepositoryDetailsPage";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route
            path="/repositories"
            element={<RepositoriesPage />}
          />

          <Route
            path="/repositories/:id"
            element={<RepositoryDetailsPage />}
          />
        </Route>

        <Route
          path="*"
          element={<h1>404 - Page Not Found</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
}