import { useEffect, useState } from "react";
import api from "../services/api";

function Filters({ filters, setFilters }) {

  const [options, setOptions] = useState({
    states: [],
    districts: [],
    salesmen: [],
    parties: [],
    products: [],
    Months: [],
    from_date: "",
    to_date: "",
  });

  useEffect(() => {

    api
      .get("/dashboard/filters")
      .then((response) => {
        setOptions(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

  }, []);

  const handleChange = (e) => {

    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });

  };

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px",
        display: "flex",
        gap: "15px",
        flexWrap: "wrap",
      }}
    >

      {/* State */}

      <select
        name="state"
        value={filters.state}
        onChange={handleChange}
      >
        <option value="">
          All States
        </option>

        {options.states.map((state) => (
          <option
            key={state}
            value={state}
          >
            {state}
          </option>
        ))}
      </select>

      {/* District */}

      <select
        name="district"
        value={filters.district}
        onChange={handleChange}
      >
        <option value="">
          All Districts
        </option>

        {options.districts.map((district) => (
          <option
            key={district}
            value={district}
          >
            {district}
          </option>
        ))}
      </select>

      {/* Salesman */}

      <select
        name="salesman"
        value={filters.salesman}
        onChange={handleChange}
      >
        <option value="">
          All Salesmen
        </option>

        {options.salesmen.map((salesman) => (
          <option
            key={salesman}
            value={salesman}
          >
            {salesman}
          </option>
        ))}
      </select>

      {/* Party */}

      <select
        name="party"
        value={filters.party}
        onChange={handleChange}
      >
        <option value="">
          All Customers
        </option>

        {options.parties.map((party) => (
          <option
            key={party}
            value={party}
          >
            {party}
          </option>
        ))}
      </select>

      {/* Product */}

      <select
        name="product"
        value={filters.product}
        onChange={handleChange}
      >
        <option value="">
          All Products
        </option>

        {options.products.map((product) => (
          <option
            key={product}
            value={product}
          >
            {product}
          </option>
        ))}
      </select>
      <select
        name="month"
        value={filters.month}
        onChange={handleChange}
      >
        <option value="">
          All Months
        </option>

        <option value="2026-05">
          May 2026
        </option>

        <option value="2026-06">
          June 2026
        </option>

      </select>
      <input
        type="date"
        name="from_date"
        value={filters.from_date}
        onChange={handleChange}
      />

      <input
        type="date"
        name="to_date"
        value={filters.to_date}
        onChange={handleChange}
      />

    </div>
  );
}

export default Filters;