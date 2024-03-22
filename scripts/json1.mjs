const modelsList = {
  providers: [
    {
      name: "OpenAI",
      models: [
        "gpt-4-0125-preview",
        "gpt-4-1106-preview",
        "gpt-3.5-turbo-0125",
        "gpt-3.5-turbo-1106",
      ],
    },
    {
      name: "Anthropic",
      models: [
        "claude-3-opus-20240229",
        "claude-3-sonnet-20240229",
        "claude-3-haiku-20240307",
      ],
    },
    {
      name: "IBM",
      models: [
        "granite-13b-chat",
        "granite-13b-instruct",
        "codellama-34b-instruct",
        "mixtral-8x7b-instruct",
        "starcoder-15.5b",
      ],
    },
  ],
};

/**
 * Represents a list of models grouped by providers.
 * @typedef {Object} ModelsList
 * @property {Array} providers - An array of provider objects.
 */

/**
 * Represents a provider object.
 * @typedef {Object} Provider
 * @property {string} name - The name of the provider.
 * @property {Array} models - An array of models offered by the provider.
 */

/**
 * Retrieves the list of models offered by a specific provider.
 * @param {ModelsList} modelsList - The list of models grouped by providers.
 * @param {string} providerName - The name of the provider.
 * @returns {Array} - An array of models offered by the specified provider. Returns an empty array if the provider is not found.
 */
function listModelsByProvider(modelsList, providerName) {
  const providers = modelsList.providers;
  const provider = providers.find((provider) => provider.name === providerName);
  if (provider) {
    return provider.models;
  } else {
    return [];
  }
}

const providerName = "OpenAI";
const models = listModelsByProvider(modelsList, providerName);
console.log("Models for OpenAI ", models);

/**
 * Retrieves the list of providers from the models list.
 * @param {ModelsList} modelsList - The list of models grouped by providers.
 * @returns {Array} - An array of provider names.
 */
function listProviders(modelsList) {
  return modelsList.providers.map((provider) => provider.name);
}

const providers = listProviders(modelsList);
console.log("Providers: ", providers);
