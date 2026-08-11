import { useState } from "react";

import Filters from "../components/Filters";

import KPICards from "../components/KPICards";
import SalesTrend from "../components/SalesTrend";
import StateWiseSales from "../components/StateWiseSales";
import TopCustomers from "../components/TopCustomers";
import TopProducts from "../components/TopProducts";
import SalesmanPerformance from "../components/SalesmanPerformance";
import MonthlyGrowth from "../components/MonthlyGrowth";
import SlowMovingProducts from "../components/SlowMovingProducts";
import DeadStock from "../components/DeadStock";
import CustomerRetention from "../components/CustomerRetention";

function DashboardPage() {

  const [filters, setFilters] = useState({
    state: "",
    district: "",
    salesman: "",
    party: "",
    product: "",

    month: "",
    from_date: "",
    to_date: "",
  });

  return (
    <div
      style={{
        padding: "20px",
        background: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <h1>
        Pharma Sales Analytics Dashboard
      </h1>

      <Filters
        filters={filters}
        setFilters={setFilters}
      />

      <KPICards filters={filters} />

      <SalesTrend filters={filters} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <StateWiseSales filters={filters} />
        <TopCustomers filters={filters} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <TopProducts filters={filters} />
        <SalesmanPerformance filters={filters} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <MonthlyGrowth filters={filters} />
        <CustomerRetention filters={filters} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <SlowMovingProducts filters={filters} />
        <DeadStock filters={filters} />
      </div>
    </div>
  );
}

export default DashboardPage;