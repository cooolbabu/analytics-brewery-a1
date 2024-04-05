// pages/customers.js
"use client";

import { useEffect, useState } from "react";

function CustomerPage() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/pages/api/customer.js");
      const data = await res.json();
      setCustomers(data);
    }

    fetchData();
  }, []);

  console.log("Fetching customers:", customers);

  return (
    <div>
      <h1>Customer Info</h1>
      {customers.map((customer, index) => (
        <div key={index}>
          {/* Display customer info here */}
          <p>{customer.name}</p>
          {/* Add more customer details as needed */}
        </div>
      ))}
    </div>
  );
}

export default CustomerPage;
