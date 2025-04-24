import TodoModel from "../models/todo.models.js";



export const createTodo = async (req, res) => {
    try {
        const { title } = req.body;
        const newTodo = new TodoModel({ownerId:"123", title });
        await newTodo.save();
        res.status(201).json({data: newTodo, message: "Todo created successfully!"});
    } catch (error) {
        res.status(500).json({ message: "Error creating todo", error: error.message });
    }
}