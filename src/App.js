import React, { useEffect } from 'react';
import './App.css';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Upload from './components/Upload';
import Libraries from './components/Libraries';
import ImageDetail from './components/ImageDetail';
import LibraryDetail from './components/LibraryDetail';
import Dashboard from './components/Dashboard';
import SearchResultPage from './components/SearchResultPage';

import { useStateValue } from './components/StateProvider';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import firebase from 'firebase';

function App() {
	const [{ user }, dispatch] = useStateValue();
	
	useEffect(() => {
		if(!user){
			var curuser = firebase.auth().currentUser;
			if( curuser ){
				dispatch({
					type: 'SET_USER',
					user: curuser.uid
				})
			}
		}

	}, [])

	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact={true}>
					<Login />
				</Route>
				<Route path="/signup" exact={true}>
					<Signup />
				</Route>

				
				<Route path="/:userid/" exact={true}>
					<Navbar />
					<Home />
				</Route>
				<Route path="/:userid/upload" exact={true}>
					<Navbar />
					<Upload />
				</Route>
				<Route path="/:userid/libraries" exact={true}>
					<Navbar />
					<Libraries />
				</Route>
				<Route path="/:userid/library/:libraryid" exact={true}>
					<Navbar />
					<LibraryDetail />
				</Route>
				<Route path="/:userid/image/:imageid" exact={true}>
					<Navbar />
					<ImageDetail />
				</Route>
				<Route path="/:userid/dashboard" exact={true}>
					<Navbar />
					<Dashboard />
				</Route>
				<Route path="/:userid/search/:searchval" exact={true}>
					<Navbar />
					<SearchResultPage />
				</Route>
			</Switch>
		</BrowserRouter>
	);
}

export default App;
