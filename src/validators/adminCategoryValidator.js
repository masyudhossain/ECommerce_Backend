// validators/adminCategoryValidator.js

import Joi from "joi";

export const categorySchema = Joi.object({
    name: Joi.string().max(100).required(),
    parentCategoryId: Joi.string().optional().allow(null, ""),
});
