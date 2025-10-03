import Joi from "joi";

export const productSchema = Joi.object({
    name: Joi.string().max(200).required(),
    description: Joi.string().max(5000).required(),
    price: Joi.number().min(0).required(),
    brand: Joi.string().max(100).required(),
    category: Joi.string().required(), // must be ObjectId string
    countInStock: Joi.number().min(0).required(),
    images: Joi.array().items(
        Joi.object({
            url: Joi.string().uri().required(),
            alt: Joi.string().allow("").optional(),
        })
    ).required()
});
