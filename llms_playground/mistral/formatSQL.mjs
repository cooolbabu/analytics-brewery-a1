import MistralClient from "@mistralai/mistralai";

const instructions = ` You will be give SQL code. Your response will be in json format following this schema.
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "code": {
        "type": "string",
        "description": "Properly formatted SQL code"
      },
      "summary": {
        "type": "string",
        "description": "A brief summary of the SQL code. If you cannot infer the SQL code, please write 'Cannot infer SQL code'"
      }
    },
    "required": ["code", "summary"]
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
      content: instructions + "select count(*) from customer;",
    },
  ],
});

console.log("Chat:", chatResponse.choices[0].message.content);
console.log("Chat:", chatResponse);
