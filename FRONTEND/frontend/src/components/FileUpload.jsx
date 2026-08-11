import { useState } from "react";
import api from "../services/api";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post(
        "/upload/sales",
        formData
      );

      setMessage(
        response.data.message ||
          "Upload completed successfully"
      );

      setFile(null);

      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error(error);
      setMessage("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px",
      }}
    >
      <h2>Upload Sales File</h2>

      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      {file && (
        <p>
          Selected File: {file.name}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {loading
          ? "Uploading..."
          : "Upload Sales File"}
      </button>
      <div
        style={{
            marginTop: "20px",
            padding: "15px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "8px",
        }}
        >
        <strong>Upload Instructions</strong>

        <p>
            Excel file must contain the required sales columns.
            Missing columns may cause upload failure.
        </p>

        <p>
            Required:
            Party Name, Item Name, Bill No, Month, Date,   
            Batch, Quantity, Amount, Bill amount, Cost, Cost Amount, Salesman.
        </p>
        </div>  

      {message && (
        <p style={{ marginTop: "10px" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default FileUpload;