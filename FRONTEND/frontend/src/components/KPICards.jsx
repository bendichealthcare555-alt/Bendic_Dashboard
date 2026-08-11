import { useEffect, useState } from "react";
import api from "../services/api";

function KPICards({ filters }) {
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    api
      .get("/dashboard/kpis", {
        params: filters,
      })
      .then((response) => {
        console.log(response.data);
        setKpis(response.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, [filters]);

  if (!kpis) {
    return (
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        Loading KPI Data...
      </div>
    );
  }

  const cards = [
    {
      title: "Total Sales",
      value: kpis.total_sales,
    },
    {
      title: "Avg Monthly Sales",
      value: kpis.avg_monthly_sales,
    },
    {
      title: "Avg Bill Value",
      value: kpis.avg_bill_value,
    },
    {
      title: "Total Qty Sold",
      value: kpis.total_qty_sold,
    },
    {
      title: "Total Products",
      value: kpis.total_products,
    },
    {
      title: "Total Customers",
      value: kpis.total_customers,
    },
    {
      title: "Total Bills",
      value: kpis.total_bills,
    },
    {
      title: "Margin %",
      value: kpis.margin_percent,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: "15px",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              color: "#666",
              fontSize: "14px",
            }}
          >
            {card.title}
          </div>

          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KPICards;
