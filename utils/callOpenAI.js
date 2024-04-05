"use server";

import OpenAI from "openai";
const fs = require("fs");
const path = require("path");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Calls the OpenAI API to generate text based on the provided model and prompt.
 * @param {string} modelName - The name of the OpenAI model to use.
 * @param {string} persona - The persona to use for text generation.
 * @param {string} promptMessage - The prompt message to use for text generation.
 * @returns {Promise<string|null>} - A promise that resolves to the generated text or null if an error occurs.
 */
export async function callOpenAI(modelName, persona, instructions, promptMessage) {
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
async function loadPersonaAndGenerateChatResponse(modelName, persona, instructions, promptMessage) {
  try {
    const filePath = path.join("./", "assets", "ChinookDBER.txt");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    //console.log("callOpenAI.js-loadPersonaAndChatResponse: ", instructions + "\n" + fileContent);

    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: instructions + "\n" + fileContent },
        { role: "user", content: promptMessage },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0,
    });

    console.log(response.choices[0].message.content);
    const cleanedJsonString = response.choices[0].message.content.trim().replace(/^```|```$/g, "");
    console.log("cleanedJsonString: ", cleanedJsonString);
    const responseStr = JSON.parse(cleanedJsonString).query;
    console.log("responseStr: ", responseStr);
    //console.log(JSON.parse(response.choices[0].message.content).query);
    console.log("Returning from generateChatResponse");
    return responseStr;
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
