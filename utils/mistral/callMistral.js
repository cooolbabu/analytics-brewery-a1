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
  console.log("callMistral.js-callMistral: ", modelName, " - ", persona, " - ", instructions, " - ", promptMessage);
  if (modelName === "Models" || modelName === null) {
    return "Please select a Model";
  } else if (persona === "Personas" || persona === null) {
    return "Please select a persona";
  } else if (persona === "ChinookAssistant") {
    // console.log(
    //   "Mistral service invoked: " + modelName + " - " + persona + " - " + instructions + " - " + promptMessage
    // );
    return await GenerateChatResponse(modelName, persona, instructions, promptMessage);
  }
}

async function loadPersonaAndGenerateChatResponse(modelName, persona, instructions, promptMessage) {
  let response = "Soemthing went wrong";
  let chatResponse = null;
  try {
    const filePath = path.join("./", "assets", "ChinookDBER.txt");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    // console.log("callOpenAI.js-loadPersonaAndGenerateChatResponse: ", instructions + "\n" + fileContent);

    const model = "mistral-small-latest";
    // const model = "open-mixtral-8x7b";

    // chatResponse = await client.chat({
    //   messages: [
    //     { role: "system", content: instructions + "\n" + fileContent },
    //     { role: "user", content: promptMessage },
    //   ],
    //   model: modelName,
    //   temperature: 0,
    // });
  } catch (error) {
    console.log(error);
    response = "Unable to communicate with " + modelName + " model";
    return response;
  }

  // // console.log(response.choices[0].message.content);
  // // const cleanedJsonString = response.choices[0].message.content.trim().replace(/^```json|```$/g, "");
  // // console.log("cleanedJsonString: ", cleanedJsonString);
  // // const responseStr = JSON.parse(cleanedJsonString).query;
  // // console.log("responseStr: ", responseStr);
  // // //console.log(JSON.parse(response.choices[0].message.content).query);
  // // console.log("Returning from generateChatResponse");

  try {
    if (isValidJSON(chatResponse.choices[0].message.content)) {
      const jsonRespObject = JSON.parse(chatResponse.choices[0].message.content);
      console.log("jsonRespObject-query:", jsonRespObject);
      console.log("jsonRespObject-query:", jsonRespObject.query);
      return jsonRespObject.query;
    } else {
      console.log("Unable to parse this json object \n", chatResponse.choices[0].message.content);
      return chatResponse.choices[0].message.content;
    }
  } catch (error) {
    console.log(error);
    response = "Unable to parse response from " + modelName + " model";
    return response;
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
  let chatResponse = "";

  try {
    const model = "mistral-medium-latest";
    modelName = modelName.trim() || model; // set default model

    const filePath = path.join("./", "assets", "ChinookDBER.txt");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    let chatMessage = promptTemplate + "\n" + fileContent + "\n" + promptQuery;
    console.log("\n\nChat message to Mistral: ", chatMessage);
    chatResponse = await client.chat({
      messages: [{ role: "user", content: chatMessage }],
      model: modelName,
      temperature: 0,
    });
  } catch (error) {
    //console.log("callMistral.js - GenerateChatResponse", error);
    response = "Unable to communicate with " + modelName + " model";
    console.log("Returning from generateChatResponse: ", response);
    return response;
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
  console.log("chatResponseStr: \n", chatResponseStr);

  // Remove unnecessary escape characters before underscores
  chatResponseStr = chatResponseStr.replace(/^```json|```$/g, "");
  chatResponseStr = chatResponseStr.replace(/\\_/g, "_");
  try {
    if (isValidJSON(chatResponseStr)) {
      const jsonRespObject = JSON.parse(chatResponseStr);
      console.log("jsonRespObject-query:", jsonRespObject);
      console.log("jsonRespObject-query:", jsonRespObject.query);
      return jsonRespObject.query;
    } else {
      console.log("Unable to parse this json object \n", chatResponseStr);
      return chatResponseStr;
    }
  } catch (error) {
    console.log(error);
    response = "Unable to parse response from " + modelName + " model";
    return response;
  }
}

//
export async function callMistralx(modelName, persona, instructions, promptMessage) {
  console.log("callOpenAI.js-callOpenAI: ", modelName, " - ", persona, " - ", instructions, " - ", promptMessage);
  if (persona === "Personas" || persona === null) {
    console.log("callOpenAI.js-callOpenAI: ", modelName, " - ", persona, " - ", promptMessage);
  } else if (persona === "ChinookAssistant") {
    return await loadPersonaAndGenerateChatResponse(modelName, persona, instructions, promptMessage);
  } else if (modelName === "x1Assistant") {
    return await callX1Assistant(promptMessage);
  } else
    try {
      const response = await openai.chat.completions.create({
        messages: [{ role: "system", content: promptMessage }],
        model: modelName,
        temperature: 0,
      });

      console.log(response.choices[0].message);
      console.log("Returning from generateChatResponse");
      return response.choices[0].message;
    } catch (error) {
      return null;
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
