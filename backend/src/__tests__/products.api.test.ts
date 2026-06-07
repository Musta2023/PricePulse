import request from 'supertest';
import { app } from '../index';
import prisma from '../db/prisma';

describe('Products API Integration Tests', () => {
    let testUserId: number;

    beforeAll(async () => {
        // Ensure a user exists for testing
        const user = await prisma.user.upsert({
            where: { email: 'test@example.com' },
            update: {},
            create: {
                email: 'test@example.com',
                name: 'Test User'
            }
        });
        testUserId = user.id;
    });

    afterAll(async () => {
        // Cleanup
        await prisma.product.deleteMany({ where: { userId: testUserId } });
        // We keep the user to avoid foreign key issues in other runs, 
        // but in a real CI environment we'd use a separate test DB.
    });

    describe('POST /api/products', () => {
        it('should create a new product', async () => {
            const res = await request(app)
                .post('/api/products')
                .send({
                    url: 'https://jest-test.com/product',
                    initialPrice: 50.00
                });

            expect(res.status).toBe(201);
            expect(res.body.product).toHaveProperty('id');
            expect(res.body.product.url).toBe('https://jest-test.com/product');
        });

        it('should return 400 for invalid data', async () => {
            const res = await request(app)
                .post('/api/products')
                .send({
                    url: 'not-a-url',
                    initialPrice: -10
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/products', () => {
        it('should list products', async () => {
            const res = await request(app).get('/api/products');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('DELETE /api/products/:id', () => {
        it('should delete a product', async () => {
            // First create a product to delete
            const product = await prisma.product.create({
                data: {
                    url: 'https://delete-me.com',
                    initialPrice: 10,
                    currentPrice: 10,
                    userId: testUserId
                }
            });

            const res = await request(app).delete(`/api/products/${product.id}`);
            expect(res.status).toBe(204);

            const deleted = await prisma.product.findUnique({ where: { id: product.id } });
            expect(deleted).toBeNull();
        });
    });
});
