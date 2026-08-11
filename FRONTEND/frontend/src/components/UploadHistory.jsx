import { useEffect, useState } from "react";
import api from "../services/api";

function UploadHistory({ setSelectedBatch }) {

  const [history, setHistory] = useState([]);

  useEffect(() => {
    api
      .get("/upload/history")
      .then((res) => setHistory(res.data))
      .catch(console.error);
  }, []);

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <h2>Upload History</h2>

      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>File Name</th>
              <th>Total</th>
              <th>Inserted</th>
              <th>Rejected</th>
              <th>Data Period</th>
              <th>Uploaded At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {history.map((row) => (
              <tr key={row.id}>
                <td>{row.upload_batch_id}</td>

                <td>{row.file_name}</td>

                <td>{row.total_rows}</td>

                <td>{row.inserted_rows}</td>

                <td>{row.rejected_rows}</td>

                <td>
                  {row.from_bill_date || "-"}
                  {" → "}
                  {row.to_bill_date || "-"}
                </td>

                <td>{row.uploaded_at}</td>

                <td>
                  {row.rejected_rows > 0 && (
                    <button
                      onClick={() =>
                        setSelectedBatch(
                          row.upload_batch_id
                        )
                      }
                      style={{
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      View Rejected Rows
                    </button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default UploadHistory;