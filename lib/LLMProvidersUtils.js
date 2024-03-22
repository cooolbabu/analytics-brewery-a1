"use client";

/**
 * Retrieves the list of models offered by a specific provider.
 * @param {ModelsList} modelsList - The list of models grouped by providers.
 * @param {string} providerName - The name of the provider.
 * @returns {Array} - An array of models offered by the specified provider. Returns an empty array if the provider is not found.
 */
export function listModelsByProvider(modelsList, providerName) {
  const providers = modelsList.providers;
  const provider = providers.find((provider) => provider.name === providerName);
  if (provider) {
    return provider.models;
  } else {
    return [];
  }
}
