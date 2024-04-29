// hashModule.test.js
import { calculateHashes } from "./hashModule";

describe("Hash Module Tests", () => {
  test("It should correctly compute the hash values for headers and data", () => {
    const sqlResults = [
      { id: 1, name: "Alice", age: 25 },
      { id: 2, name: "Bob", age: 30 },
    ];
    const { headersHash, dataHash } = calculateHashes(sqlResults);

    expect(headersHash).toBeDefined();
    expect(dataHash).toBeDefined();
    expect(headersHash).toBe("a9b9f04336ce0181a08e774e01113b31c06d62f4865f013b92c8d4f3595b167d");
    expect(dataHash).toBe("5f9684a5eb845d4fa5dcb3dce6f9fd8f8e443f221fa58cf8b98944f8b44d42fa");
  });
});
