"use server";

import MistralClient from "@mistralai/mistralai";
const fs = require("fs");
const path = require("path");

const apiKey = process.env.MISTRAL_API_KEY;
const client = new MistralClient(apiKey);

/**
 * Calls the OpenAI API to generate text based on the provided model and prompt.
 * @param {string} modelName - The name of the OpenAI model to use.
 * @param {string} persona - The persona to use for text generation.
 * @param {string} promptMessage - The prompt message to use for text generation.
 * @returns {Promise<string|null>} - A promise that resolves to the generated text or null if an error occurs.
 */
export async function callMistral(modelName, persona, instructions, promptMessage) {
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

  if (persona === "SQLAssistant") {
    modelName = "mistral-small-latest";
    // console.log("SQLAssistant persona selected - ", modelName);
  }

  try {
    const model = "mistral-medium-latest";
    modelName = modelName.trim() || model; // set default model

    // TODO: Add conditions to load different personas
    switch (persona) {
      case "ChinookAssistant":
        // console.log("Loading ChinookAssistant persona");
        const filePath = path.join("./", "assets", "ChinookDBER.txt");
        personaContent = fs.readFileSync(filePath, "utf-8");
        break;
      case "SQLAssistant":
        personaContent = `
        You are a SQL programmer who can write SQL code. You will given a message that may or may not contain SQL code with explanations.
        If the message does not contain any SQL code, return the message as is.
        If the message contains SQL code, then seperated the SQL code and explanations.
        Summarize the explanations as comments. Return comments and SQL code without explanations. 
        Important: Your repsonse should contain only SQL code and comments that can be executed in a SQL environment.      
        `;
        break;
      default:
        personaContent = persona;
    }

    let chatMessage = promptTemplate + "\n" + personaContent + "\n" + promptQuery;

    // console.log("\n\nModel: ", modelName);
    // console.log("Chat message to Mistral: ", chatMessage);
    chatResponse = await client.chat({
      messages: [{ role: "user", content: chatMessage }],
      model: modelName,
      temperature: 0,
    });
  } catch (error) {
    console.log("callMistral.js - GenerateChatResponse", error);
    chatResponse = "Unable to communicate with " + modelName + " model";
    console.log("Returning from generateChatResponse: ", chatResponse, error.message);
    return chatResponse;
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

  // Remove unnecessary escape characters before underscores
  chatResponseStr = extractAllSQL(chatResponseStr);
  // console.log("call Mistral.js-chatResponseStr: \n", chatResponseStr);
  chatResponseStr = chatResponseStr.replace(/^```json|```$/g, "");
  chatResponseStr = chatResponseStr.replace(/^```sql|```$/g, "");
  chatResponseStr = chatResponseStr.replace(/\\_/g, "_");
  try {
    if (isValidJSON(chatResponseStr)) {
      const jsonRespObject = JSON.parse(chatResponseStr);
      // console.log("jsonRespObject-query:", jsonRespObject);
      // console.log("jsonRespObject-query:", jsonRespObject.query);
      return jsonRespObject.query;
    } else {
      // console.log("Unable to parse this json object \n", chatResponseStr);
      // console.log("Returning from Mistral.js-chatResponseStr: \n", chatResponseStr);
      return chatResponseStr;
    }
  } catch (error) {
    console.log(error);
    response = "Unable to parse response from " + modelName + " model";
    return response;
  }
}

export async function generateSQLResultsSummarization(modelName, persona, instructions, promptMessage) {
  try {
    // console.log("callOpenAI.js-generateSQLResultsSummarization: ", instructions + "\n" + promptMessage);

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
    // console.log("Returning from generateSQLResultsSummarization");
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

function extractAllSQL(text) {
  const regex = /```sql\s*([\s\S]*?)\s*```/g;
  const matches = [...text.matchAll(regex)];
  if (matches.length === 0) {
    // No SQL blocks found, return original text
    return text;
  }
  // Concatenate all SQL codes into one big string
  const allSqlCombined = matches.map((match) => match[1]).join("\n");
  return allSqlCombined;
}
