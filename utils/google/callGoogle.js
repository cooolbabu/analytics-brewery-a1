"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
const fs = require("fs");
const path = require("path");

const apiKey = process.env.GEMINI_API_KEY;
const client = new GoogleGenerativeAI(apiKey); // Think about changing genAIClient

/**
 * Calls the OpenAI API to generate text based on the provided model and prompt.
 * @param {string} modelName - The name of the OpenAI model to use.
 * @param {string} persona - The persona to use for text generation.
 * @param {string} promptMessage - The prompt message to use for text generation.
 * @returns {Promise<string|null>} - A promise that resolves to the generated text or null if an error occurs.
 */
export async function callGemini(modelName, persona, instructions, promptMessage) {
  // console.log("callMistral.js-callMistral: ", modelName, " - ", persona, " - ", instructions, " - ", promptMessage);

  if (modelName === "Models" || modelName === null) {
    return "Please select a Model";
  }

  switch (persona) {
    case "ChinookAssistant":
    case "SQLAssistant":
      return await GenerateChatResponse({
        modelName,
        persona,
        promptTemplate: instructions,
        promptQuery: promptMessage,
      });
    default:
      return "Invalid persona selected";
  }
}

/**
 * Generates a chat response using the specified model.
 *
 * @param {string} modelName - The name of the model to use for generating the chat response.
 * @param {string} personaName - The persona for the chat response.
 * @param {string} promptTemplate - The instructions for the chat response.
 * @param {string} promptQuery - The prompt message for the chat response.
 * @returns {Promise<string>} The generated chat response.
 */

export async function GenerateChatResponse({ modelName, persona, promptTemplate, promptQuery }) {
  let personaContent = "";
  let chatResponse = "";

  try {
    const model = "gemini-pro";
    modelName = modelName.trim() || model; // set default model

    // TODO: Add conditions to load different personas
    switch (persona) {
      case "ChinookAssistant":
        console.log("Loading ChinookAssistant persona");
        const filePath = path.join("./", "assets", "ChinookDBER.txt");
        personaContent = fs.readFileSync(filePath, "utf-8");
        break;
      case "SQLAssistant":
        personaContent =
          " You are a SQL programmer who can write SQL code." +
          "You will be given the a message. The message will contain SQL code and explanations. You  convert explanations into comments and code as is." +
          "Your response will be a text that can be displayed in a editor.";
        break;
      default:
        personaContent = persona;
    }

    let chatMessage = promptTemplate + "\n" + personaContent + "\n" + promptQuery;

    console.log("\n\nCallGoogle Model: ", modelName);
    console.log("CallGoogle Chat message to Gemini: ", chatMessage);

    const geminiModel = client.getGenerativeModel({ model: "gemini-pro" });
    const response = await geminiModel.generateContent(chatMessage);
    console.log("Response from Gemini -------------------------------------\n", response);
    chatResponse = response.response.text();
  } catch (error) {
    console.log("callGoogle.js - GenerateChatResponse", error);
    chatResponse = "Unable to communicate with " + modelName + " model";
    console.log("Returning from generateChatResponse: ", chatResponse, error.message);
    return chatResponse;
  }

  chatResponse = chatResponse.replace(/^```json|```$/g, "");
  chatResponse = chatResponse.replace(/^```sql|```$/g, "");
  chatResponse = chatResponse.replace(/\\_/g, "_");
  try {
    if (isValidJSON(chatResponse)) {
      const jsonRespObject = JSON.parse(chatResponse);
      console.log("jsonRespObject-query:", jsonRespObject);
      console.log("jsonRespObject-query:", jsonRespObject.query);
      return jsonRespObject.query;
    } else {
      // console.log("Unable to parse this json object \n", chatResponseStr);
      return chatResponse;
    }
  } catch (error) {
    console.log(error);
    response = "Unable to parse response from " + modelName + " model";
    return response;
  }
}

export async function generateSQLResultsSummarization(modelName, persona, instructions, promptMessage) {
  try {
    console.log("callOpenAI.js-generateSQLResultsSummarization: ", instructions + "\n" + promptMessage);

    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: instructions },
        { role: "user", content: promptMessage },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0,
    });

    console.log(response.choices[0].message.content);
    //console.log(JSON.parse(response.choices[0].message.content).query);
    console.log("Returning from generateSQLResultsSummarization");
    return response.choices[0].message.content;
  } catch (error) {
    console.log(error);
  }

  return "Something went wrong";
}

async function callX1Assistant(query) {
  console.log("callX1Assistant: ", query);
  try {
    const x1_assistant = await openai.beta.assistants.retrieve(process.env.OPENAI_ASSISTANT_ID);
    const thread = await openai.beta.threads.create();
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: query,
    });
    const run = await openai.beta.threads.runs.create(thread.id, { assistant_id: x1_assistant.id });
    await new Promise((resolve) => setTimeout(resolve, 15000));
    const runResponse = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    const messages = await openai.beta.threads.messages.list(thread.id);
    console.log("Calling x1Assistant: ", run.id);
    console.log("Calling x2Assistant: ", runResponse);
    console.log("Calling x2Assistant: ", messages.data);
  } catch (error) {
    console.log(error.name, error.message);
    throw error;
  }
}

async function createThread() {
  try {
    return await openai.beta.threads.create();
  } catch (error) {
    console.log(error.name, error.message);
    throw error;
  }
}

async function getThread({ threadId }) {
  try {
    return await openai.beta.threads.retrieve(threadId);
  } catch (error) {
    console.log(error.name, error.message);
    //throw error
    return {
      error: true,
      message: error.message,
    };
  }
}

async function deleteThread({ threadId }) {
  try {
    return await openai.beta.threads.del(threadId);
  } catch (error) {
    console.log(error.name, error.message);
    //throw error
    return {
      error: true,
      message: error.message,
    };
  }
}

function isValidJSON(str) {
  try {
    // Try parsing the string as JSON
    JSON.parse(str);
    // If parsing succeeds, return true
    return true;
  } catch (e) {
    // If parsing fails (throws an error), return false
    return false;
  }
}
