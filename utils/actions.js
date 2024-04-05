"use server";
import OpenAI from "openai";
import pg from "pg";
import prisma from "./db";
import { callOpenAI } from "./callOpenAI";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432, // Default port for PostgreSQL
});

export async function getCustomerInformation() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Add a 10-second delay

    const client = await pool.connect();
    const result = await client.query('SELECT * FROM "Customer"');
    console.log(result.rows);
    client.release();
    return result.rows;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Say Hello from the server
export async function sayHello(message) {
  console.log("actions.js: Message from client: ", message);
  console.log(process.env.DB_USER);
  console.log(process.env.DB_HOST);
  console.log(process.env.DB_NAME);
  return "Hello from the server";
}

// Say Hello from the server
/**
 * Generates a prompt response for testCase1.
 *
 * @param {Object} message - The message to be logged.
 * @returns {Promise<string>} The response message from the server.
 */
export async function generatePromptResponseTestCase1(message) {
  // console.log("Hello from the server: ", message);
  console.log("actions.js-generatePromptResponseTestCase1: Provider: ", message.provider);
  console.log("actions.js-generatePromptResponseTestCase1: Model: ", message.model);
  console.log("actions.js-generatePromptResponseTestCase1: Persona: ", message.persona);
  console.log("actions.js-generatePromptResponseTestCase1: Instructions: ", message.instructions);
  console.log("actions.js-generatePromptResponseTestCase1: Query: ", message.query);
  console.log("actions.js-generatePromptResponseTestCase1: MaxTokens: ", message.maxTokens);

  // callOpenAI fucntion from callOpenAI.js
  let response = "";
  if (message.provider === "OpenAI") {
    response = await callOpenAI(message.model, message.persona, message.instructions, message.query);
  }
  // const response = await callOpenAI("gpt-3.5-turbo", message.query);
  console.log(response);
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

export async function getExistingTour({ city, country }) {
  console.log("getExistingTour invoked");
  return prisma.tour.findUnique({
    where: {
      city_country: {
        city,
        country,
      },
    },
  });
}

export async function createNewTour(tour) {
  console.log("createNewTour invoked");
  return prisma.tour.create({ data: tour });
}

export async function getAllTours(searchTerm) {
  console.log("getAllTours invoked");

  try {
    let whereCondition = {};
    if (searchTerm && searchTerm.trim() !== "") {
      whereCondition = {
        city: {
          contains: searchTerm,
        },
        country: {
          contains: searchTerm,
        },
      };
    }

    const tours = await prisma.tour.findMany({
      where: whereCondition,
      orderBy: {
        city: "asc",
      },
    });

    return tours;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getSingleTour(id) {
  console.log("getSingleTour invoked");

  try {
    const tour = await prisma.tour.findUnique({
      where: {
        id,
      },
    });

    return tour;
  } catch (error) {
    console.log(error);
    return null;
  }
}
