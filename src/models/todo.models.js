import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema({
  ownerId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TodoModel = mongoose.models.todo || mongoose.model("Todo", todoSchema);
export default TodoModel;
