import express from "express";
const router = express.Router();
import Pin from "../models/pins.js";
import Category from "../models/category.js";



const findAllPins = async (req, res) => {
    try {
        const pins = await Pin.find().select("_id title author visualStyle image colorPalette fonts software categories")  
        return res.status(200).send({message: "Todos los pins", pins: pins})
    } catch (error) {
        return res.status(501).send({message: "Hubo error ", error})
     }
};


const findOnePin = async (req, res) => {
    const {id} = req.params
    try {
        const pin = await Pin.findOne({_id: id}).select("_id title author visualStyle image colorPalette fonts software categories comments")
        return res.status(200).send({message: "Pin encontrado ", pin})
    } catch (error) {
        return res.status(501).send({message: "Hubo error ", error})
    }
}

const addPin = async (req, res) => {
    const { title, author, visualStyle, image, colorPalette, fonts, software, categories } = req.body
    try {
        const pin = new Pin({ title, author, visualStyle, image, colorPalette, fonts, software, categories })
        await pin.save()
        return res.status(200).send({message: "Pin creado ", pin})
    } catch (error) {
        return res.status(501).send({message: "Hubo error ", error})
    }
}

const deletePin = async (req, res) => {
    const {id} = req.params
    try {
        const pinToDelete = await Pin.findOne({_id: id})

        if(!pinToDelete){
            return res.status(404).send({message: "No existe el pin ", id: id})
        }

        await Pin.deleteOne({_id: id})
        return res.status(200).send({message: "Pin borrado", pin: pinToDelete})
    } catch (error) {
        return res.status(501).send({message: "Hubo error ", error})
    }
}

const updatePin = async (req, res) => {
    const {id} = req.params
    const { title, author, visualStyle, image, colorPalette, fonts, software, categories } = req.body
    try {
        const pinToUpdate = await Pin.findOne({_id: id})

        if(!pinToUpdate){
            return res.status(404).send({message: "No existe el pin ", id: id})
        }

        //valores a actualizar
        if (title !== undefined) pinToUpdate.title = title
        if (author !== undefined) pinToUpdate.author = author
        if (visualStyle !== undefined) pinToUpdate.visualStyle = visualStyle
        if (image !== undefined) pinToUpdate.image = image
        if (colorPalette !== undefined) pinToUpdate.colorPalette = colorPalette
        if (fonts !== undefined) pinToUpdate.fonts = fonts
        if (software !== undefined) pinToUpdate.software = software
        if (categories !== undefined) pinToUpdate.categories = categories

        await pinToUpdate.save()
        return res.status(200).send({message: "Pin actualizado", pin: pinToUpdate})
    } catch (error) {
        return res.status(501).send({message: "Hubo error ", error})
    }
}

const addComment = async (req, res) => {
  const { id } = req.params;
  const { user, comment } = req.body;

  const pin = await Pin.findById(id);
  if (!pin) return res.status(404).send("Pin no encontrado");

  pin.comments.push({ user, comment });
  await pin.save();

  res.json({ message: "Comment agregado", pin });
}



//CRUD endpoints
router.get("/", findAllPins);
router.get("/:id", findOnePin);
router.post("/", addPin);
router.delete("/:id", deletePin);
router.put("/:id", updatePin);
router.post("/:id/comments", addComment);

export default router;
