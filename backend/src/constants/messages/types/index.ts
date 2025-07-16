import loggerMessages from '../messages.logging';
import errorMessages from '../messages.response';

// All logger message strings (flattened)
type LogMessages = {
    [C in keyof typeof loggerMessages]: (typeof loggerMessages)[C][keyof (typeof loggerMessages)[C]];
}[keyof typeof loggerMessages];

// All error message strings
type ErrorMessages = (typeof errorMessages)[keyof typeof errorMessages];

// Union of all possible string messages
type Messages = LogMessages | ErrorMessages;

// Utility type to extract all placeholders from a message string
type ExtractPlaceholders<T extends string> = T extends `${string}{${infer Placeholder}}${infer Rest}`
    ? Placeholder | ExtractPlaceholders<Rest>
    : never;

// All placeholder keys
type PlaceholderKeys = ExtractPlaceholders<Messages>;

export { ErrorMessages, Messages, PlaceholderKeys };
