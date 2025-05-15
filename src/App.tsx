import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Layout from "./components/layout/Layout.tsx";
import HomePage from "./pages/HomePage.tsx";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
