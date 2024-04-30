import { InsertRowSupabase, QueryDataFromSupabase } from "@/utils/dbutils/db_supabase";

/**
 * Retrieves the user profile based on the provided emailId.
 * @param {string} emailId - The emailId of the user.
 * @returns {Promise<Array>} - A promise that resolves to an array of user profiles.
 */
export async function getUserProfile(emailId, userId = null, firstName = null, lastName = null) {
  console.log("Calling DB getUserProfile for: ", emailId, userId, firstName, lastName);

  const sqlStatement = "SELECT * FROM ab_user_profile WHERE email_id = '" + emailId + "'";
  console.log("actions.js-executeQuery: SQL Query: ", sqlStatement);

  if (userId) {
    const queryStr = `INSERT INTO ab_user_profile 
        (clerk_user_id, email_id, first_name, last_name, current_token_count, tokens_available,
          tokens_availability, tokens_added_history) 
          VALUES ($1, $2, $3, $4, 8000, 8000, 8000, 'Starter set') ON CONFLICT (clerk_user_id) 
          DO NOTHING RETURNING 
          clerk_user_id, email_id, first_name, last_name, date_registered, current_token_count, tokens_available,
          tokens_availability, tokens_added_history;  `;
    const values = [userId, emailId, firstName, lastName];
    console.log("\n\nactions.js: Before InsertRowSupabase: ");
    const queryResult = await InsertRowSupabase(queryStr, values);
    console.log("\n\nactions.js: After InsertRowSupabase: ", queryResult);
    return queryResult;
  } else {
    try {
      //await new Promise((resolve) => setTimeout(resolve, 3000)); // Add a 3-second delay
      const queryResult = await QueryDataFromSupabase(sqlStatement, "sqlRows");
      console.log("getUserProfile: sqlResult ", queryResult);

      return queryResult;
    } catch (error) {
      console.log(error);
      return { error: "getAllABPrompts()::Something went wrong" };
    }
  }
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
        name: "Google",
        models: ["gemini-1.5-pro-latest", "gemini-pro"],
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
          "Your response must be SQL query in a Markdown code block, formatted using best practices and marked as SQL. " +
          "Very important: You must deliver SQL code that can be executed directly in a SQL Editor.",
        // "Your response should be JSON with the key 'query'. " +
        // "Use code formatting to provide the JSON string without the enclosing backticks. ",
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
