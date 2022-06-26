import { Router } from "express";
import controller from '../controllers/categories.js'

const router = Router()

router.get('/categories',  controller.GET)
router.get('/categories/:categoryId',  controller.GET)
router.post('/categories', controller.POST)

export default router