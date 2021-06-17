const Clarifai = require('clarifai');

const app = new Clarifai.App({
  	apiKey: '6e0789995c7741e4bccbfe72b873b73d'
 });

const handleApi = (req, res) => {
	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data =>{
		res.json(data);
	})
	.catch(err => res.status(400).json('API not working'))
}

const handleImage = (req, res, db) => {
	const { id } = req.body;

	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries=>{
		res.json(entries);
	})
	.catch(err=> res.status(404).json('not found'));
}

module.exports = {
	handleImage,
	handleApi
}