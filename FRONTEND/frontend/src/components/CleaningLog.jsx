import { useEffect, useState } from "react";
import api from "../services/api";

function CleaningLog() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api
      .get("/upload/cleaning-log")
      .then((res) => {
        setRows(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
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
      <h2>Rejected Rows / Cleaning Log</h2>

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
              <th>Party</th>
              <th>Product</th>
              <th>Bill No</th>
              <th>Batch</th>
              <th>Reason</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.party_name}</td>
                <td>{row.item_name}</td>
                <td>{row.bill_no}</td>
                <td>{row.batch}</td>
                <td>{row.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CleaningLog;