import express from "express";
const router = express.Router();
import Board from "../models/board.js";

const findAllBoards = async (req, res) => {
    try {
        const boards = await Board.find().select("_id name description pins").populate('pins')
        return res.status(200).send({message: "Todos los boards", boards: boards})
    } catch (error) {
        return res.status(501).send({message: "Hubo error ", error})
     }
};

const findOneBoard = async (req, res) => {
    const {id} = req.params
    try {
        const board = await Board.findOne({_id: id}).select("_id name description pins").populate('pins')
        return res.status(200).send({message: "Board encontrado ", board})
    } catch (error) {
        return res.status(501).send({message: "Hubo error ", error})
    }
}

const addBoard = async (req, res) => {
    const { name, description, pins } = req.body
    try {
        const board = new Board({ name, description, pins })
        await board.save()
        return res.status(200).send({message: "Board creado ", board})
    } catch (error) {
        return res.status(501).send({message: "Hubo error ", error})
    }
}

const deleteBoard = async (req, res) => {
    const {id} = req.params
    try {
        const boardToDelete = await Board.findOne({_id: id})

        if(!boardToDelete){
            return res.status(404).send({message: "No existe el board ", id: id})
        }

        await Board.deleteOne({_id: id})
        return res.status(200).send({message: "Board borrado", board: boardToDelete})
    } catch (error) {
        return res.status(501).send({message: "Hubo error ", error})
    }
}

const updateBoard = async (req, res) => {
    const {id} = req.params
    const { name, description, pins } = req.body
    try {
        const boardToUpdate = await Board.findOne({_id: id})

        if(!boardToUpdate){
            return res.status(404).send({message: "No existe el board ", id: id})
        }

        //valores a actualizar
        if (name !== undefined) boardToUpdate.name = name
        if (description !== undefined) boardToUpdate.description = description
        if (pins !== undefined) boardToUpdate.pins = pins

        await boardToUpdate.save()
        return res.status(200).send({message: "Board actualizado", board: boardToUpdate})
    } catch (error) {
        return res.status(501).send({message: "Hubo error ", error})
    }
}

const addPinToBoard =  async (req, res) => {
  const { boardId, pinId } = req.params;
  try {
    const board = await Board.findById(boardId);
    
    if (!board) {
      return res.status(404).send({ message: "Tablero no encontrado" });
    }

    // Verificar que el pin no esté ya guardado
    if (board.pins.includes(pinId)) {
      return res.status(400).send({ message: "Pin ya guardado en este tablero" });
    }

    board.pins.push(pinId);
    await board.save();
    return res.status(200).send({ message: "Pin agregado al tablero", board });
  } catch (error) {
    return res.status(500).send({ message: "Error", error });
  }
}

const deletePinFromBoard = async (req, res) => {
  const { boardId, pinId } = req.params;
  try {
    const board = await Board.findById(boardId);
    
    if (!board) {
      return res.status(404).send({ message: "Tablero no encontrado" });
    }

    board.pins = board.pins.filter(pin => pin.toString() !== pinId);
    await board.save();
    return res.status(200).send({ message: "Pin eliminado del tablero" });
  } catch (error) {
    return res.status(500).send({ message: "Error", error });
  }
}

router.delete("/:boardId/pins/:pinId", deletePinFromBoard);
router.post("/:boardId/pins/:pinId", addPinToBoard);

router.get("/", findAllBoards);
router.get("/:id", findOneBoard);
router.post("/", addBoard);
router.delete("/:id", deleteBoard);
router.put("/:id", updateBoard)

export default router;