const { User, Article } = require("../models/index");
const utilError = require('./../config/errorHelper.js')


async function createUser(req, res, next) {
  try {

    const user = new User(req.body);
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.log('error');
    next(error);
  }
}

async function updateUser(req, res, next) {
  const userId = req.params.userId
  const { firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ _id: userId })
    if (!existingUser) {
      throw utilError.badRequest('User not exists');
    }
    if (firstName) {
      existingUser.firstName = firstName;
    }
    if (lastName) {
      existingUser.lastName = lastName;
    }

    await existingUser.save();
    return res.status(204).json(existingUser);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function getUser(req, res, next) {

  const userId = req.params.userId;

  try {
    const user = await User.findById(userId)
    const articles = await Article.find({ owner: userId });
    return res.status(200).json({ user, articles });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function deleteUser(req, res, next) {

  const userId = req.params.userId;

  try {
    const result = await User.findByIdAndDelete(userId)

    if (!result) {
      return res.status(400).json({ message: 'The user wasn`t found' })
    }

    await Article.deleteMany({ owner: userId });

    return res.status(204).json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function getUserArticles(req, res, next) {

  const userId = req.params.userId;

  try {
    const articles = await Article.find({ owner: userId });
    return res.status(200).json(articles);
  } catch (err) {
    console.log(err);
    next(err);
  }
}



module.exports = { createUser, updateUser, getUser, deleteUser, getUserArticles };