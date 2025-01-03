const Product = require('../Models/AddProduct');

// Get all users
const getAllProducts = async (req, res, next) => {
    let products;
    try {
        products = await User.find();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }

    if (!products.length === 0) {
        return res.status(404).json({ message: 'Products not found' });
    }

    return res.status(200).json({ products });
};

// Add a new user
const AddProduct = async (req, res, next) => {
    const { productName, category, price, images } = req.body;
    let product;

    try {
        product = new Product({
            productName,
            category,
            price,
            images
        });
        await product.save();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to add user' });
    }

    if (!product) {
            return res.status(400).json({ message: 'User not added' });
        }
    return res.status(201).json({ product });
};

// Get user by ID
const getById = async (req, res, next) => {
    const id = req.params.id;
    let product;

    try {
        product = await User.findById(id);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to fetch user' });
    }

    if (!product) {
        return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ product });
};

// Update user details
const updateProduct = async (req, res, next) => {
    const id = req.params.id;
    const { name, age, email, password } = req.body;

    let product;
    try {
        product = await User.findByIdAndUpdate(
            id,
            { name, age, email, password },
            { new: true } // Return the updated document
        );
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to update product' });
    }

    if (!product) {
        return res.status(404).json({ message: 'product not found' });
    }

    return res.status(200).json({product });
};


//delete user
const deleteProduct = async (req, res, next) => {
    const id = req.params.id;

    let product;
    try {
        user = await User.findByIdAndDelete(id)
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to delete product' });
    }

    if (!user) {
        return res.status(404).json({ message: 'product not found for deletion' });
    }

    return res.status(200).json({ message: 'product deleted successfully', user });
};

  


exports.getAllProducts = getAllProducts;
exports.AddProduct = AddProduct;
exports.getById = getById;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;