const router = require('express').Router();
const { where } = require('sequelize');
const { Tag, Product, ProductTag } = require('../../models');

// get ALL TAGS

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll(
      {include: [{model: Product, through: ProductTag}]
    });
    res.status(200).json(tags);
  }catch (err) {
    res.status(500).json(err);
  }
});

//get ONE TAG BY ID

router.get('/:id', async (req, res) => {
  try {
    const tag =await Tag.findByPk(
      req.params.id, {include: [{model: Product, through: ProductTag}]});
      if (!tag){
        res.status(404).json({message: "No tag found with this id 🤭"});
        return;
      }
      res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

  // post CREATE A NEW TAG

router.post('/', async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(200).json({message: 'Tag has been Created 😄'});
  } catch (err) {
    res.status(500).json({message: 'Uh oh! That did not work 😅'});
  }
});

  // put UPDATE A TAG BY ID

router.put('/:id',  async (req, res) => {
  try {
    await Tag.update(req.body, {where: {id: req.params.id}});
    res.status(200).json({message: 'Tag has been Updated 😄'});
  } catch (err) {
    res.status(500).json({message: 'Uh oh! That did not work 😅'});
  }
});

  // delete A TAG BY ID

router.delete('/:id', async (req, res) => {
  try {
    await Tag.destroy({where: {id: req.params.id}});
    res.status(200).json({message: 'Tag Deleted ☠️'});
  } catch (err) {
    res.status(500).json({message: 'Uh oh! That did not work 😅'});
  }
});

module.exports = router;
