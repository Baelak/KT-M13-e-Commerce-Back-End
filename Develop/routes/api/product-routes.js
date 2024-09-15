const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');


// get ALL PRODUCTS

router.get('/', async (req, res) => {
  try{
    const products = await Product.findAll({
      include: [Category,
        {model: Tag, through: ProductTag}
      ]
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
  });

// get ONE PRODUCT BY ID

router.get('/:id', (req, res) => {
  try{
    const product = await Product.findByPk(req.params.id, {
      include: [Category,
        {model: Tag, through: ProductTag}
      ]
    });
    if (!product) {
      res.status(404).json ({message: 'No product found with this id 🤭'});
    return;
    }
    res.status(200).json(product);
  }catch (err) {
    res.status(500).json(err);
  }
});

// post A NEW PRODUCT

router.post('/', (req, res) => {
  try {
    const product = await Product.create(req.body);
    if (req.body.tagIds.length) {
      const productTagArr = req.body.tagIds.map(tag_id => ({product_id: product.id, tag_id}));
      await ProductTag.bulkCreate(productTagArr);
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

// put UPDATE A PRODUCT

router.put('/:id', async (req, res) => {
  try {
    await Product.update(req.body, { where: { id: req.params.id } });
    const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    const newProductTags = req.body.tagIds
      .filter(tag_id => !productTagIds.includes(tag_id))
      .map(tag_id => ({ product_id: req.params.id, tag_id }));

    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

    await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);

    res.status(200).json({ message: 'Product updated 😄' });
  } catch (err) {
    res.status(400).json(err);
  }
});

// delete A PRODUCT

router.delete('/:id', async (req,res) => {
  try{
    await Product.destroy({where: {id: req.params.id}});
    res.status(200).json({message: 'Product deleted ☠️'});
  } catch (err){
    res.status(500)json(err);
  }
});


module.exports = router;
