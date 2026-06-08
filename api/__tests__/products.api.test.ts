import request from 'supertest';
import app from '../index';
import prisma from '../db/prisma';
import bcrypt from 'bcrypt';

describe('Products API Integration Tests (Authenticated)', () => {
    let token: string;
    let testUserId: number;

    beforeAll(async () => {
        // Clean and Setup test user
        await prisma.product.deleteMany({});
        await prisma.user.deleteMany({});

        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await prisma.user.create({
            data: {
                email: 'test-api@example.com',
                password: hashedPassword,
                name: 'Test API User'
            }
        });
        testUserId = user.id;

        // Login to get token
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test-api@example.com',
                password: 'password123'
            });
        
        token = loginRes.body.token;
    });

    afterAll(async () => {
        await prisma.product.deleteMany({});
        await prisma.user.deleteMany({});
    });

    describe('POST /api/products', () => {
        it('should create a new product when authenticated', async () => {
            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    url: 'https://jest-test.com/product-auth',
                    initialPrice: 50.00,
                    name: 'Test Product'
                });

            expect(res.status).toBe(201);
            expect(res.body.product.userId).toBe(testUserId);
        });

        it('should return 401 when no token is provided', async () => {
            const res = await request(app)
                .post('/api/products')
                .send({
                    url: 'https://no-auth.com',
                    initialPrice: 10
                });

            expect(res.status).toBe(401);
        });

        it('should return 400 for invalid data (URL and Price)', async () => {
            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    url: 'not-a-url',
                    initialPrice: -10
                });

            expect(res.status).toBe(400);
            expect(res.body.errors).toContainEqual(expect.objectContaining({ msg: 'must be a valid URL' }));
            expect(res.body.errors).toContainEqual(expect.objectContaining({ msg: 'price must be postive number' }));
        });
    });

    describe('GET /api/products', () => {
        it('should list only user products', async () => {
            const res = await request(app)
                .get('/api/products')
                .set('Authorization', `Bearer ${token}`);
            
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });
});

describe('Auth API Integration Tests', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'newuser@test.com',
                password: 'newpassword',
                name: 'New User'
            });
        
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should fail login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test-api@example.com',
                password: 'wrongpassword'
            });
        
        expect(res.status).toBe(401);
    });
});
