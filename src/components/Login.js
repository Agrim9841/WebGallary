import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { auth } from './Firebase';
import { useStateValue } from './StateProvider';

import { MdEmail } from 'react-icons/md';
import { MdLock } from 'react-icons/md';

import './Login.css';

function Login() {
	const history = useHistory();

	const [{}, dispatch] = useStateValue();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	useEffect(() => {
		//will run once at the start
		auth.onAuthStateChanged(authUser=>{
			
			if (authUser){
				dispatch({
					type: 'SET_USER',
					user: authUser.uid
				})
				history.replace(`./${authUser.uid}`);
			}else{
				dispatch({
					type: 'SET_USER',
					user: null
				})
			}

		})

	}, [])

	const handleLogin= (event) => {
		event.preventDefault();
		auth.signInWithEmailAndPassword(email,password).then((auth)=>{
			dispatch({
				type: 'SET_USER',
				user: auth.user.uid
			})
			if(auth){
				history.push(`./${auth.user.uid}`);
			}
		}).catch(error=>alert(error.message))
	}

	return (
		<div className="login">
			<form onSubmit={handleLogin} className="login-form">
				<h2>Sign In</h2>
				<div className="login-formGroup">
					<label htmlFor="email"><MdEmail /></label>
					<input type="email" name="email" value={email}
					 onChange={(event)=>setEmail(event.target.value)}
					 placeholder="Email"/>
				</div>
				<div className="login-formGroup">
					<label htmlFor="password"><MdLock /></label>
					<input type="password" name="password" value={password}
					 onChange={(event)=>setPassword(event.target.value)}
					 placeholder="Password"/>
				</div>
				<button type="submit">Login</button>
			</form>
			<div className="login-separator">
			</div>
			<div className="login-extra">
				<p> Get free storage for saving images. </p>
				<p> Share your pictures and image-library with your friends and families. </p>
				<p> Get maximun security for your images and data. </p>
				<Link to='/signup'><h2>Signup for Free</h2></Link>
			</div>
		</div>
	);
}

export default Login;