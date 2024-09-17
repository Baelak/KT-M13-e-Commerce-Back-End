const router = require('express').Router();
const { Category, Product } = require('../../models');

// get ALL CATEGORIES

router.get('/', async (req, res) => {
try {
  const categories = await Category.findAll({include: [Product]});
  res.status(200).json(categories);
} catch(err) {
  res.status(500).json(err);
}
});

// get ONE CATEGORY BY ID

router.get('/:id', async (req, res) => {
 try {
  const category = await Category.findByPk(req.params.id, {include: [Product]});
  if (!category) {
    res.status(404).json({ message: 'No Category found with this id 🤭'});
    return;
  }
  res.status(200).json(category);
 }  catch (err) {
  res.status(500).json(err);
 }
});
 
// post A NEW CATEGORY

router.post('/', async (req, res) => {
try {
  const category = await Category.create(req.body);
  res.status(201).json({message: 'Category has been Created 😄'});
}catch (err){
  res.status(500).json({message: 'Uh oh! That did not work 😅'});
}
});

//put A CATEGORY BY ID

router.put('/:id',async (req, res) => {
  try{
    const category = await Category.update(req.body, {where:{id:req.params.id}});
    res.status(201).json({message: 'Category has been updated 😄'});
  } catch (err){
    res.status(500).json({message: 'Uh oh! That did not work 😅'});
  }
});

//delete A CATEGORY BY ID

router.delete('/:id', async (req, res) => {
 try {
  const category = await Category.destroy(req.body, {where:{id:req.params.id}});
  res.status(200).json({message: 'Category has been deleted ☠️'});
 } catch (err) {
  res.status(500).json(err);
 }
});

module.exports = router;
