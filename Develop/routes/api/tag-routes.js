const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// get ALL TAGS

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll(
      {include: [{model: Product, through: ProductTag}]
    });
    res.status(200).json(tags);
  }catch (err) {
    res.status(500).json({message:'Uh oh! That did not work 😅', error: err});
  }
});

//get ONE TAG BY ID

router.get('/:id', async (req, res) => {
  try {
    const tag =await Tag.findByPk(
      req.params.id, {include: [{model: Product, through: ProductTag}]});
      if (!tag){
        res.status(404).json({message: "No tag found with this id 🤭"});
        return
      }
      res.status(200).json(tag);
  } catch (err) {
    res.status(500).json({message: 'Uh oh! That did not work 😅', error: err});
  }
});

  // post CREATE A NEW TAG

router.post('/', async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(200).json({message: 'Tag has been Created 😄', tag});
  } catch (err) {
    res.status(500).json({message: 'Uh oh! That did not work 😅', error:err});
  }
});

  // put UPDATE A TAG BY ID

  router.put('/:id', async (req, res) => {
    try {
      const updated = await Tag.update(req.body, { where: { id: req.params.id } });
      if (!updated[0]) {
        return res.status(404).json({ message: 'No tag found with this id 🤭' });
      }
      res.status(200).json({ message: 'Tag has been updated 😄'});
    } catch (err) {
      res.status(500).json({ message: 'Uh oh! That did not work 😅', error: err });
    }
  });

  // delete A TAG BY ID

  router.delete('/:id', async (req, res) => {
    try {
      // Delete associated ProductTag records first
      await ProductTag.destroy({ where: { tag_id: req.params.id } });
  
      // Now delete the Tag
      const deleted = await Tag.destroy({ where: { id: req.params.id } });
  
      if (!deleted) {
        return res.status(404).json({ message: 'No Tag found with this id 🤭' });
      }
  
      res.status(200).json({ message: 'Tag Deleted ☠️' });
    } catch (err) {
      res.status(500).json({ message: 'Uh oh! That did not work 😅', error: err });
    }
  });
    
module.exports = router;
