import {Request,Response} from 'express' 
import {body, validationResult} from 'express-validator'
import prisma from '../db/prisma'
import { AuthRequest } from '../middleware/auth.middleware'

//validation rules
export const validateProduct = [
    body('url').isURL().withMessage('must be a valid URL'),
    body('initialPrice').isFloat({gt:0}).withMessage('price must be postive number')
]
// Helper to extract a name from URL
const extractProductName = (url: string): string => {
    try {
        const parsedUrl = new URL(url);
        // Try to get a segment that looks like a product name
        // E.g., for Amazon: /dp/B00FLYWNYQ/ -> try to use last part or title
        const segments = parsedUrl.pathname.split('/').filter(Boolean);
        if (segments.length > 0) {
            // Take the last part, replace hyphens with spaces, capitalize
            const candidate = segments[segments.length - 1];
            return candidate.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
        return parsedUrl.hostname;
    } catch {
        return url.substring(0, 50); // Fallback
    }
};

//post/api/products
export const createProduct = async (req:AuthRequest, res:Response)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {url, initialPrice, name}= req.body;
    try {
        //verify if the product exist or not
        const existing = await prisma.product.findUnique({where:{url}})
        if (existing){
            return res.status(409).json({error:'product already exist in database'})
        }
        
        const userId = req.userId;
        if(!userId){
            return res.status(401).json({error:'unauthorized'})
        }

        const product = await prisma.product.create({
            data:{
                url,
                name: name || extractProductName(url),
                initialPrice:initialPrice,
                currentPrice: initialPrice,
                userId: userId
            }
        });
        res.status(201).json({message:'the product created successfully', product})
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'server error'})
        
    }
}
//get/api/products
export const getProduct = async (req:AuthRequest, res:Response) => {
    const page=parseInt(req.query.page as string) || 1;
    const limit =parseInt(req.query.limit as string) || 10;
    const skip = (page-1)*limit
    
    try {
        const userId = req.userId;
        if (!userId){
            return res.status(401).json({error:'unauthorized'})
        }

        const products = await prisma.product.findMany({
            where:{userId: userId},
            skip,
            take:limit,
            orderBy:{createdAt: 'desc'},
        })
        const total = await prisma.product.count({where:{userId:userId}});
        res.json({
            data:products,
            pagination:{page, limit, total,pages:Math.ceil(total/limit)}
        })
    } catch (error) {
        res.status(500).json({error:'faild to fetch products'})
        
    }   
}
//delete/api/products/:id
export const deteteProduct= async (req:AuthRequest, res:Response) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)){
        return res.status(400).json({error:'invalid product id'})
    }
    try {
        const userId = req.userId;
        const product = await prisma.product.findUnique({ where: { id } });
        
        if (!product || product.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        await prisma.product.delete({where:{id}})
        res.status(204).json({id,message:'this product was deleted successfully'})
    } catch (error) {
        console.error(error)
        res.status(500).json({error:'failed to delete this product'})
   
    }
}
