/* eslint-disable no-unused-vars */
import { z } from 'zod';

import { scheduleSchema, scraperResultSchema, scraperToolSchema } from 'shared/schemas/jobs';

/**
 * A scraper tool.
 */
type ScraperTool = z.infer<typeof scraperToolSchema>;

/**
 * A union of all available tool types.
 */
type Tool = ScraperTool;

/**
 * Represents a job containing one or more tools to be executed.
 */
interface Job {
    jobId: string;
    name: string;
    tools: Tool[];
    schedule: z.infer<typeof scheduleSchema> | null;
}

/**
 * Maps tool type keys to their corresponding tool implementations.
 * Used for type-safe tool resolution based on discriminated union types.
 */
type ToolMap = {
    scraper: ScraperTool;
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
 */
type ToolType = keyof ToolMap;

/**
 * A target result.
 */
type TargetResult = {
    targetId: string;
    results: z.infer<typeof scraperResultSchema>[] | null;
};

/**
 * A function to execute a tool.
 */
type ExecuteFunction<T extends ToolType> = ({
    tool,
    onTargetFinish,
}: {
    tool: ToolMap[T];
    onTargetFinish: (targetResult: TargetResult) => void;
}) => Promise<void>;

export type { ExecuteFunction, TargetResult, ToolType, ToolRegistry, ToolMap, Job };
