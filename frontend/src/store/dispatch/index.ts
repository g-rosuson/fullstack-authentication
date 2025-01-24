import reducerModules from '../reducers';

export const resources = (actionType: string) => {
    // Retrieve domain and reducer-type from the action-type
    const resources = actionType.split('/');
    const [domain, reducerType] = resources;

    // The "actionType" parameter will always contain an existing reducer "domain" and
    // "reducerType", since actions are created dynamically from the reducer modules.
    // Therefore "domain" can be safely asserted as the keys of "reducerModules"
    type Domain = keyof typeof reducerModules;
    const typedDomain = domain as Domain

    // Retrieve reducer array with "domain"
    const reducerArray = reducerModules[typedDomain];

     // Retrieve reducer with the "reducerType" 
    const reducer = reducerArray.find((reducer) => reducer.type === reducerType);

    if (!reducer) {
        throw new Error(`[STORE]: Could not find reducer: "${reducerType}" in domain: "${domain}".`);
    }

    return { domain: typedDomain, reducer };
};