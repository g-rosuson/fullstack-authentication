interface DbCollectionConfig {
    name: string;
    targetField: string;
    targetValue: number;
    unique: boolean;
}

interface DbConfig {
    db: {
        name: string;
        uri: string;
        collection: Record<string, DbCollectionConfig>;
    };
}

export type { DbConfig, DbCollectionConfig };
