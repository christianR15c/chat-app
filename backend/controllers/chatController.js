const asyncHandler = require("express-async-handler");
const Chat = require('../models/chatModels');
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body

    if (!userId) {
        console.log('UserId param not sent wiith request');
        return res.sendStatus(400)
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate('users', '-password').populate('latestMessage')

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name pic email'
    })

    if (isChat.length > 0) {
        res.json(isChat[0])
    } else {
        let chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id, userId]
        }
        try {
            const createdChat = await Chat.create(chatData)

            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', '-password')

            res.status(200).json(FullChat)
        } catch (error) {
            throw new Error(error.message)
            res.status(400)
        }
    }
})

const fetchChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage')
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, { path: 'latestMessage.sender', select: 'name pic email' })
                res.status(200).json(results)
            })
    } catch (error) {

    }
})

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).json({ message: 'Please fill all the fields' })
    }


    let users = JSON.parse(req.body.users)
    if (users.length < 2) {
        return res.status(400).json({ error: "more that 2 users are required to form a group of chat" })
    }

    users.push(req.user)

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            groupAdmin: req.user,
            users
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')

        res.status(200).json(fullGroupChat)

    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body

    const updatedChat = await Chat.findByIdAndUpdate(chatId, {
        chatName
    }, {
        new: true
    })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')

    if (!updatedChat) {
        res.status(404).json({ error: 'Chat Not Found!' })
    } else {
        res.status(200).json(updatedChat)
    }
})

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(added);
    }
});

const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(removed);
    }
});

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup }