import Joi from 'joi'


export const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})


export const registerSchema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    password: Joi.string().min(8).required(),
    age: Joi.number().integer().min(12).max(70).required(),
    gender: Joi.valid('male', 'female').required()
})