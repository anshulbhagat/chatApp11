const User = require("../models/userModel");
const Messages = require("../models/messageModel");
const bcrypt = require("bcrypt");
const {cloudinary} = require("../cloudinary");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.update = async (req, res, next) => {
  try{
    const data = req.body;
    const { _id } = data;
    const userUpdate = await User.findByIdAndUpdate(
      _id,
      data.values
    );
    const user= await User.findById({_id});
    return res.json({status: true , user});
  }catch (ex) {
    next(ex);
  }
};

module.exports.newPassword = async (req, res, next) => {
  try{
    const { newPassword, _id } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findByIdAndUpdate(
      _id,
      {
        password: hashedPassword,
      }
    );
    delete user.password;
    return res.json({ status: true, user });
  }catch (ex) {
    next(ex);
  }
};

module.exports.updateProfilePicture = async (req, res, next) => {
  try{
      const {id}= req.params;
      const image = req.file
      await User.findByIdAndUpdate(
        id,
        {
          profilePicture: image.path,
        }
      );
      const user= await User.findById({_id:id});
      return res.json({status: true , user});
  }catch(ex) {
    next(ex);
  }
}

module.exports.getAllUsers = async (req, res, next) => {
  try {

    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "profilePicture",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.deleteAccount = async (req, res, next) => {
  const { publicId, _id } = req.body;
  await Messages.deleteMany({
    users: {
      $all: [_id, ],
    },
  })
  await User.findByIdAndDelete({_id : _id});
  cloudinary.uploader.destroy(publicId, function(error,result) {
    console.log(result, error) })
    .catch(_err=> console.log("Something went wrong, please try again later."));
  onlineUsers.delete(_id);
  return res.status(200).send();
}

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};

