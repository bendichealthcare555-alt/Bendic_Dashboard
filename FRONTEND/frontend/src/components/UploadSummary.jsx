import { useEffect, useState } from "react";
import api from "../services/api";

function UploadSummary() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/upload/history").then((res) => {
      if (res.data.length > 0) {
        setData(res.data[0]);
      }
    });
  }, []);

  if (!data) return null;

  const successRate = (
    (data.inserted_rows / data.total_rows) *
    100
  ).toFixed(2);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: "15px",
        marginBottom: "20px",
      }}
    >
      <Card title="Total Rows" value={data.total_rows} />
      <Card title="Inserted Rows" value={data.inserted_rows} />
      <Card title="Rejected Rows" value={data.rejected_rows} />
      <Card title="Success %" value={`${successRate}%`} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <div>{title}</div>
      <h2>{value}</h2>
    </div>
  );
}

export default UploadSummary;