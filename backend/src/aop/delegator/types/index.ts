/* eslint-disable no-unused-vars */
import { z } from 'zod';

import { emailToolSchema, scraperToolSchema, targetErrorSchema } from 'shared/schemas/jobs';

/**
 * A target error.
 */
type TargetError = z.infer<typeof targetErrorSchema>;

/**
 * A scraper tool.
 */
type ScraperTool = z.infer<typeof scraperToolSchema>;

/**
 * An email tool.
 */
type EmailTool = z.infer<typeof emailToolSchema>;

/**
 * A union of all available tool types.
 */
type Tool = ScraperTool | EmailTool;

/**
 * Represents a task containing one or more tools to be executed.
 * A task groups related tool executions under a single job identifier.
 */
type Task = {
    jobId: string;
    name: string;
    tools: Tool[];
};

/**
 * Maps tool type keys to their corresponding tool implementations.
 * Used for type-safe tool resolution based on discriminated union types.
 */
type ToolMap = {
    scraper: ScraperTool;
    email: EmailTool;
};

/**
 * Configuration map for executing each tool type.
 * Each tool type has its own configuration structure that matches its specific requirements.
 */
type ExecuteConfigMap = {
    scraper: { id: string; target: string; keywords?: string[]; maxPages?: number };
    email: { id: string; target: string; subject?: string; body?: string };
};

/**
 * Result map defining the structure of execution results for each tool type.
 * Each result includes output data, metadata, error information, and a timestamp.
 */
type ToolResultMap = {
    scraper: {
        output: object;
        targetId: string;
        target: string;
        keywords: string[];
        maxPages: number;
        error: { message: string; targetId: string } | null;
        timestamp: number;
    };
    email: {
        output: object;
        targetId: string;
        target: string;
        subject: string;
        body: string;
        error: { message: string; targetId: string } | null;
        timestamp: number;
    };
};

/**
 * Registry structure mapping each tool type to its execution function.
 * Used to dynamically resolve and execute the appropriate tool handler.
 */
type ToolRegistry = {
    [Key in keyof ToolMap]: {
        execute: ExecuteFunction<Key>;
    };
};

/**
 * Union type of all available tool type keys.
 * Currently: 'scraper' | 'email'
 */
type ToolType = keyof ToolMap;

/**
 * Function signature for executing a tool of a specific type.
 *
 * @template T - The tool type key (e.g., 'scraper' | 'email')
 * @param tool - The tool instance to execute, typed as ToolMap[T]
 * @param config - The execution configuration, typed as ExecuteConfigMap[T]
 * @returns A promise resolving to the tool's result, typed as ToolResultMap[T]
 */
type ExecuteFunction<T extends ToolType> = ({
    tool,
    config,
}: {
    tool: ToolMap[T];
    config: ExecuteConfigMap[T];
}) => Promise<ToolResultMap[T]>;

export type { ExecuteFunction, ToolResultMap, ToolType, ToolRegistry, ToolMap, Task, TargetError };
