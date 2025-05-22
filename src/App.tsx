import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import StatsPage from "./pages/StatsPage";
import ReactionTestPage from "./pages/games/ReactionTestPage";
import WordMemoryPage from "./pages/games/WordMemoryPage";
import TestPage from "./pages/TestPage";
import TileMemoryPage from "./pages/games/TileMemoryPage";

const App: React.FC = () => {
  // Add this to the beginning of your App component
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect");
    if (redirect) {
      window.history.replaceState({}, "", redirect);
    }
  }, []);
  
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/games/reaction-test" element={<ReactionTestPage />} />
          <Route path="/games/word-memory" element={<WordMemoryPage />} />
          <Route path="/games/tile-memory" element={<TileMemoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
