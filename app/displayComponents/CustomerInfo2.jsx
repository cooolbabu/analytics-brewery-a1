"use client";
import { useState } from "react";

export default function CustomerInfoComponent({ customers }) {
  let headers = [];

  console.log("CustomerInfoComponent: Value of customers: \n", customers);
  console.log("CustomerInfoComponent: No of customers: \n", customers.length);

  if (customers.length > 0) {
    console.log("CustomerInfoComponent: Table headers are: ", Object.keys(customers[0]));
    headers = Object.keys(customers[0]);
    console.log("CustomerInfoComponent: Other headers are: ", headers);
  }

  return (
    <>
      <div className="overflow-x-auto">
        {customers.length > 0 ? (
          <table className="table table-xs">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.CustomerId}>
                  <td>{customer.CustomerId}</td>
                  <td>{customer.FirstName}</td>
                  <td>{customer.LastName}</td>
                  <td>{customer.City}</td>
                  <td>{customer.State}</td>
                  <td>{customer.Country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </>
  );
}
