import JobsChTarget from './jobs-ch';

/**
 * Target registry.
 */
const targetRegistry = {
    jobsCh: new JobsChTarget(),
} as const;

export default targetRegistry;
