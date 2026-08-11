import { useEffect, useState } from "react";
import api from "../services/api";

function DeadStock({ filters }) {

  const [data, setData] = useState([]);

  useEffect(() => {

    api
      .get("/dashboard/dead-stock", {
        params: filters,
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(
          "Dead Stock Error:",
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
        Dead Stock Products
      </h2>

      {data.length === 0 ? (

        <p>
          No dead stock products found.
        </p>

      ) : (

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                }}
              >
                Product
              </th>

              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                }}
              >
                Last Sale Date
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index}>

                <td
                  style={{
                    padding: "10px",
                  }}
                >
                  {item.item_name}
                </td>

                <td
                  style={{
                    padding: "10px",
                  }}
                >
                  {item.last_sale}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      )}
    </div>
  );
}

export default DeadStock;