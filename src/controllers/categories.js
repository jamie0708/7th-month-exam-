import {
    read,
    write
} from '../utils/model.js'
import {
    InternalServerError
} from "../utils/errors.js"
import sha256 from 'sha256'
import jwt from '../utils/jwt.js'

const GET = (req, res, next) => {
    try {

        let Categories = read('categories')
        let subCategories = read('sub_categories')

        let Category = Categories.map((Category) => {
            Category.categoryId = Category.category_id
            delete Category.category_id
            Category.categoryName = Category.category_name
            delete Category.category_name
            Category.subCategories = subCategories.filter(
                (subCategory) => subCategory.category_id == Category.categoryId);
            Category.subCategories.map((subCategory) => {
                delete subCategory.category_id
                subCategory.subCategoryName = subCategory.sub_category_name
                delete subCategory.sub_category_name
                subCategory.subCategoryId = subCategory.sub_category_id
                delete subCategory.sub_category_id
            })
            return Category;
        });

        let {
            categoryId
        } = req.params

        if (categoryId) {
            let definedCategory = Category.find(c => c.category_id == categoryId)
            res.status(200).send({
                status: 200,
                message: "OK",
                data: definedCategory,
            });

        } else {

            res.status(200).send({
                status: 200,
                message: "OK",
                data: Category,
            });
        }

    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

const POST = (req, res, next) => {
    try {
        let categories = read('categories')
        
        req.body.category_id = categories.length ? categories.at(-1).category_id + 1 : 1

        let category = categories.find(c => c.category_name == req.body.category_name)

        if(category){
            return next( new AuthrizationError(401, 'this category exists') )
        }
        categories.push(req.body)
        write('categories', categories)

        res.status(201).json({
            status: 201,
            message: 'success',
            data: req.body  
        })
    } catch (error) {
        return next( new InternalServerError(500, error.message) )
    }
}


export default {
    GET, POST
}