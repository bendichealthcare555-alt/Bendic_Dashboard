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
  Legend,
} from "recharts";

function CustomerRetention({ filters }) {

  const [data, setData] = useState([]);

  useEffect(() => {

    api
      .get("/dashboard/customer-retention", {
        params: filters,
      })
      .then((response) => {

        const grouped = {};

        response.data.forEach((row) => {

          if (!grouped[row.month]) {

            grouped[row.month] = {
              month: row.month,
              new_customers: 0,
              repeat_customers: 0,
            };

          }

          if (row.customer_type === true) {

            grouped[row.month].new_customers =
              row.count;

          } else {

            grouped[row.month].repeat_customers =
              row.count;

          }

        });

        setData(
          Object.values(grouped)
        );

      })
      .catch((error) => {

        console.error(
          "Customer Retention Error:",
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
        New vs Repeat Customers
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="new_customers"
            name="New Customers"
            stroke="#2563eb"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="repeat_customers"
            name="Repeat Customers"
            stroke="#10b981"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default CustomerRetention;