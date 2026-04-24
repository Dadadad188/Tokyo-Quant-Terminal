import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DesktopTerminal from "./routes/DesktopTerminal";
import MobileTerminal from "./routes/MobileTerminal";

function isMobileBrowser() {
  if (typeof window === "undefined") return false;
  const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  const narrowViewport = window.matchMedia?.("(max-width: 767px)")?.matches ?? false;
  const mobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(window.navigator.userAgent);
  return mobileUA || (coarsePointer && narrowViewport);
}

function RootRedirect() {
  return <Navigate to={isMobileBrowser() ? "/mobile" : "/desktop"} replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/desktop" element={<DesktopTerminal />} />
        <Route path="/mobile" element={<MobileTerminal />} />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </Router>
  );
}
