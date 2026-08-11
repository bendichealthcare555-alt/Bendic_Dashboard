import { useEffect, useState } from "react";
import api from "../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function SalesTrend({ filters }) {

  const [data, setData] = useState([]);

  useEffect(() => {

    api
      .get("/dashboard/sales-trend", {
        params: filters,
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(
          "Sales Trend Error:",
          error
        );
      });

  }, [filters]);

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        Sales Trend
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip
            formatter={(value) =>
              `₹ ${Number(value).toLocaleString(
                "en-IN"
              )}`
            }
          />

          <Line
            type="monotone"
            dataKey="amount"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 8 }}
            activeDot={{ r: 10 }}
          />

        </LineChart>
      </ResponsiveContainer>

      {data.length === 1 && (
        <div
          style={{
            marginTop: "10px",
            color: "#666",
            fontSize: "14px",
          }}
        >
          Only one month of data available.
          Trend line will become visible
          when multiple months are uploaded.
        </div>
      )}

    </div>
  );
}

export default SalesTrend;