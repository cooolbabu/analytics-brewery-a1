import { PrismaClient } from "@prisma/client";

const tokensAvailabiltyData2 = JSON.stringify({
  vendors: [
    {
      vendor: "OpenAI",
      models: [
        {
          LLMmodel: "gpt-4-0125-preview",
          tokens_available: 500000,
          tokens_used: 18990,
        },
        {
          LLMmodel: "gpt-4-1106-preview",
          tokens_available: 700000,
          tokens_used: 9712,
        },
        {
          LLMmodel: "gpt-3.5-turbo-0125",
          tokens_available: 5600000,
          tokens_used: 33128,
        },
        {
          LLMmodel: "gpt-3.5-turbo-1106",
          tokens_available: 500000,
          tokens_used: 44012,
        },
      ],
    },
    {
      vendor: "Anthropic",
      models: [
        {
          LLMmodel: "claude-3-opus-20240229",
          tokens_available: 500000,
          tokens_used: 61023,
        },
        {
          LLMmodel: "claude-3-sonnet-20240229",
          tokens_available: 700000,
          tokens_used: 8709,
        },
        {
          LLMmodel: "claude-3-haiku-20240307",
          tokens_available: 900000,
          tokens_used: 9103,
        },
      ],
    },
    {
      vendor: "IBM",
      models: [
        {
          LLMmodel: "granite-13b-chat",
          tokens_available: 2000000,
          tokens_used: 4891,
        },
        {
          LLMmodel: "granite-13b-instruct",
          tokens_available: 1200000,
          tokens_used: 9876,
        },
        {
          LLMmodel: "codellama-34b-instruct",
          tokens_available: 1500000,
          tokens_used: 54321,
        },
        {
          LLMmodel: "mixtral-8x7b-instruct",
          tokens_available: 800000,
          tokens_used: 4334,
        },
        {
          LLMmodel: "starcoder-15.5b ",
          tokens_available: 800000,
          tokens_used: 0,
        },
      ],
    },
  ],
});

const db = new PrismaClient();

const user2 = await db.userProfile.create({
  data: {
    emailId: "cooolbabu@gmail.com",
    firstName: "Sreenivas",
    lastName: "Angara",
    currentTokenCount: 0,
    tokensAvailable: 31000,
    tokensAddedHistory: "",
    tokensAvailabilty: tokensAvailabiltyData2,
  },
});

console.log(user2);
