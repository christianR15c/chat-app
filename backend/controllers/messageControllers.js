const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModels");
const Message = require('../models/messageModel');
const User = require("../models/userModel");

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body

    if (!content || !chatId) {
        console.log('Invalid data passed into the request')
        return res.status(400).send('Invalid data passed into the request')
    }

    let newMessage = {
        sender: req.user._id,
        content,
        chat: chatId
    }

    try {
        let message = await Message.create(newMessage)
        message = await message.populate('sender', 'name pic')
        message = await message.populate('chat')
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email'
        })
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message })
        return res.status(200).json({ message })
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }

})

const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate('sender', 'name pic email').populate('chat')
        res.status(200).json(messages)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

module.exports = { sendMessage, allMessages }