import { Router } from "express";
import controller from '../controllers/subcategories.js'

const router = Router()

router.route('/subcategories')
    .get( controller.GET )
    .post( controller.POST )

router.route('/subcategories/:subCategoryId')
    .get( controller.GET )
    .put( controller.PUT )

export default router;