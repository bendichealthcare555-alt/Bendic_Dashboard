import { useEffect, useState } from "react";
import api from "../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function SlowMovingProducts({ filters }) {

  const [data, setData] = useState([]);

  useEffect(() => {

    api
      .get("/dashboard/slow-moving-products", {
        params: filters,
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(
          "Slow Moving Products Error:",
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
        Slow Moving Products
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="item_name"
            angle={-30}
            textAnchor="end"
            height={80}
          />

          <YAxis />

          <Tooltip
            formatter={(value) =>
              `₹ ${Number(value).toLocaleString(
                "en-IN"
              )}`
            }
          />

          <Bar
            dataKey="amount"
            fill="#f59e0b"
          />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default SlowMovingProducts;