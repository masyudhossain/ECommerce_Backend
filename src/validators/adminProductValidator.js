// validators/adminProductValidator.js
import Joi from "joi";

// Schema for creating a product
export const productCreateSchema = Joi.object({
    name: Joi.string().max(200).required(),
    description: Joi.string().max(5000).required(),
    price: Joi.number().min(0).required(),
    brand: Joi.string().max(100).required(),
    category: Joi.string().required(),
    countInStock: Joi.number().min(0).required(),
    images: Joi.array().items(
        Joi.object({
            url: Joi.string().uri().required(),
            alt: Joi.string().allow("").optional(),
        })
    ).required()
});


// Schema for updating a product (partial update)
export const productUpdateSchema = Joi.object({
    name: Joi.string().max(200),
    description: Joi.string().max(5000),
    price: Joi.number().min(0),
    brand: Joi.string().max(100),
    category: Joi.string(),
    countInStock: Joi.number().min(0),
    images: Joi.array().items(
        Joi.object({
            url: Joi.string().uri().required(),
            alt: Joi.string().allow("").optional(),
        })
    )
}).min(1); // ensures at least one field is sent
