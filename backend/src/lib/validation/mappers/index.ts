import { ZodError } from 'zod';

/**
 * Formats Zod validation errors into a simplified array of property/message pairs.
 *
 * If the schema has nested properties like { user: { name: '...' } },
 * the "path" array will show the path to the field that caused the error, e.g., ['user', 'name'].
 * Because of this, we use the last element in the path array to identify the specific property,
 * along with the corresponding error message.
 */
const mapToErrors = (zodError: ZodError) => {
    return zodError.errors.map(error => ({
        property: error.path[error.path.length - 1],
        message: error.message,
    }));
};

const mappers = {
    mapToErrors,
};

export default mappers;
