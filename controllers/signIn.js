const handleSignIn = (db, bcrypt) => (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json('Incorrect form submission. Unable to register.');
	}
	db.select('email', 'hash').from('login')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				db.select('*').from('users')
					.where('email', '=', email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('Unable to retrieve user'))
			} else {
				res.status(400).json('Wrong login credentials');
			}
		})
		.catch(err => res.status(400).json('Wrong login credentials'))
}

module.exports = {
	handleSignIn: handleSignIn
}