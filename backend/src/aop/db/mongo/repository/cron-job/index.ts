import { Db, ObjectId } from 'mongodb';

import { ResourceNotFoundException, SchemaValidationException } from 'aop/exceptions';
import { DatabaseOperationFailedException } from 'aop/exceptions/errors/database';
import { parseSchema } from 'lib/validation';

import config from '../../config';

import { ErrorMessage } from 'shared/enums/error-messages';

import type { CreateCronJobPayload, UpdateCronJobPayload } from './types';

import { cronJobDocumentSchema } from 'shared/schemas/db/documents/cron-job';

/**
 * CronJobRepository encapsulates all cron job-related database operations.
 * This repository pattern provides a clean abstraction over MongoDB operations,
 * ensuring consistent data access patterns and enabling easy testing.
 *
 * Key features:
 * - Type-safe operations using cron job schemas
 * - Encapsulated collection access
 * - Domain-specific method names
 * - Centralized cron job data logic
 *
 * Usage: Access via DbContext.cronJob property
 * Example: await dbContext.cronJob.create({ name: 'Daily Backup', ... })
 */
export class CronJobRepository {
    private db: Db;
    private collectionName: string;

    /**
     * Constructs a new CronJobRepository instance.
     *
     * @param db MongoDB database instance to perform operations on
     */
    constructor(db: Db) {
        this.db = db;
        this.collectionName = config.db.collection.cronJobs.name;
    }

    /**
     * Creates a new cron job document in the database and returns it.
     *
     * @param cronJob Cron job object containing all required data
     * @returns Promise resolving to the created cron job document
     */
    async create(cronJob: CreateCronJobPayload) {
        const insertResult = await this.db.collection(this.collectionName).insertOne(cronJob);

        if (!insertResult.acknowledged) {
            throw new DatabaseOperationFailedException(ErrorMessage.DATABASE_OPERATION_FAILED_ERROR);
        }

        const createdDoc = {
            id: insertResult.insertedId.toString(),
            ...cronJob,
        };

        return createdDoc;
    }

    /**
     * Retrieves a cron job document by ID.
     *
     * @param id The cron job ID to search for
     * @returns Promise resolving to the cron job document if found
     * @throws ResourceNotFoundException if cron job not found
     */
    async getById(id: string) {
        const cronJobDocument = await this.db.collection(this.collectionName).findOne({ _id: new ObjectId(id) });

        if (!cronJobDocument) {
            throw new ResourceNotFoundException(ErrorMessage.CRON_JOB_NOT_FOUND_IN_DATABASE);
        }

        const result = parseSchema(cronJobDocumentSchema, cronJobDocument);

        if (!result.success) {
            throw new SchemaValidationException(ErrorMessage.SCHEMA_VALIDATION_FAILED, { issues: result.issues });
        }

        return result.data;
    }

    /**
     * Retrieves all cron jobs with pagination.
     *
     * @param limit Maximum number of cron jobs to return
     * @param offset Number of cron jobs to skip
     * @returns Promise resolving to array of cron job documents
     */
    async getAll(limit: number, offset: number) {
        const cronJobDocuments = await this.db
            .collection(this.collectionName)
            .find()
            .skip(offset)
            .limit(limit)
            .toArray();

        return cronJobDocuments.map(doc => {
            const result = parseSchema(cronJobDocumentSchema, doc);

            if (!result.success) {
                throw new SchemaValidationException(ErrorMessage.SCHEMA_VALIDATION_FAILED, { issues: result.issues });
            }

            return result.data;
        });
    }

    /**
     * Updates an existing cron job document by ID.
     *
     * @param id The cron job ID to update
     * @param updatedCronJob Partial cron job data to update
     * @returns Promise resolving to MongoDB's UpdateResult
     * @throws ResourceNotFoundException if cron job not found
     */
    async update(updatedCronJob: UpdateCronJobPayload) {
        const updateResult = await this.db
            .collection(this.collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(updatedCronJob.id) },
                { $set: updatedCronJob },
                { returnDocument: 'after' }
            );

        if (!updateResult?.value) {
            throw new ResourceNotFoundException(ErrorMessage.CRON_JOB_NOT_FOUND_IN_DATABASE);
        }

        const schemaResult = parseSchema(cronJobDocumentSchema, updateResult.value);

        if (!schemaResult.success) {
            throw new SchemaValidationException(ErrorMessage.SCHEMA_VALIDATION_FAILED, { issues: schemaResult.issues });
        }

        return schemaResult.data;
    }

    /**
     * Deletes a cron job document by ID.
     *
     * @param id The cron job ID to delete
     * @returns Promise resolving to MongoDB's DeleteResult
     * @throws ResourceNotFoundException if cron job not found
     */
    async delete(id: string) {
        const result = await this.db.collection(this.collectionName).deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            throw new ResourceNotFoundException(ErrorMessage.CRON_JOB_NOT_FOUND_IN_DATABASE);
        }

        return result;
    }
}
