import React, { useState, useEffect } from 'react';
import './Navbar.css';

import { BiSearch } from "react-icons/bi";
import { RiUploadCloud2Fill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import gsap from 'gsap';

import { db, auth } from './Firebase';
import { useStateValue } from './StateProvider';
import { useParams, useHistory } from 'react-router-dom';
import Logo from './wg_logo.png';

function Navbar(){
	const [ userName, setUserName ] = useState(' ');
	const [ searchText, setSearchText ] = useState('');
	const [ sideopen, setSideopen ] = useState(false);

	const [{ search }, dispatch] = useStateValue();

	const { userid } = useParams();
	const history = useHistory();

	useEffect(()=> {
		gsap.set(".slidebar", {x: "-100%"})
		setSearchText( search );
		db.collection("users").doc(userid).get().then(function(document) {
			if (document.exists) {
				setUserName(document.data().user[0]);
			} else {
				// document.data() will be undefined in this case
				console.log("No such document!");
			}
		}).catch(function(error) {
			console.log("Error getting document:", error);
		});
	}, []);

	const handleLogout = () => {
		auth.signOut().then(()=>{
			history.replace('/');
		});
	}

	const handleSearchTect = (e) => {
		setSearchText(e.target.value);
	}

	const closeSlidebar = () => {
		setSideopen(false);
		gsap.to(".slidebar", { x: "-100%", duration: 0.5 });
	}

	const openSlidebar = () => {
		setSideopen(true);
		gsap.to(".slidebar", { x: "0%", duration: 0.5 });
	}

	const handleSearch = (e) => {
		e.preventDefault();
		if(sideopen===true){
			closeSlidebar();
		}
		if( searchText !== ''){
			dispatch({
				type: 'SET_SEARCH_ITEM',
				search: searchText
			})
			history.push(`/${userid}/search/${searchText}`);
		}
	}

	return(
		<nav className="navcover">
			<div className="navbar">
				<div className="hamburger" onClick={openSlidebar}>
					<GiHamburgerMenu />
				</div>
				<img src={Logo} alt="" onClick={()=> history.push(`/${userid}`)} className="navicon"/>
				<div className="navright">
					<form className="searchform" onSubmit={ handleSearch }>
						<input className="navbar-searchbar" type="text" value={searchText} onChange={ handleSearchTect } placeholder="Search Library or Image" />
						<button type="submit"><BiSearch /></button>
					</form>
					<div className="navbar-circle navbar-more">
						<span className="navbar-profile">{userName}</span>
						<div className='dropdown' id="navbarDropdown">
							<span onClick={()=> history.push(`/${userid}`)} className="dropdownitems">Home</span>
							<span onClick={()=> history.push(`/${userid}/dashboard`)} className="dropdownitems">My Dashboard</span>
							<span onClick={()=> history.push(`/${userid}/libraries`)} className="dropdownitems">My Libraries</span>
							<span onClick={handleLogout} className="dropdownitems navlogout">Logout</span>
						</div>
					</div>
					<span onClick={()=> history.push(`/${userid}/upload`)} className='navuploadbtn'>
						Upload <RiUploadCloud2Fill style={{ marginLeft: "0.2rem"}}/>
					</span>
				</div>
			</div>
			<div className="slidebar">
				<div className="close-slidebar" onClick={closeSlidebar}><MdClose /></div>
				<div className="slidebar-body">
					<form className="searchform" onSubmit={ handleSearch }>
						<input className="navbar-searchbar" type="text" value={searchText} onChange={ handleSearchTect } placeholder="Search Library or Image" />
						<button type="submit"><BiSearch /></button>
					</form>
					<div className="slidebar-navitem" onClick={() => {
						closeSlidebar();
						history.push(`/${userid}`);
					}}>Home</div>
					<div className="slidebar-navitem" onClick={() => {
						closeSlidebar();
						history.push(`/${userid}/dashboard`);
					}}>My Dashboard</div>
					<div className="slidebar-navitem" onClick={() => {
						closeSlidebar();
						history.push(`/${userid}/libraries`);
					}}>My Libraries</div>
					<div className="slidebar-navitem" onClick={() => {
						closeSlidebar();
						history.push(`/${userid}/upload`)
					}}>Upload Photos</div>
					<div className="slidebar-navitem" onClick={handleLogout}>Logout</div>
				</div>
			</div>
		</nav>
	)
}

export default Navbar;