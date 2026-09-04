import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SubjectPage from "./pages/SubjectPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminPage />} />
      {/* Attrape-tout : une matière peut avoir une URL à plusieurs segments
          (ex. /lv2/allemand), donc c'est SubjectPage qui résout l'URL contre
          disciplines.js et affiche NotFound si rien ne correspond. */}
      <Route path="*" element={<SubjectPage />} />
    </Routes>
  );
}
