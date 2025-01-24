import reducerDomains from '../reducers'

// Store actions: domain -> (reducer-type -> action-type)
const actionsMap = new Map<keyof typeof reducerDomains, Map<string, string>>();

// Map each reducer domain to corresponding reducer-types, mapped to action-types
for (const [domain, resources] of Object.entries(reducerDomains)) {
    // Map reducer-types to their corresponding action-types
    const resourceMap = new Map<string, string>();

    for (const resource of resources) {
        resourceMap.set(resource.type, `${domain}/${resource.type}`);
    }

    // Add the domain and its resourceMap to the actionsMap
    actionsMap.set(domain as keyof typeof reducerDomains, resourceMap);
}


type Actions = {
    [Domain in keyof typeof reducerDomains]: {
        // eslint-disable-next-line no-unused-vars
        [Resource in (typeof reducerDomains[Domain][number])['type']]: string;
    };
};

// Convert actionsMap to a plain object
const actions = Object.fromEntries(
    // 1: Convert actionsMap to an array of [domain, resourceMap]
    Array.from(actionsMap.entries()).map(([domain, resourceMap]) => [
        domain,
        // 2: Convert each resourceMap entry to a plain object
        Object.fromEntries(resourceMap)
    ])
) as Actions;

export default actions;
