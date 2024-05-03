import MistralClient from "@mistralai/mistralai";
import { QueryDataFromSupabase } from "../dbutils/db_supabase";
import { extractAllSQL } from "../baseUtitls";

const apiKey = process.env.MISTRAL_API_KEY;
const client = new MistralClient(apiKey);

// Function to create a timeout promise
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Request timed out after " + ms + " milliseconds"));
    }, ms);
  });
}

async function fetchMistralCompletions(modelName, persona, instructions, promptMessage) {
  try {
    const response = await Promise.race([
      client.chat({
        messages: [{ role: "user", content: instructions + "\n" + persona + "\n" + promptMessage }],
        model: modelName,
        temperature: 0,
      }),
      timeout(60000), // 60,000 milliseconds = 60 seconds
    ]);

    console.log("Mistral - API response received:", response.choices[0].message.content);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error if needed, or handle it according to your error handling policy
  }
}

// Usage example, wrap calls in an async context if not inside an async function already
/**
 * Performs a task by fetching completions from OpenAI API.
 *
 * @param {string} instructions - The instructions for the task.
 * @param {string} fileContent - The content of the file.
 * @param {string} promptMessage - The prompt message for the task.
 * @param {string} modelName - The name of the model to use for completions.
 * @returns {Promise<void>} - A promise that resolves when the task is completed.
 */
export async function performMistralChatTask(modelName, persona, instructions, promptMessage) {
  console.log("Performing performMistralChatTask task...");
  try {
    const response = await fetchMistralCompletions(modelName, persona, instructions, promptMessage);
    console.log("Result:", response);
    console.log("Result:", response.choices[0].message.content);

    // Massage the response
    let chatResponseStr = response.choices[0].message.content;
    console.log("chatResponseStr: \n", chatResponseStr);
    // chatResponseStr = await GenerateBrewCraftersResponseMistral({ promptQuery: chatResponseStr });
    chatResponseStr = extractAllSQL(chatResponseStr);

    // Remove unnecessary escape characters before underscores
    // chatResponseStr = chatResponseStr.replace(/^```json|```$/g, "");
    // chatResponseStr = chatResponseStr.replace(/^```sql|```$/g, "");
    // chatResponseStr = chatResponseStr.replace(/\\_/g, "_");

    console.log("Returning from performMistralChatTask...", chatResponseStr);
    return chatResponseStr;
  } catch (error) {
    console.log("Failed to fetch completions from Mistral.\n", error.message);
    return "Failed to fetch completions from Mistral:\n\t" + error.message;
  }
}

/**
 * Using Mistral small model to extract SQL and comments from a given message.
 *
 * @param {string} promptMessage - The prompt message to generate chat response.
 * @returns {Promise<string>} The generated chat response.
 */

export async function GenerateBrewCraftersResponseMistral({ promptMessage }) {
  let instructions = "";

  const modelName = "mistral-small-latest";
  // console.log("SQLAssistant persona selected - ", modelName);

  try {
    instructions = `
        You are a SQL programmer who can write SQL code. You will given a message that may or may not contain SQL code with explanations.
        If the message does not contain any SQL code, return the message as is.
        If the message contains SQL code, then seperated the SQL code and explanations.
        Summarize the explanations as comments. Return SQL code.
        Important: Your repsonse should contain only SQL code and comments that can be executed in a SQL environment.      
        `;

    // console.log("\n\nModel: ", modelName);
    // console.log("Chat message to Mistral: ", chatMessage);
    const response = await fetchMistralCompletions(modelName, " ", instructions, promptMessage);
    console.log("Result:", response);
    console.log("Result:", response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.log("callMistral.js - GenerateBrewCraftersResponseMistral", error);
    return "Returning from GenerateBrewCraftersResponseMistral:\n " + error.message;
  }

  // // console.log(response.choices[0].message.content);
  // // const cleanedJsonString = response.choices[0].message.content.trim().replace(/^```json|```$/g, "");
  // // console.log("cleanedJsonString: ", cleanedJsonString);
  // // const responseStr = JSON.parse(cleanedJsonString).query;
  // // console.log("responseStr: ", responseStr);
  // // //console.log(JSON.parse(response.choices[0].message.content).query);
  // // console.log("Returning from generateChatResponse");

  // console.log("Response from Mistral -------------------------------------\n", chatResponse.choices[0].message.content);
  let chatResponseStr = chatResponse.choices[0].message.content;
  // console.log("call Mistral.js-chatResponseStr: \n", chatResponseStr);

  return chatResponseStr;
}
