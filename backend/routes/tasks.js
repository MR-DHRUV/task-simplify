require('dotenv').config()
const express = require('express');
const Router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const fetchUser = require('../middleware/fetchUserFromToken');
const Task = require('../models/Tasks');

// Get /?search=work&status=pending
Router.get('/', fetchUser, async (req, res) => {
    try
    {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist.", watchList: null });
        }

        // extract query params
        const search = req.query.search;
        const status = req.query.status;

        // query object
        const query = {
            email: user.email,
            ...(search && { data: { $regex: search, $options: 'i' } }),
            ...(status && { status }),
        }

        const user_tasks = await Task.find(query);
        return res.status(200).json({ success: true, tasks: user_tasks, message: "Tasks fetched successfully" });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Some error occured", watchList: null });
    }
})

// Post /add
Router.post('/add', fetchUser, [
    body('data', 'Enter a valid task').isLength({ min: 1 }).isString(),
    body('priority', 'Enter a valid priority').isNumeric(),
    body('status', 'Enter a valid status').isString().isLength({ min: 5 }),
    body('due', 'Enter a valid due date').isDate(),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array() });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist." });
        }

        const { data, priority, status, due } = req.body;
        await Task.create({ data, priority, status, email: user.email , due});
        return res.status(200).json({ success: true, message: "Task added" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Some error occured" });
    }
})

// Post /update/:id
Router.post('/update/:id', fetchUser, [
    body('data', 'Enter a valid task').isLength({ min: 1 }).isString(),
    body('priority', 'Enter a valid priority').isNumeric(),
    body('status', 'Enter a valid status').isString().isLength({ min: 5 }),
    body('due', 'Enter a valid due date').isDate(),
], async (req, res) => {

    const task_id = req.params.id;
    if (!task_id) {
        return res.status(400).json({ success: false, message: "Task ID not provided" });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist." });
        }

        const { data, priority, status, due} = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(400).json({ success: false, message: "Task not found" });
        }

        if (task.email !== user.email) {
            return res.status(401).json({ success: false, message: "Not allowed" });
        }

        task.data = data || task.data;
        task.priority = priority || task.priority;
        task.status = status || task.status;
        task.due = due || task.due;
        await task.save();

        return res.status(200).json({ success: true, message: "Task updated" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Some error occured" });
    }
})

// Delete /delete/:id
Router.delete('/delete/:id', fetchUser, async (req, res) => {

    const task_id = req.params.id;
    if (!task_id) {
        return res.status(400).json({ success: false, message: "Task ID not provided" });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist." });
        }

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(400).json({ success: false, message: "Task not found" });
        }

        if (task.email !== user.email) {
            return res.status(401).json({ success: false, message: "Not allowed" });
        }

        await Task.findByIdAndDelete(req.params.id);

        return res.status(200).json({ success: true, message: "Task deleted" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Some error occured" });
    }
})


module.exports = Router;