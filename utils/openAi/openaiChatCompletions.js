import OpenAI from "openai";
import { extractAllSQL } from "../baseUtitls";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to create a timeout promise
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Request timed out after " + ms + " milliseconds"));
    }, ms);
  });
}

async function fetchCompletions(modelName, persona, instructions, promptMessage) {
  console.log(
    "fetchCompletions(opeaai): modelName: ",
    instructions + "\n" + persona + "\n" + "\n" + promptMessage + "\n" + modelName
  );
  try {
    const response = await Promise.race([
      openai.chat.completions.create({
        messages: [
          { role: "system", content: instructions + "\n" + persona },
          { role: "user", content: promptMessage },
        ],
        model: modelName,
        temperature: 0,
      }),
      timeout(60000), // 60,000 milliseconds = 60 seconds
    ]);

    console.log("API response received:", response.choices[0].message.content);
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
export async function performOpenAIChatTask(modelName, persona, instructions, promptMessage) {
  console.log("Performing performOpenAIChatTask task...");
  try {
    const response = await fetchCompletions(modelName, persona, instructions, promptMessage);
    console.log("Result:", response);
    console.log("Result:", response.choices[0].message.content);

    // Massage the response
    let chatResponseStr = response.choices[0].message.content;
    chatResponseStr = extractAllSQL(chatResponseStr);
    console.log("chatResponseStr: \n", chatResponseStr);

    // Remove unnecessary escape characters before underscores
    // chatResponseStr = chatResponseStr.replace(/^```json|```$/g, "");
    // chatResponseStr = chatResponseStr.replace(/^```sql|```$/g, "");
    // chatResponseStr = chatResponseStr.replace(/\\_/g, "_");

    console.log("Returning from generateChatResponse");
    return chatResponseStr;
  } catch (error) {
    console.log("Failed to fetch completions from OpenAI.\n:", error.message);
    return "Failed to fetch completions from OpenAI.\n:", error.message;
  }
}
