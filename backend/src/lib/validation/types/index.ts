export type ValidationIssue = {
    property: string | number;
    message: string;
};

export type SchemaResult<T> = { success: true; data: T } | { success: false; issues: ValidationIssue[] };
