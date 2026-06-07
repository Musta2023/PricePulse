import {Request,Response} from 'express' 
import {body, validationResult} from 'express-validator'
import prisma from '../db/prisma'

//validation rules
export const validateProduct = [
    body('url').isURL().withMessage('must be a valid URL'),
    body('initialPrice').isFloat({gt:0}).withMessage('price must be postive number')
]
//post/api/products
export const createProduct = async (req:Request, res:Response)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {url, initialPrice}= req.body;
    try {
        //verify if the product exist or not
        const existing = await prisma.product.findUnique({where:{url}})
        if (existing){
            return res.status(409).json({error:'product already exist in database'})
        }
        const defaultUser= await prisma.user.findFirst();
        if(!defaultUser){
            return res.status(500).json({error:'no user found please seed database'})
        }
        const product = await prisma.product.create({
            data:{
                url,
                initialPrice:initialPrice,
                currentPrice: initialPrice,
                userId: defaultUser.id
            }
        });
        res.status(201).json({message:'the product created successfully', product})
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'server error'})
        
    }
}
//get/api/products
export const getProduct = async (req:Request, res:Response) => {
    const page=parseInt(req.query.page as string) || 1;
    const limit =parseInt(req.query.limit as string) || 10;
    const skip = (page-1)*limit
    
    try {
        const defaultUser= await prisma.user.findFirst();
        if (!defaultUser){
            return res.status(400).json({error:'there is no user yet'})
        }
        const products = await prisma.product.findMany({
            where:{userId: defaultUser.id},
            skip,
            take:limit,
            orderBy:{createdAt: 'desc'},
        })
        const total = await prisma.product.count({where:{userId:defaultUser.id}});
        res.json({
            data:products,
            pagination:{page, limit, total,pages:Math.ceil(total/limit)}
        })
    } catch (error) {
        res.status(500).json({error:'faild to fetch products'})
        
    }   
}
//delete/api/products/:id
export const deteteProduct= async (req:Request, res:Response) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)){
        return res.status(400).json({error:'invalid product id'})
    }
    try {
        await prisma.product.delete({where:{id}})
        res.status(204).json({id,message:'this product was deleted successfully'})
    } catch (error) {
        console.error(error)
        res.status(500).json({error:'failed to delete this product'})
   
    }
}
