const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [Category, { model: Tag, through: ProductTag }]
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Products 😅', error: err });
  }
});

// GET ONE PRODUCT BY ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category, { model: Tag, through: ProductTag }]
    });

    if (!product) {
      return res.status(404).json({ message: 'No product found with this id 🤭' });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Uh oh! That did not work 😅', error: err });
  }
});

// POST A NEW PRODUCT
router.post('/', async (req, res) => {
  try {
    const { tagIds = [], ...productData } = req.body;
    const product = await Product.create(productData);

    if (tagIds.length) {
      const productTagArr = tagIds.map(tag_id => ({ product_id: product.id, tag_id }));
      await ProductTag.bulkCreate(productTagArr);
    }

    res.status(200).json({ message: 'Product has been created 😄', product });
  } catch (err) {
    res.status(400).json({ message: 'Error creating product 😅', error: err });
  }
});

// UPDATE A PRODUCT
router.put('/:id', async (req, res) => {
  try {
    const { tagIds = [], ...productData } = req.body;

    // Update the product
    await Product.update(productData, { where: { id: req.params.id } });

    // Find all associated tags from ProductTag
    const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
    const productTagIds = productTags.map(({ tag_id }) => tag_id);

    // New tags to be added
    const newProductTags = tagIds
      .filter(tag_id => !productTagIds.includes(tag_id))
      .map(tag_id => ({ product_id: req.params.id, tag_id }));

    // Tags to be removed
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !tagIds.includes(tag_id))
      .map(({ id }) => id);

    // Execute both removals and additions
    await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);

    res.status(200).json({ message: 'Product has been updated 😄'});
  } catch (err) {
    res.status(400).json({ message: 'Error updating product 🫠', error: err });
  }
});

// DELETE A PRODUCT
router.delete('/:id', async (req, res) => {
  try {
    // Delete associated ProductTag records first
    await ProductTag.destroy({ where: { product_id: req.params.id } });

    // Now delete the Product
    const deleted = await Product.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ message: 'No Product found with this id 🤭' });
    }

    res.status(200).json({ message: 'Product Deleted ☠️' });
  } catch (err) {
    res.status(500).json({ message: 'Uh oh! That did not work 😅', error: err });
  }
});

module.exports = router;
