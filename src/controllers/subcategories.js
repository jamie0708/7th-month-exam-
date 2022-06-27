import {
    read,
    write
} from '../utils/model.js'
import {
    InternalServerError, notFoundError
} from "../utils/errors.js"

const GET = (req, res, next) => {
    try {

        let subCategories = read('sub_categories')
        let products = read('products')

        let subCategory = subCategories.map((subCategory) => {
            delete subCategory.category_id
            subCategory.subCategoryName = subCategory.sub_category_name
            delete subCategory.sub_category_name
            subCategory.subCategoryId = subCategory.sub_category_id  
            delete subCategory.sub_category_id
            subCategory.products = products.filter(
                (product) => product.sub_category_id == subCategory.subCategoryId);
            subCategory.products.map((product) => delete product.sub_category_id)
            return subCategory;
        });

        res.status(200).send({
            status: 200,
            message: "OK",
            data: subCategory,
        });

    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

const POST = (req, res, next) => {
    try {
        let subCategories = read('sub_categories')
        
        req.body.sub_category_id = subCategories.length ? subCategories.at(-1).category_id + 1 : 1

        let subCategory = subCategories.find(sc => sc.sub_category_name == req.body.sub_category_name)

        if(subCategory){
            return next( new AuthrizationError(401, 'this sub-category exists') )
        }
        subCategories.push(req.body)
        write('sub_categories', subCategories)

        res.status(201).json({
            status: 201,
            message: 'success',
            data: req.body  
        })
    } catch (error) {
        return next( new InternalServerError(500, error.message) )
    }
}

const PUT = (req, res, next) => {
    try {
      let subCategories = read("sub_categories");
      let users = read("users");
  
      let { subCategoryId } = req.params;
      console.log(subCategoryId);
  
      let subCategory = subCategories.find(
        (subCategory) => {
          subCategory.sub_category_id == subCategoryId 
          users.find((user) => user.user_id == req.user_id)
        }
      );
      console.log(subCategory);
  
      if (!subCategory) {
        return next(new notFoundError(404, "Subctegory not found"));
      }
  
      subCategory.sub_category_name =
        req.body.subCategoryName || subCategory.sub_category_name;
      write("subCategories", subCategories);
  
      subCategory.user = users.find((user) => user.user_id == req.user_id);
      delete subCategory.user_id;
      delete subCategory.user.password;
  
      res.status(200).json({
        status: 200,
        message: "Subcategory updated",
        data: subCategory,
      });
    } catch (error) {
      return next(new InternalServerError(500, error.message));
    }
  }
  
  const DELETE = (req, res, next) => {
    try {
      let subCategories = read("sub_categories");
      let users = read("users");
  
      let { subCategoryId } = req.params;
  
      let subCategoryIndex = subCategories.findIndex(
        (subCategory) =>
          subCategory.sub_category_id == subCategoryId &&
          users.find((user) => user.user_id == req.user_id)
      );
  
      if (subCategoryIndex == -1) {
        return next(new notFoundError(404, "subCategory not found"));
      }
  
      let [subCategory] = subCategories.splice(subCategoryIndex, 1);
      write("subCategories", subCategories);
  
      subCategory.user = users.find((user) => user.user_id == req.user_id);
      delete subCategory.user.password;
  
      res.status(200).json({
        status: 200,
        message: "Subcategory deleted",
        data: subCategory,
      });
    } catch (error) {
      return next(new InternalServerError(500, error.product));
    }
  }

export default {
    GET, POST, PUT, DELETE
}