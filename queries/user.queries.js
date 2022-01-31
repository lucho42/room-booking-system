const User = require("../database/models/user.model");

exports.createUser = async (user) => {
  try {
    const hashedPassword = await User.hashPassword(user.password);
    const newUser = new User({
      username: user.username,
      company: user.company,
      local: {
        email: user.email,
        password: hashedPassword,
      },
    });
    return newUser.save();
  } catch (e) {
    throw e;
  }
};

exports.findUserPerEmail = (email) => {
  return User.findOne({ "local.email": email }).exec();
};

exports.findUserPerId = (id) => {
  return User.findById(id).exec();
};

exports.getUserMap = async () => {
  const userMap = new Map();
  const users = await User.find({}).exec();
  if (users) {
    users.forEach((user) => {
      userMap.set(user._id.toString(), {
        username: user.username,
        email: user.local.email,
        avatar: user.avatar,
      });
    });
  }
  return userMap;
};
