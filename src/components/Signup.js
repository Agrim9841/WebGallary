import React, { useState } from 'react';
import { useHistory, NavLink } from 'react-router-dom';

import { auth, db } from './Firebase';
import { useStateValue } from './StateProvider';

import { FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { MdLock } from 'react-icons/md';

import './Signup.css';

function Signup() {
	const history = useHistory();
	const [email, setEmail] = useState('');
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');

	const [ {}, dispatch ] = useStateValue();

	const handleSubmit = (event) => {
		event.preventDefault();

		auth.createUserWithEmailAndPassword(email,password).then((auth)=>{
			dispatch({
				type: 'SET_USER',
				user: auth.user.uid
			})
			var now = new Date();
			db.collection("users").doc(auth.user.uid).set({
				user: userName,
				libraries: [],
				images: [],
				hideAccount: false,
				imageAvailableForDownload: false,
				uploadLog: [],
				dateCreated: now,
			})
			.then(function() {
				if(auth){
					history.push(`/${auth.user.uid}`);
				}
			})
			.catch(function(error) {
				console.error("Error writing document: ", error);
			});	
		}).catch(error=>alert(error.message))
	}

	return (
		<div className="signup">
			<form onSubmit={handleSubmit} className="signup-form">
				<h2>Sign Up</h2>
				<div className="signup-formGroup">
					<label htmlFor="username"><FaUser /></label>
					<input type="text" name="username" value={userName}
					 onChange={(event)=>setUserName(event.target.value)}
					 placeholder="User Name"/>
				</div>
				<div className="signup-formGroup">
					<label htmlFor="email"><MdEmail /></label>
					<input type="email" name="email" value={email}
					 onChange={(event)=>setEmail(event.target.value)}
					 placeholder="Email"/>
				</div>
				<div className="signup-formGroup">
					<label htmlFor="password"><MdLock /></label>
					<input type="password" name="password" value={password}
					 onChange={(event)=>setPassword(event.target.value)}
					 placeholder="Password"/>
				</div>
				<button type="submit">Sign Up</button>
				<small>Already have an account? <NavLink to="./">Login</NavLink></small>
			</form>
		</div>
	);
}

export default Signup;