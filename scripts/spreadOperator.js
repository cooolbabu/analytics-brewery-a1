let customerHeader = ["CustomerId", "Name", "City", "State", "Country"];
const newHeader = ["email", "phone", "address", "zip", "city", "state", "country"];

const updatedHeader = [...customerHeader, ...newHeader];
console.log("Updated headers are: ", updatedHeader);
customerHeader = updatedHeader;
console.log("Customer headers are: ", customerHeader);
