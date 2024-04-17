import MistralClient from "@mistralai/mistralai";

const instructions = ` You will be asked questions about food items. Your response will be in json format following this schema.
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "product": {
        "type": "string"
      },
      "characteristics": {
        "type": "string"
      },
      "produce location": {
        "type": "string"
      }
    },
    "required": ["product", "characteristics", "produce location"]
  }
`;

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);
const model = "mistral-small-latest";
// const model = "open-mixtral-8x7b";

const chatResponse = await client.chat({
  model: model,
  response_format: { type: "json_object" },
  messages: [
    {
      role: "user",
      system: instructions,
      content: instructions + "Give me 5 types of tomato from different countries.",
    },
  ],
});

console.log("Chat:", chatResponse.choices[0].message.content);
console.log("Chat:", chatResponse);
