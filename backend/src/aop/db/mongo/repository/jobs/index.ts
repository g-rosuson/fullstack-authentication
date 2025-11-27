import { ClientSession, Db, ObjectId } from 'mongodb';

import { ResourceNotFoundException, SchemaValidationException } from 'aop/exceptions';
import { DatabaseOperationFailedException } from 'aop/exceptions/errors/database';
import { parseSchema } from 'lib/validation';

import config from '../../config';

import { ErrorMessage } from 'shared/enums/error-messages';

import type { CreateJobPayload, UpdateJobPayload } from './types';

import { jobDocumentSchema } from './schemas';

/**
 * JobRepository encapsulates persistence logic for job execution records.
 */
class JobRepository {
    private readonly db: Db;
    private readonly collectionName: string;

    constructor(db: Db) {
        this.db = db;
        this.collectionName = config.db.collection.jobs.name;
    }

    /**
     * Persists a new job execution record.
     * @param payload Job data to store
     * @param session Optional Mongo session for transactional contexts
     * @returns The created job document
     */
    async create(payload: CreateJobPayload, session?: ClientSession) {
        const insertResult = await this.db.collection(this.collectionName).insertOne(payload, { session });

        if (!insertResult.acknowledged) {
            throw new DatabaseOperationFailedException(ErrorMessage.DATABASE_OPERATION_FAILED_ERROR);
        }

        return {
            id: insertResult.insertedId.toString(),
            ...payload,
        };
    }

    /**
     * Updates an existing cron job document by ID.
     *
     * @param id The cron job ID to update
     * @param updatedCronJob Partial cron job data to update
     * @returns Promise resolving to MongoDB's UpdateResult
     * @throws ResourceNotFoundException if cron job not found
     */
    async update(payload: UpdateJobPayload, session?: ClientSession) {
        const { id, ...payloadFields } = payload;

        const updateResult = await this.db.collection(this.collectionName).findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: payloadFields },
            {
                returnDocument: 'after',
                ...(session ? { session } : {}),
            }
        );

        if (!updateResult) {
            throw new ResourceNotFoundException(ErrorMessage.JOBS_NOT_FOUND_IN_DATABASE);
        }

        const schemaResult = parseSchema(jobDocumentSchema, updateResult);

        if (!schemaResult.success) {
            throw new SchemaValidationException(ErrorMessage.SCHEMA_VALIDATION_FAILED, { issues: schemaResult.issues });
        }

        return {
            id: schemaResult.data._id.toString(),
            ...schemaResult.data,
        };
    }

    /**
     * Deletes a job document by ID.
     *
     * @param id The job ID to delete
     * @returns Promise resolving to MongoDB's DeleteResult
     * @throws ResourceNotFoundException if job not found
     */
    async delete(id: string, session?: ClientSession) {
        const result = await this.db
            .collection(this.collectionName)
            .deleteOne({ _id: new ObjectId(id) }, { ...(session ? { session } : {}) });

        if (result.deletedCount === 0) {
            throw new ResourceNotFoundException(ErrorMessage.JOBS_NOT_FOUND_IN_DATABASE);
        }

        return result;
    }

    /**
     * Retrieves a job document by ID.
     *
     * @param id The job ID to search for
     * @returns Promise resolving to the job document if found
     * @throws ResourceNotFoundException if job not found
     */
    async getById(id: string) {
        const jobDocument = await this.db.collection(this.collectionName).findOne({ _id: new ObjectId(id) });

        if (!jobDocument) {
            throw new ResourceNotFoundException(ErrorMessage.JOBS_NOT_FOUND_IN_DATABASE);
        }

        const result = parseSchema(jobDocumentSchema, jobDocument);

        if (!result.success) {
            throw new SchemaValidationException(ErrorMessage.SCHEMA_VALIDATION_FAILED, { issues: result.issues });
        }

        return result.data;
    }

    /**
     * Retrieves all jobs with pagination.
     *
     * @param limit Maximum number of jobs to return
     * @param offset Number of jobs to skip
     * @returns Promise resolving to array of job documents
     */
    async getAll(limit: number, offset: number) {
        const jobDocuments = await this.db.collection(this.collectionName).find().skip(offset).limit(limit).toArray();

        return jobDocuments.map(doc => {
            const result = parseSchema(jobDocumentSchema, doc);

            if (!result.success) {
                throw new SchemaValidationException(ErrorMessage.SCHEMA_VALIDATION_FAILED, { issues: result.issues });
            }

            return result.data;
        });
    }
}

export { JobRepository };
