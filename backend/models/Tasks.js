const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    data: {
        type: String,
    },
    status: {
        type: String,
        default: 'pending',
    },
    priority: {
        type: Number,
        default: 0,
    },
    email: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    due: {
        type: Date,
    },
})

const Task = mongoose.model('tasks', TaskSchema);
module.exports = Task;