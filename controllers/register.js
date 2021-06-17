const handleRegister = (req, res, db, bcrypt) =>{
	const {email, password, name} = req.body;

	if(!email || !password || !name){
		return res.status(400).json('incorrect form submission');
	}
	const hash = bcrypt.hashSync(password)
	// bcrypt.hash(password, null, null, function(err, hash){
	// 	//console.log(hash);
	// })

	db.transaction(trx =>{
		trx.insert({
			hash:hash,
			email:email
		})
		.into('login')
		.returning('email')
		.then(loginEmail =>{
			return trx('users')
			.returning('*')
			.insert({
				email: email,
				name: name,
				joined: new Date()
			})
			.then(response=>{
				res.json(response[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	
	.catch(err=> res.status(404).json('unable to register'))
	/*res.json(database.users[database.users.length-1]);*/
}

module.exports = {
	handleRegister: handleRegister
}