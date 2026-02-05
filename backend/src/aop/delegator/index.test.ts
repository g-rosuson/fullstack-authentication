import { beforeEach, describe, expect, it, vi } from 'vitest';

import { logger } from 'aop/logging';

import { Delegator } from './index';
import toolRegistry from './tools';

vi.mock('aop/logging');

vi.mock('./tools', () => ({
    default: {
        scraper: {
            execute: vi.fn(async ({ onTargetFinish }) => {
                onTargetFinish({
                    targetId: 'target-1',
                    results: [{ data: 'scraped content' }],
                });
            }),
        },
    },
}));

vi.mock('aop/db/mongo/client', () => ({
    MongoClientManager: {
        getInstance: vi.fn(() => ({
            connect: vi.fn().mockResolvedValue({}),
            startSession: vi.fn(),
        })),
    },
}));

const mockAddExecution = vi.fn();
vi.mock('aop/db/mongo/context', () => ({
    DbContext: vi.fn().mockImplementation(() => ({
        repository: { jobs: { addExecution: mockAddExecution } },
    })),
}));

const jobId = 'test-job-id';
const tool = {
    type: 'scraper' as const,
    keywords: [],
    maxPages: 1,
    targets: [{ id: 'target-1', target: 'jobs-ch' as const }],
};
const targetWithResults = {
    id: 'target-1',
    target: 'jobs-ch' as const,
    results: [{ data: 'scraped content' }],
};
const payloadWithTool = {
    jobId,
    name: 'Test Job',
    tools: [tool],
    scheduleType: null,
};
const payloadWithoutTool = {
    jobId,
    name: 'Test Job',
    tools: [],
    scheduleType: null,
};

describe('Delegator', () => {
    let delegator: Delegator;
    let persistResultSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset the singleton instance for isolated tests
        // @ts-expect-error - accessing private static property for testing
        Delegator.instance = null;

        delegator = Delegator.getInstance();

        // eslint-disable-next-line
        persistResultSpy = vi.spyOn(delegator as any, 'persistResult').mockResolvedValue(undefined);
    });

    describe('getInstance', () => {
        it('should return the same instance on multiple calls', () => {
            const firstInstance = Delegator.getInstance();
            const secondInstance = Delegator.getInstance();

            expect(firstInstance).toBe(secondInstance);
        });
    });

    describe('register', () => {
        it('should register a job to the pendingJobs map', () => {
            delegator.register(payloadWithoutTool);
            expect(delegator.pendingJobs.has(jobId)).toBe(true);
            expect(delegator.pendingJobs.get(jobId)).toEqual(payloadWithoutTool);
        });
    });

    describe('delegateScheduledJob', () => {
        it('should delegate a scheduled job', () => {
            delegator.register(payloadWithoutTool);
            delegator.delegateScheduledJob(jobId);
            expect(delegator.pendingJobs.has(jobId)).toBe(true);
        });

        it('should log an error if the job is not found', () => {
            const delegateSpy = vi.spyOn(delegator, 'delegate');
            delegator.delegateScheduledJob(jobId);
            expect(delegateSpy).not.toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalled();
        });
    });

    describe('delegate', () => {
        it('should add the job to runningJobs map during execution and remove it afterwards', async () => {
            let wasInRunningJobs = false;

            // Mock toolRegistry to capture state during execution
            vi.mocked(toolRegistry.scraper.execute).mockImplementationOnce(async () => {
                // Add to runningJobs before "finally" block
                wasInRunningJobs = delegator.runningJobs.has(jobId);
            });

            await delegator.delegate(payloadWithTool);

            expect(wasInRunningJobs).toBe(true);
            expect(delegator.runningJobs.has(jobId)).toBe(false);
            expect(delegator.pendingJobs.has(jobId)).toBe(false);
        });

        it('should persist the execution payload', async () => {
            await delegator.delegate(payloadWithTool);

            const executionPayload = {
                jobId,
                schedule: {
                    type: null,
                    delegatedAt: new Date(),
                    finishedAt: new Date(),
                },
                tools: [
                    {
                        type: 'scraper' as const,
                        keywords: [],
                        maxPages: 1,
                        targets: [targetWithResults],
                    },
                ],
            };

            expect(persistResultSpy).toHaveBeenCalledWith(executionPayload);
        });
    });

    describe('getToolTargetsWithResults', () => {
        it('should return tool targets with mapped results', async () => {
            const result = await delegator['getToolTargetsWithResults'](tool);

            expect(result).toEqual([targetWithResults]);
        });

        it('should log an error if the tool target is not found', async () => {
            const toolWithInvalidTarget = {
                type: 'scraper' as const,
                keywords: [],
                maxPages: 1,
                targets: [{ id: 'target-33', target: 'jobs-ch' as const }],
            };

            const result = await delegator['getToolTargetsWithResults'](toolWithInvalidTarget);
            expect(result).toEqual([]);
            expect(logger.error).toHaveBeenCalled();
        });
    });

    describe('persistResult', () => {
        beforeEach(() => {
            persistResultSpy.mockRestore();
        });

        it('should save to database', async () => {
            await delegator['persistResult']({
                jobId,
                schedule: { type: null, delegatedAt: new Date(), finishedAt: new Date() },
                tools: [],
            });

            expect(mockAddExecution).toHaveBeenCalled();
            expect(logger.info).toHaveBeenCalled();
        });
    });
});
