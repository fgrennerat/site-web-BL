import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SubjectPage from "./pages/SubjectPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/:slug" element={<SubjectPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
