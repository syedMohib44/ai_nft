import Joi, { ValidationError } from '@hapi/joi';

interface ValidationResult {
    error?: ValidationError;
    value: any;
}

export const validate = (schema: Joi.Schema, data: any): ValidationResult =>
    schema.validate(data);
