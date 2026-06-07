import {Router} from 'express'
import { getProduct ,createProduct,deteteProduct, validateProduct} from '../controllers/products.controller'

const router=Router();
router.get('/',getProduct);
router.post('/',validateProduct,createProduct);
router.delete('/:id',deteteProduct)

export default router;
