"use client";

export default function CustomerInfoComponent({ customers }) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>City</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.CustomerId}>
              <td>{customer.CustomerId}</td>
              <td>
                {customer.FirstName} {customer.LastName}
              </td>
              <td>{customer.Email}</td>
              <td>{customer.Phone}</td>
              <td>{customer.Address}</td>
              <td>{customer.City}</td>
              <td>{customer.Country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
