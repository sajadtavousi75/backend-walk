const categoryModel = require("../../models/category");


exports.create = async (req, res) => {
  const { title } = req.body;

  const newCategory = await categoryModel.create({ title});

  return res.status(201).json(newCategory);
};

exports.getAll = async (req, res) => {
  try {
    const categories = await categoryModel.find().lean().sort({ _id: -1 });

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  };

exports.remove = async (req, res) => {
  const deletedCategory = await categoryModel.findOneAndRemove({
    _id: req.params.id,
  });
  if (!deletedCategory) {
    return res.status(404).json({ message: "Category Not Found!" });
  }
  return res.json(deletedCategory);
};

exports.update = async (req, res) => {
  const updatedCategory = await categoryModel.findOneAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
    }
  );
  if (!updatedCategory) {
    return res.status(404).json({ message: "Category Not Found!" });
  }
  return res.json(updatedCategory);
};

