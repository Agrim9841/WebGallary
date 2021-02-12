import React from 'react';
import { auth, storage, db } from './Firebase';

import { useHistory, useParams } from 'react-router-dom';

import './Dashboard.css';
import './Switch.css';

const Dashboard = () => {
	const history = useHistory();
	const { userid } = useParams();

	const handleLogout = () =>{
		auth.signOut().then(()=>{
			history.replace('/');
		});
	}

	const handleDeleteAccount = () =>{
		// db.collection("users").doc(userid).delete().then(function() {
		// 	storage.ref(userid).delete().then(function() {
		// 		auth.currentUser.delete().then(function() {
		// 			console.log("Document successfully deleted!");
		// 			history.replace('/');
		// 		}).catch(function(error) {
		// 			alert("Your account was not deleted.", error);
		// 		});
		// 	}).catch(function(error) {
		// 		alert("Your images were not deleted", error);
		// 	});
		// }).catch(function(error) {
		// 	alert("Your information was not deleted: ", error);
		// });
		
	}
	
	return(
		<div className='bodycover'>
			<div className='mainbody'>
				{/*<h3>Profile Details</h3>*/}

				<h3>Account Setting</h3>
				{/*
				<div className='dashboard-card'>
					<div className='dashboard-cardtitle'>
						<span style={{marginRight: "1rem"}}>Hide Account</span>
						<label className="switch">
							<input type="checkbox"/>
							<span className="slider round"></span>
						</label>
					</div>
					<div className='dashboard-cardbody'>
						This hides your account so that no other peron besides you can view your profile. This must set off to allow sharing of images and profile to 
						friends and families.
					</div>
				</div>

				<div className='dashboard-card'>
					<div className='dashboard-cardtitle'>
						<span style={{marginRight: "1rem"}}>Make Image Available For Download</span>
						<label className="switch">
							<input type="checkbox"/>
							<span className="slider round"></span>
						</label>
					</div>
					<div className='dashboard-cardbody'>
						This make your image available for download for users besides you. It's value does not matter if your account is hidden.
					</div>
				</div>
				*/}
				<div className='dashboard-bottom'>
					<button onClick={handleLogout}>Logout</button>
					{/*<button onClick={handleDeleteAccount}>Delete Account</button>*/}
				</div>
			</div>
		</div>
	)
}

export default Dashboard;