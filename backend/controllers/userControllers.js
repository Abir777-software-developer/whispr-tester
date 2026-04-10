import expressAsyncHandler from "express-async-handler";
import { User } from "../Models/Usermodel.js";
import { genToken } from "../database/genToken.js";

export const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    //it will create a new filed for new user in database
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: genToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not created");
  }
});

export const authUser = expressAsyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name });

  if (user && (await user.matchpass(password))) {
    // console.log(user);
    // localStorage.setItem("userInfo", JSON.stringify(user));
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: genToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});
// /api/user?search=abir(request url)
export const allUsers = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).where("id").ne(req.user._id);
  res.send(users);
  // console.log(keyword);
});
