async function UserVendorModelsStatus({ userProfile }) {
  console.log("UserVendorModelsStatus: ", userProfile);
  const { emailId, dateRegistered, tokensAvailabilty } = userProfile;
  // console.log(
  //   "UserVendorModelsStatus: ",
  //   emailId,
  //   dateRegistered,
  //   tokensAvailabilty
  // );

  if (!tokensAvailabilty || tokensAvailabilty === "") {
    return <p>No Tokens available</p>;
  }

  const data = JSON.parse(tokensAvailabilty);

  return (
    <div className="p-5 max-w-md">
      {data.vendors.map((vendor, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{vendor.vendor}</h2>
          <table className="min-w-full table-auto border-collapse border border-slate-200">
            <thead className="text-black">
              <tr>
                <th className="border border-slate-500 bg-slate-300 p-2 w-48">Model</th>
                {/* <th className="border border-slate-300 bg-slate-200 p-2">
                  Tokens Available
                </th> */}
                <th className="border border-slate-500 bg-slate-300 p-2 w-24">Tokens Used</th>
              </tr>
            </thead>
            <tbody>
              {vendor.models.map((model, modelIndex) => (
                <tr key={modelIndex} className="text-center">
                  <td className="border border-slate-300 p-2">{model.LLMmodel}</td>
                  {/* <td className="border border-slate-300 p-2">
                    {model.tokens_available.toLocaleString()}
                  </td> */}
                  <td className="border border-slate-300 p-2">{model.tokens_used.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default UserVendorModelsStatus;
