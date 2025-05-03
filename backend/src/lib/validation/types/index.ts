type Issue = {
    property: string | number;
    message: string;
};

type SchemaResult<T> = { success: true; data: T } | { success: false; issues: Issue[] };

export type { SchemaResult, Issue };
