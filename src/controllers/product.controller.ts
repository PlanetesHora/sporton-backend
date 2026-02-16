import { Request, Response } from "express";
import Product from "../models/product.model";
import cloudinary from "../config/cloudinary.config"; 

// CREATE
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const productData = req.body;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "products",
            });
            productData.imageUrl = result.secure_url;
        }

        if (productData.categoryId) {
            productData.category = productData.categoryId;
            delete productData.categoryId;
        }

        const product = new Product(productData);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error });
    }
};

// GET ALL
export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.find().populate("category").sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
};

// GET BY ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id).populate("category");

        if (!product) {
            res.status(404).json({ message: "Product not found" }); 
            return;
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
};

// UPDATE
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try { 
        const productData = req.body;
        
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "products",
            });
            productData.imageUrl = result.secure_url;
        }

        const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
        
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
};

// DELETE
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
    
        if (!product) { 
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product deleted successfully" }); 
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};