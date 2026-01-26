/**
 * Converts a kebab-case string to camelCase.
 *
 * @param str - The kebab-case string to convert (e.g., 'jobs-ch')
 * @returns The camelCase version of the string (e.g., 'jobsCh')
 *
 * @example
 * kebabToCamelCase('jobs-ch') // returns 'jobsCh'
 * kebabToCamelCase('my-target') // returns 'myTarget'
 */
const kebabToCamelCase = (str: string): string => {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

export { kebabToCamelCase };
