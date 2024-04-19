"use server";
import OpenAI from "openai";
import formatter from "prettier";
import prisma from "./db";
import { callOpenAI, generateSQLResultsSummarization } from "./callOpenAI";
import {
  supabaseClientPool,
  displayEnvironmentVariables,
  QueryDataFromSupabase,
  InsertRowSupabase,
} from "@/utils/dbutils/db_supabase";
import { callMistral } from "./mistral/callMistral";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getCustomerInformation() {
  try {
    //await new Promise((resolve) => setTimeout(resolve, 3000)); // Add a 3-second delay

    const client = supabaseClientPool;
    //console.log("getCustomerInformation: client", client);
    const sqlResult = await client.query(
      'SELECT "CustomerId", "FirstName", "LastName", "City", "State", "Country" FROM "Customer" LIMIT 3'
    );
    console.log("getCustomerInformation: sqlResult.rows ", sqlResult.rows);
    const jsonObject = JSON.stringify(sqlResult.rows);
    console.log("getCustomerInformation: jsonObject", jsonObject);
    return sqlResult.rows;
  } catch (error) {
    console.log(error);
    return { error: "getCustomerInformation()::Something went wrong" };
  }
}

/**
 * Simple Hello message from the server. Prints .env variables in console logs.
 * @param {Object} message
 * @returns
 */
export async function sayHello(message) {
  console.log("actions.js -sayHello: Message from client: ", message);
  console.log(process.env.DB_USER);
  console.log(process.env.DB_HOST);
  console.log(process.env.DB_NAME);
  return "Hello from the server";
}

/**
 * Generates a prompt response.
 *
 * @param {Object} message - The message to be logged.
 * @returns {Promise<string>} The response message from the server.
 */
export async function generatePromptResponse(message) {
  // console.log("Hello from the server: ", message);
  console.log("actions.js-generatePromptResponse: Provider: ", message.provider);
  console.log("actions.js-generatePromptResponse: Model: ", message.model);
  console.log("actions.js-generatePromptResponse: Persona: ", message.persona);
  console.log("actions.js-generatePromptResponse: Instructions: ", message.instructions);
  console.log("actions.js-generatePromptResponse: Query: ", message.query);
  console.log("actions.js-generatePromptResponse: MaxTokens: ", message.maxTokens);

  // callOpenAI fucntion from callOpenAI.js
  let response = "";
  if (message.provider === "OpenAI") {
    response = await callOpenAI(message.model, message.persona, message.instructions, message.query);
  } else if (message.provider === "Mistral") {
    response = await callMistral(message.model, message.persona, message.instructions, message.query);
  }

  console.log("actions.js-generatePromptResponse: ", response);
  return response;
}

/**
 * Saves the results of a prompt query.
 *
 * @param {any} results - The results of the prompt query.
 * @returns {Promise<void>} - A promise that resolves when the results are saved.
 */
export async function savePromptQueryResults(results) {
  console.log("actions.js-savePromptQueryResults: ", results);
  const queryStr =
    "INSERT INTO ab_user_prompts (user_id, provider, model, persona, prompt_msg) VALUES ($1, $2, $3, $4, $5)";
  const values = [results.userId, results.provider, results.model, results.persona, results.promptQuery];
  InsertRowSupabase(queryStr, values);
}
/**
 * A router function that calls appropriate functions to execute queries.
 *
 * @param {Object} messages
 * @param {String} sqlQuery
 * @returns {Promise<string>} queryResults - The response message from the server.
 * QueryDataFromSupabase
 */
export async function executeQueries(message) {
  console.log("actions.js-executeQueries: Persona: ", message.persona);
  console.log("actions.js-executeQueries: SQL Query: ", message.sqlStatement);

  try {
    //await new Promise((resolve) => setTimeout(resolve, 3000)); // Add a 3-second delay

    // const client = supabaseClientPool;
    //console.log("getCustomerInformation: client", client);
    const queryResults = await QueryDataFromSupabase(message.sqlStatement, "sqlRows");

    console.log("executeQueries: sqlResult ", queryResults);
    return queryResults;
  } catch (error) {
    console.log(error);
    return { error: "executeQueries()::Something went wrong" };
  }
}

export async function getAllABPrompts() {
  const sqlStatement = "SELECT * FROM ab_user_prompts LIMIT 25";
  // console.log("actions.js-executeQuery: SQL Query: ", sqlStatement);

  try {
    //await new Promise((resolve) => setTimeout(resolve, 3000)); // Add a 3-second delay
    const queryResult = await QueryDataFromSupabase(sqlStatement, "sqlRows");
    // console.log("getAllABPrompts: sqlResult ", queryResult);

    return queryResult;
  } catch (error) {
    console.log(error);
    return { error: "getAllABPrompts()::Something went wrong" };
  }
}

export async function getABPromptsById(id) {
  const sqlStatement = "SELECT prompt_id, user_id, provider, model, persona, prompt_msg FROM ab_user_prompts LIMIT 25";
  console.log("actions.js-getABPromptsById: SQL Query: ", sqlStatement);

  try {
    //await new Promise((resolve) => setTimeout(resolve, 3000)); // Add a 3-second delay

    const queryResult = await QueryDataFromSupabase(message.sqlStatement, "sqlRows");
    console.log("getAllABPrompts: sqlResult ", queryResult);

    return queryResult;
  } catch (error) {
    console.log(error);
    return { error: "getABPromptsById()::Something went wrong" };
  }
}

/**
 * A function that accepts data object. The object conatians, initial prompt request, SQL query and SQL
 * results. Gen AI takes these inputs and generates a response.
 *
 * @param {Object} message
 * @returns {String} resultSummary - The response message from the server.
 */
export async function executeQuerySummarization(message) {
  console.log("actions.js-executeQuerySummarization: message: ", message);

  let instructions = `You are a Business Analyst. You are given a question and the data to answer the question. 
  Question is: { ${message.query} }
  Data is: { ${message.sqlResults} }  
  You must understand the question. Review the data. 
  Review your analysis to ensure it is accurate.
  Provide a summary of your analysis.`;

  let response = await generateSQLResultsSummarization(
    message.model,
    "",
    instructions,
    message.query + "\n" + message.sqlResults
  );

  console.log("actions.js-executeQuerySummarization: ", response);
  return response;
}

// Use Chat history
//
export const generateChatResponse = async (chatMessages) => {
  console.log("[actions.js] Chatmessages: ", chatMessages);

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: "you are a helpful assistant" }, ...chatMessages],
      model: "gpt-3.5-turbo",
      temperature: 0,
    });

    console.log(response.choices[0].message);
    console.log("Returning from generateChatResponse");
    return response.choices[0].message;
  } catch (error) {
    return null;
  }
};

export async function generateTourResponse({ city, country }) {
  console.log("generateTourResponse invoked", city, country);

  const query = `Find a exact ${city} in this exact ${country}.
    If ${city} and ${country} exist, create a list of things families can do in this ${city},${country}. 
    Once you have a list, create a one-day tour. Response should be  in the following JSON format: 
    {
      "tour": {
        "city": "${city}",
        "country": "${country}",
        "title": "title of the tour",
        "description": "short description of the city and tour",
        "stops": ["short paragraph on the stop 1 ", "short paragraph on the stop 2","short paragraph on the stop 3"]
      }
    }
    "stops" property should include only three stops.
    If you can't find info on exact ${city}, or ${city} does not exist, or it's population is less than 1, 
    or it is not located in the following ${country},   return { "tour": null }, with no additional characters.`;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a tour guide" },
        { role: "user", content: query },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.8,
    });
    const tourData = JSON.parse(response.choices[0].message.content);
    if (!tourData.tour) {
      return null;
    }
    return tourData.tour;
  } catch (error) {
    console.log(error);
    return null;
  }
  return null;
}

// // This does not save Chat History
// //
// export const generateChatResponse = async (chatMessage) => {
//   console.log("[actions.js] Chatmessage: ", chatMessage);

//   const response = await openai.chat.completions.create({
//     messages: [
//       { role: "system", content: "you are a helpful assistant" },
//       { role: "user", content: chatMessage },
//     ],
//     model: "gpt-3.5-turbo",
//     temperature: 0,
//   });

//   console.log(response.choices[0].message);
//   console.log("Returning from generateChatResponse");
//   return "awesome";
// };
