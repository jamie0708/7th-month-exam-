import { Router } from "express";
import controller from '../controllers/subcategories.js'

const router = Router()

router.get('/subcategories',  controller.GET)
router.get('/subcategories/:subCategoryId',  controller.GET)
router.post('/subcategories', controller.POST)
router.put('/subcategories/:subCategoryId', controller.PUT)

export default router