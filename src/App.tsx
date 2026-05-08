import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ChapterDetail from "./pages/ChapterDetail";
import SectionDetail from "./pages/SectionDetail";
import Quiz from "./pages/Quiz";
import Review from "./pages/Review";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chapters/:chapterId" element={<ChapterDetail />} />
          <Route path="/sections/:sectionId" element={<SectionDetail />} />
          <Route path="/quiz/:sectionId" element={<Quiz />} />
          <Route path="/review" element={<Review />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
