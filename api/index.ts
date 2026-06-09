import express from "express";
import cors from 'cors';
import helmet from 'helmet';
import productRoute from '../backend/src/routs/products.routes'
import authRoute from '../backend/src/routs/auth.routes'
import '../backend/src/services/priceSimulator.service'
import prisma from '../backend/src/db/prisma'

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);

//health check
app.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return res.json({ status: 'ok', db: 'connected' });
    } catch (error) {
        return res.status(500).json({ status: 'error', details: 'disconnected' });
    }
});

//start
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`server running on http://localhost:${PORT}`);
    });
}

export default app;
