import Category from "../models/category.model.js";

const seedUncategorized = async () => {
    const exists = await Category.findOne({ name: "Uncategorized" });
    if (!exists) {
        await Category.create({ name: "Uncategorized", parentCategoryId: null });
        console.log('"Uncategorized" category created');
    }
};

export default seedUncategorized;
