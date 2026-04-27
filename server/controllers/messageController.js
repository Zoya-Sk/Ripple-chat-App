const Conversation = require("../models/conversationModels");
const Message = require("../models/messageModels");
const User = require("../models/userModels");
const { io, getReceiverSocketId } = require("../socket/socket");

// create message
exports.createnewMsg = async(req,res)=>{
    try {
        // fetch data
        const { receiverId, message }  = req.body;
        const senderId = req.user.userId;

        // validation
        if(!receiverId || !message || !senderId){
            return res.status(400).json({
                success:false,
                message:"Couldn't Fetch Data!",
            })
        }

        // find conversation
        let conversation = await Conversation.findOne({
            members:{$all:[senderId,receiverId]}
        })

        // create conversation
        if(!conversation){
            conversation = await Conversation.create({
                members:[senderId,receiverId]
            })
        }

        const newMessage = new Message({
            senderId:senderId,
            receiverId:receiverId,
            message:message,
        })

        if(newMessage){
            conversation.messages.push(newMessage);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        // implement socket.io 
        const receiverSocketId = getReceiverSocketId(receiverId);

        if(receiverSocketId){
            io.to(receiverSocketId).emit("new-message",newMessage);
        }

        // return response
        return res.status(200).json({
            success:true,
            message:"Message sent Successfully!",
            newMessage:newMessage,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal Server Error!",
        })
    }
}

// get all conversations
exports.getAllMessages = async (req,res)=>{
    try {
        // fetch data
        const currentUserId = req.user.userId;
        const chatUserId = req.params.chatUserId;

        // validation
        if(!chatUserId || !currentUserId){
            return res.status(400).json({
                success:false,
                message:"Couldn't fetch userID!"
            })
        }

        const chatUserDetails = await User.findById(chatUserId);

        if(!chatUserDetails){
            return res.status(400).json({
                success:false,
                message:"User not Found!",
            })
        }

        const allMessages = await Conversation.findOne({
            members:{$all:[currentUserId,chatUserId]}
        }).populate("messages").populate("members","-password").exec();

        return res.status(200).json({
            success: true,
            message: "Successfully fetched all messages",
            allMessages: allMessages?.messages || [],
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error!",
        })
    }
}