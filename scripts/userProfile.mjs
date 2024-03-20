import { PrismaClient } from "@prisma/client";

const tokensAvailabiltyData1 = JSON.stringify({
  vendors: [
    {
      vendor: "OpenAI",
      models: [
        {
          LLMmodel: "gpt-4-0125-preview",
          tokens_available: 1000000,
          tokens_used: 250000,
        },
        {
          LLMmodel: "gpt-4-1106-preview",
          tokens_available: 800000,
          tokens_used: 200000,
        },
        {
          LLMmodel: "gpt-3.5-turbo-0125",
          tokens_available: 600000,
          tokens_used: 150000,
        },
        {
          LLMmodel: "gpt-3.5-turbo-1106",
          tokens_available: 500000,
          tokens_used: 125000,
        },
      ],
    },
    {
      vendor: "Anthropic",
      models: [
        {
          LLMmodel: "claude-3-opus-20240229",
          tokens_available: 500000,
          tokens_used: 100000,
        },
        {
          LLMmodel: "claude-3-sonnet-20240229",
          tokens_available: 700000,
          tokens_used: 150000,
        },
        {
          LLMmodel: "claude-3-haiku-20240307",
          tokens_available: 900000,
          tokens_used: 300000,
        },
      ],
    },
    {
      vendor: "IBM",
      models: [
        {
          LLMmodel: "granite-13b-chat",
          tokens_available: 2000000,
          tokens_used: 500000,
        },
        {
          LLMmodel: "granite-13b-instruct",
          tokens_available: 1200000,
          tokens_used: 300000,
        },
        {
          LLMmodel: "codellama-34b-instruct",
          tokens_available: 1500000,
          tokens_used: 450000,
        },
        {
          LLMmodel: "mixtral-8x7b-instruct",
          tokens_available: 800000,
          tokens_used: 200000,
        },
        {
          LLMmodel: "starcoder-15.5b ",
          tokens_available: 800000,
          tokens_used: 200000,
        },
      ],
    },
  ],
});

const tokensAvailabiltyData2 = JSON.stringify({
  vendors: [
    {
      vendor: "OpenAI",
      models: [
        {
          LLMmodel: "gpt-4-0125-preview",
          tokens_available: 500000,
          tokens_used: 34000,
        },
        {
          LLMmodel: "gpt-4-1106-preview",
          tokens_available: 700000,
          tokens_used: 180000,
        },
        {
          LLMmodel: "gpt-3.5-turbo-0125",
          tokens_available: 5600000,
          tokens_used: 950000,
        },
        {
          LLMmodel: "gpt-3.5-turbo-1106",
          tokens_available: 500000,
          tokens_used: 125000,
        },
      ],
    },
    {
      vendor: "Anthropic",
      models: [
        {
          LLMmodel: "claude-3-opus-20240229",
          tokens_available: 500000,
          tokens_used: 100000,
        },
        {
          LLMmodel: "claude-3-sonnet-20240229",
          tokens_available: 700000,
          tokens_used: 150000,
        },
        {
          LLMmodel: "claude-3-haiku-20240307",
          tokens_available: 900000,
          tokens_used: 300000,
        },
      ],
    },
    {
      vendor: "IBM",
      models: [
        {
          LLMmodel: "granite-13b-chat",
          tokens_available: 2000000,
          tokens_used: 500000,
        },
        {
          LLMmodel: "granite-13b-instruct",
          tokens_available: 1200000,
          tokens_used: 300000,
        },
        {
          LLMmodel: "codellama-34b-instruct",
          tokens_available: 1500000,
          tokens_used: 450000,
        },
        {
          LLMmodel: "mixtral-8x7b-instruct",
          tokens_available: 800000,
          tokens_used: 200000,
        },
        {
          LLMmodel: "starcoder-15.5b ",
          tokens_available: 800000,
          tokens_used: 200000,
        },
      ],
    },
  ],
});

const db = new PrismaClient();

await db.userProfile.deleteMany({
  where: {
    emailId: "cooolbabu@gmail.com",
  },
});

const user1 = await db.userProfile.create({
  data: {
    emailId: "cooolbabu@gmail.com",
    firstName: "Sreenivas",
    lastName: "Angara",
    currentTokenCount: 0,
    tokensAvailable: 25000,
    tokensAddedHistory: "",
    tokensAvailabilty: tokensAvailabiltyData1,
  },
});

const user2 = await db.userProfile.create({
  data: {
    emailId: "sreenivas.angara@gmail.com",
    firstName: "Sreenivas",
    lastName: "Angara",
    currentTokenCount: 0,
    tokensAvailable: 25000,
    tokensAddedHistory: "",
    tokensAvailabilty: tokensAvailabiltyData2,
  },
});

console.log(user1, user2);
