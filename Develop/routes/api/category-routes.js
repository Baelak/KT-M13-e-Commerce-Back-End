const router = require('express').Router();
const { Category, Product, ProductTag } = require('../../models');

// get ALL CATEGORIES
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({ include: [Product] });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get ONE CATEGORY BY ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, { include: [Product] });
    if (!category) {
      res.status(404).json({ message: 'No Category found with this id 🤭'});
      return;
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

// post A NEW CATEGORY
router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ message: 'Category has been Created 😄', category });
  } catch (err) {
    res.status(500).json({ message: 'Uh oh! That did not work 😅', error: err });
  }
});

// put A CATEGORY BY ID
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.update(req.body, { where: { id: req.params.id } });
    res.status(200).json({ message: 'Category has been Updated 😄', category });
  } catch (err) {
    res.status(500).json({ message: 'Uh oh! That did not work 😅', error: err });
  }
});

// delete A CATEGORY BY ID
router.delete('/:id', async (req, res) => {
  try {
    // Find products associated with the category
    const products = await Product.findAll({
      where: { category_id: req.params.id },
      attributes: ['id']
    });

    // Extract product IDs from the result
    const productIds = products.map(product => product.id);

    // Delete entries in product_tag that reference these product IDs
    await ProductTag.destroy({
      where: { product_id: productIds }
    });

    // Delete products associated with the category
    await Product.destroy({
      where: { category_id: req.params.id }
    });

    // Finally, delete the category
    const category = await Category.destroy({ where: { id: req.params.id } });
    if (!category) {
      res.status(404).json({ message: 'No Category found with this id 🤭' });
      return;
    }
    res.status(200).json({ message: 'Category has been Deleted ☠️' });
  } catch (err) {
    res.status(500).json({ message: 'Uh oh! That did not work 😅', error: err });
  }
});

module.exports = router;
