// pages/customers.js

import { QueryDataFromSupabase } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";

function CustomerPage() {
  let qStr = 'SELECT * FROM "Customer" LIMIT 5;';
  const x = useQuery({ queryKey: ["customers"], queryFn: QueryDataFromSupabase(qStr, "sqlRows") });

  console.log("Fetching customers from Supabase:", customers);

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
