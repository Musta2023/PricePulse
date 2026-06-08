// @ts-ignore: suppress missing module/type declarations for express
import {Router} from 'express'
import { getProduct ,createProduct,deteteProduct, validateProduct} from '../controllers/products.controller'
import { protect } from '../middleware/auth.middleware';

const router=Router();
router.use(protect);

router.get('/',getProduct);
router.post('/',validateProduct,createProduct);
router.delete('/:id',deteteProduct)

export default router;
