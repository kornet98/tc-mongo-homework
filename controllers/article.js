const { User, Article } = require("../models/index");


async function createArticle(req, res, next) {

	const ownerId = req.body.owner

	try {

		const existingUser = await User.findById(ownerId);
		if (!existingUser) {
			throw utilError.badRequest('User not exists');
		}

		const article = new Article(req.body);
		await article.save();

		existingUser.numberOfArticles++;
		await existingUser.save();

		res.status(201).json(article);
	} catch (error) {
		next(error);
	}
}

async function updateArticle(req, res, next) {
	const articleId = req.params.articleId
	const { title, subtitle, description, owner, category, createdAt, updatedAt } = req.body;

	try {

		const existingArticle = await Article.findOne({ _id: articleId })
		if (!existingArticle) {
			throw utilError.badRequest('Article not exists');
		}


		if (owner && owner !== existingArticle.owner) {

			//Determine the new owner, check if exist and increase the number of articles
			const nextOwner = await User.findById(owner);
			if (!nextOwner) {
				throw utilError.badRequest('Invalid owner id');
			}
			nextOwner.numberOfArticles++;
			await nextOwner.save();

			//Determine the previous owner and decrease number of articles
			const previousOwner = await User.findById(existingArticle.owner);
			previousOwner.numberOfArticles--;
			await previousOwner.save();


			existingArticle.owner = owner;

		}

		if (title) {
			existingArticle.title = title;
		}
		if (subtitle) {
			existingArticle.subtitle = subtitle;
		}
		if (description) {
			existingArticle.description = description;
		}
		if (category) {
			existingArticle.category = category;
		}
		if (createdAt) {
			existingArticle.createdAt = createdAt;
		}
		if (updatedAt) {
			existingArticle.updatedAt = updatedAt;
		}

		await existingArticle.save();
		return res.status(200).json(existingArticle);
	} catch (err) {
		console.log(err);
		next(err);
	}
}

async function getArticles(req, res, next) {
	try {
		const articles = await Article
			.find(req.body)
			.populate('owner')

		return res.status(200).json(articles)
	} catch (err) {
		console.log(err);
		next(err);
	}
}

async function deleteArticle(req, res, next) {

	const articleId = req.params.articleId

	try {

		const existingArticle = await User.findById(articleId)
		if (!existingArticle) {
			throw utilError.badRequest('Article not exists');
		}

		//Determine the owner and decrease number of articles
		const owner = await User.findById(existingArticle.owner);
		owner.numberOfArticles--;
		await owner.save();


		await Article.deleteOne(existingArticle);

		return res.status(204).json(result);
	} catch (err) {
		console.log(err);
		next(err);
	}
}




module.exports = { createArticle, updateArticle, getArticles, deleteArticle };