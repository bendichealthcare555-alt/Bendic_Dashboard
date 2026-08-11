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

function MonthlyGrowth({ filters }) {

  const [data, setData] = useState([]);

  useEffect(() => {

    api
      .get("/dashboard/monthly-growth", {
        params: filters,
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(
          "Monthly Growth Error:",
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
        Monthly Growth %
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
              `${value}%`
            }
          />

          <Line
            type="monotone"
            dataKey="growth_percent"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 6 }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default MonthlyGrowth;