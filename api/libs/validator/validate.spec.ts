import Joi from '@hapi/joi';
import { validate } from './validate';

describe('Validations test', () => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        amount: Joi.number().required(),
        address: Joi.array().items(Joi.object({
            street: Joi.string().min(8)
        })),
        phone: Joi.array().items(Joi.string().required())
    });

    test('should have value', () => {
        const sample = {
            email: 'test@xyz.com',
            amount: 5,
            phone: ['12345678']
        };
        const res = validate(schema, sample);

        expect(res).toHaveProperty('value');
    });

    test('should have error for incorrect type', () => {
        const sample = {
            email: 'test@xyz.com',
            amount: 'abcd',
            phone: ['12345678']
        };
        const res = validate(schema, sample);
        expect(res).toHaveProperty('error');

        expect(res.error).toHaveProperty('details');
    });

    test('should allow number string', () => {
        const sample = {
            email: 'test@xyz.com',
            amount: '5',
            phone: ['12345678']
        };
        const res = validate(schema, sample);

        expect(res).toHaveProperty('value');
    });

    test('should have error if data is incomplete', () => {
        const sample = {
        };
        const res = validate(schema, sample);

        expect(res).toHaveProperty('error');
        expect(res.error).toHaveProperty('details');
    });

    test('should allow empty array', () => {
        const sample = {
            email: 'test@xyz.com',
            amount: '5',
            address: [],
            phone: ['12345678']
        };
        const res = validate(schema, sample);

        expect(res).toHaveProperty('value');
    });

    test('should not allow empty array', () => {
        const sample = {
            email: 'test@xyz.com',
            amount: '5',
            phone: []
        };
        const res = validate(schema, sample);

        expect(res).toHaveProperty('error');
    });
});
