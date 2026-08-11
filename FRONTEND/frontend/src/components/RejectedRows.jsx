import { useEffect, useState } from "react";
import api from "../services/api";

function RejectedRows({ batchId }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!batchId) {
      setRows([]);
      return;
    }

    setLoading(true);

    api
      .get(`/upload/cleaning-log/${batchId}`)
      .then((res) => {
        setRows(res.data);
      })
      .catch((err) => {
        console.error("Rejected Rows Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [batchId]);

  if (!batchId) return null;

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        marginTop: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2>
        Rejected Rows ({rows.length})
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : rows.length === 0 ? (
        <p>No rejected rows found.</p>
      ) : (
        <div
          style={{
            maxHeight: "500px",
            overflowY: "auto",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                background: "#f3f4f6",
              }}
            >
              <tr>
                <th style={{ padding: "10px" }}>Party</th>
                <th style={{ padding: "10px" }}>Product</th>
                <th style={{ padding: "10px" }}>Bill No</th>
                <th style={{ padding: "10px" }}>Batch</th>
                <th style={{ padding: "10px" }}>Reason</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td style={{ padding: "10px" }}>
                    {row.party_name}
                  </td>

                  <td style={{ padding: "10px" }}>
                    {row.item_name}
                  </td>

                  <td style={{ padding: "10px" }}>
                    {row.bill_no}
                  </td>

                  <td style={{ padding: "10px" }}>
                    {row.batch}
                  </td>

                  <td
                    style={{
                      padding: "10px",
                      color: "#dc2626",
                      fontWeight: "bold",
                    }}
                  >
                    {row.reason}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}

export default RejectedRows;