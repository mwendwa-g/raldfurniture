const {Category} = require("../models/category");
const {Product} = require("../models/product");
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const upload = require('../models/storage')

//posting a category
router.post(`/`, upload.single('image'), async (req, res) => {
    try {
        let imageUrl = null;
        if (req.file) {
            imageUrl = req.file.path;
        }
        let category = new Category({
            name: req.body.name,
            image: imageUrl,
            color: req.body.color
        });
        category = await category.save();
        if (!category) {
            return res.status(400).send('The category cannot be created!');
        }
        res.send(category);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Category already exists" });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


//getting all
router.get(`/`, async (req, res) => {
    const categoryList = await Category.find().sort({ _id: -1 });

    if(!categoryList) {
        res.status(500).json({success: false})
    }
    res.status(200).send(categoryList);
})

//getting parents
router.get("/parents", async (req, res) => {
    const categoryList = await Category.find({productCount: { $gt: 0 }}).sort({ name: 1 });

    if(!categoryList) {
        res.status(500).json({success: false})
    }
    res.status(200).send(categoryList);
});

//getting subcategories
router.get("/subcategories", async (req, res) => {
    try {
        const subcategories = await Category.find({ 
            parentCategory: { $ne: null }, 
            productCount: { $gt: 0 }     
        }).sort({ name: 1 });
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

//getting subcategories all
router.get("/subcategories/all", async (req, res) => {
    try {
        const subcategories = await Category.find({ 
            parentCategory: { $ne: null } 
        }).sort({ name: 1 });
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


//delete category
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        await Product.deleteMany({ category: category._id });
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Category and its associated products are deleted!' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});


//getting a single categ
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if(!category) {
        res.status(500).json({message: 'category not found'});
    }
    else{
        res.status(200).send(category);
    }
})

//put request
router.put('/:id', async (req,res)=>{
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name
        },
        {
            new: true
        }
    )
    if(!category)
    return res.status(400).json({message: 'The category cannot be updated!'})
    res.send(category);
})


module.exports = router