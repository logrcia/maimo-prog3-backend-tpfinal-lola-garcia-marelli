import express from "express";
import Category from "../models/category.js";
import Pin from "../models/pins.js";
 
const router = express.Router();
 
// Crear categoría (name + slug)
router.post("/", async (req, res) => {
  try {
    const { name, slug } = req.body;
    const category = new Category({ name, slug });
    await category.save();
    return res.status(201).send({ message: "Categoría creada", category });
  } catch (error) {
    return res.status(500).send({ message: "Hubo un error", error });
  }
});
 
// Listar categorías (simple)
router.get("/", async (_req, res) => {
  try {
    const categories = await Category.find().select("_id name slug");
    return res.status(200).send({ message: "Todas las categorías", categories });
  } catch (error) {
    return res.status(500).send({ message: "Hubo un error", error });
  }
});

// Pins por categoría (slug o id)
router.get("/:key/pins", async (req, res) => {
  const { key } = req.params;
  try {
    
    const isId = key.match(/^[0-9a-fA-F]{24}$/);
    const category = isId
      ? await Category.findById(key)
      : await Category.findOne({ slug: key });
 
    if (!category) {
      return res.status(404).send({ message: "Categoría no encontrada" });
    }
 
    const pins = await Pin.find({ categories: category._id })
      .select("_id title author image visualStyle")
      .populate("categories", "name slug");
 
    return res.status(200).send({
      message: "Pins por categoría",
      category: { _id: category._id, name: category.name, slug: category.slug },
      pins
    });
  } catch (error) {
    console.error("ERROR COMPLETO:", error); // ← PARA VER EL ERROR
    return res.status(500).send({ message: "Hubo un error", error: error.message });
  }
});

// Obtener una categoría por slug o id - NUEVA RUTA
router.get("/:key", async (req, res) => {
  const { key } = req.params;
  try {
    const isId = key.match(/^[0-9a-fA-F]{24}$/);
    const category = isId
      ? await Category.findById(key)
      : await Category.findOne({ slug: key });

    if (!category) {
      return res.status(404).send({ message: "Categoría no encontrada" });
    }

    return res.status(200).send({ 
      message: "Categoría encontrada", 
      category 
    });
  } catch (error) {
    return res.status(500).send({ message: "Hubo un error", error: error.message });
  }
});
 
 

 
export default router;