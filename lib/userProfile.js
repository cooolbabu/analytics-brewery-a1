import { db } from "./db";

/**
 * Retrieves the user profile based on the provided emailId.
 * @param {string} emailId - The emailId of the user.
 * @returns {Promise<Array>} - A promise that resolves to an array of user profiles.
 */
export async function getUserProfile(emailId) {
  //console.log("Calling DB getUserProfile for: ", emailId);
  return await db.userProfile.findMany({
    where: {
      emailId: emailId,
    },
  });
}

/**
 * Retrieves the list of provider models.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the list of provider models.
 */
export async function getProviderModels() {
  const modelsList = {
    providers: [
      {
        name: "Mistral",
        models: ["mistral-large-latest", "mistral-medium-latest", "mistral-small-latest"],
      },
      {
        name: "OpenAI",
        models: ["gpt-4-0125-preview", "gpt-4-1106-preview", "gpt-3.5-turbo-0125", "gpt-3.5-turbo-1106", "x1Assistant"],
      },
      {
        name: "Anthropic",
        models: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
      },
      {
        name: "IBM",
        models: [
          "granite-13b-chat",
          "granite-13b-instruct",
          "codellama-34b-instruct",
          "mixtral-8x7b-instruct",
          "starcoder-15.5b",
        ],
      },
    ],
    personas: [
      {
        assistant: "ChinookAssistant",
        sourceDB: "Chinook",
        instructions:
          "As a Data Architect, you will be asked to provide SQL queries. " +
          "Your queries must confirm to provided ER diagram. " +
          "Table and column names must be from the ER diagram. Maintain case-sensitiveness. " +
          "Table names and column names must be enclosed in double quotes. " +
          "Database dialect is PostgreSQL. " +
          "If unable to provide a query, inform the user. " +
          "Your response should be JSON with the key 'query'. " +
          "Use code formatting to provide the JSON string without the enclosing backticks. ",
        // Provide the JSON string without the enclosing backticks",
      },
      { assistant: "WorldwideImporters", sourceDB: "Chinook", instructions: "Dataarchitect" },
      { assistant: "NorthwindTraders", sourceDB: "Chinook", instructions: "Dataarchitect" },
      { assistant: "AdventureWorks", sourceDB: "Chinook", instructions: "Dataarchitect" },
    ],
  };
  return modelsList;
}

export default getUserProfile;
