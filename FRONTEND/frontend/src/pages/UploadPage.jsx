import { useState } from "react";

import FileUpload from "../components/FileUpload";
import UploadSummary from "../components/UploadSummary";
import UploadHistory from "../components/UploadHistory";
import RejectedRows from "../components/RejectedRows";

function UploadPage() {

  const [selectedBatch, setSelectedBatch] =
    useState(null);

  return (
    <div
      style={{
        padding: "20px",
        background: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <h1>Upload Center</h1>

      <FileUpload />

      <UploadSummary />

      <UploadHistory
        setSelectedBatch={setSelectedBatch}
      />

      <RejectedRows
        batchId={selectedBatch}
      />

    </div>
  );
}

export default UploadPage;