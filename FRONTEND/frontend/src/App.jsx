import { useState } from "react";

import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div>
      <div
        style={{
          background: "#111827",
          padding: "15px 20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={() => setActivePage("dashboard")}
          style={{
            background:
              activePage === "dashboard"
                ? "#2563eb"
                : "transparent",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Dashboard
        </button>

        <button
          onClick={() => setActivePage("upload")}
          style={{
            background:
              activePage === "upload"
                ? "#2563eb"
                : "transparent",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Upload Center
        </button>
      </div>

      {activePage === "dashboard" ? (
        <DashboardPage />
      ) : (
        <UploadPage />
      )}
    </div>
  );
}

export default App;