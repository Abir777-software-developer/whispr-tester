import expressAsyncHandler from "express-async-handler";
import { Message } from "../Models/MessageModel.js";
import { User } from "../Models/Usermodel.js";
import { Chat } from "../Models/chatModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const sendMessage = expressAsyncHandler(async (req, res) => {
  //3 thinfs to require while sending message
  //chatId
  //message content
  //sender
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    Chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("Chat");
    message = await User.populate(message, {
      path: "Chat.users",
      select: "name pic email",
    });
    // message = await message.populate({
    //   path: "Chat",
    //   populate: {
    //     path: "users",
    //     select: "name pic email",
    //   },
    // });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const allMessage = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ Chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("Chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const summarizeMessages = expressAsyncHandler(async (req, res) => {
  const { chatId, since } = req.body;

  if (!chatId || !since) {
    res.status(400);
    throw new Error("Please provide chatId and since timestamp");
  }

  const sinceDate = new Date(since);
  if (isNaN(sinceDate.getTime())) {
    res.status(400);
    throw new Error("Invalid date format for 'since' timestamp");
  }

  try {
    // 1. Fetch messages from other users since the lastSeen timestamp
    const messages = await Message.find({
      Chat: chatId,
      createdAt: { $gt: sinceDate },
      sender: { $ne: req.user._id }
    }).populate("sender", "name");


    if (messages.length === 0) {
      return res.json({ summary: "No new messages to summarize." });
    }

    // 2. Format messages for the AI prompt
    const messageContext = messages
      .map((m) => `${m.sender.name}: ${m.content}`)
      .join("\n");

    // 3. Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // (Optional debugging: List all models if you want to see what's available)
    // const models = await genAI.listModels();
    // console.log(models);

    const prompt = `
      Summarize the following chat conversation in 3-4 concise sentences. 
      Focus on key decisions, important topics, and any action items mentioned. 
      The messages are from a chat app called Whispr.
      
      Conversation:
      ${messageContext}
    `;

    // 4. Generate summary
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.json({ summary });
  } catch (error) {
    console.error("❌ Gemini API Error Detail:", error);

    // Help the user find the right model if it's a 404
    if (error.message.includes("404") || error.message.includes("not found")) {
      console.log("💡 TIP: Try checking which models are available to your key by visiting: https://aistudio.google.com/app/prompts/new");
    }

    res.status(400);
    throw new Error("Failed to generate summary: " + error.message);
  }
});



