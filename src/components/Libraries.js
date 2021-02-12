import React, { useState, useEffect } from 'react';

import { useParams, useHistory } from 'react-router-dom';
import { db } from './Firebase';
import firebase from 'firebase';

import { BiPlus } from 'react-icons/bi';

import './Libraries.css';

const Libraries=()=>{
	const [newLibraryName, setNewLibraryName]= useState('');
	const [libraries, setLibraries]= useState([{}]);

	const history = useHistory();
	const { userid } = useParams();

	useEffect(()=> {
		db.collection("users").doc(userid).get().then(function(document) {
			if (document.exists) {
				setLibraries(document.data().libraries);
			} else {
				// document.data() will be undefined in this case
				console.log("No such document!");
			}
		}).catch(function(error) {
			console.log("Error getting document:", error);
		});
	}, []);

	const handleNewLibraryName= (e) =>{
		setNewLibraryName(e.target.value);
	}

	const handleNewLibrary = () => {
		if(newLibraryName){
			var similarName = false;
			libraries.forEach((library)=>{
				if(library.name.toLowerCase() === newLibraryName.toLowerCase()){
					similarName = true;
				}
			})
			if(similarName === false){
				setNewLibraryName('');
				const now = new Date();
				var newLib = {
					name: newLibraryName,
					dateCreated: now,
					noOfItems: 0,
					description: '',
				};
				
				db.collection("users").doc(userid).update({
					libraries: firebase.firestore.FieldValue.arrayUnion(newLib)
				}).then(()=>{
					setLibraries(dat => [...dat, newLib]);
				});
			}else{
				alert("Similar Named Library Alredy Exists");
			}
		}else{
			alert("Empty String");
		}
	}

	return(
		<div className='bodycover'>
			<div className='mainbody'>
				<div className="newLibraryBox">
					<input type="text" value={newLibraryName} onChange={handleNewLibraryName} placeholder='Enter New Library Name'/>
					<button onClick={handleNewLibrary}><BiPlus /></button>
				</div>
				<h3>My Libraries</h3>
				{libraries.length > 0?
					<div className="librarylist">
						{libraries.map((library, index)=><div key={index} className='librarycard' onClick={()=>history.push(`/${userid}/library/${index}`)}>
							<h2 className="librarycard-name">{library.name}</h2>
							<div className="librarycard-count">Total Items: {library.noOfItems}</div>
						</div>)}
					</div>:
					<div className="nolib">
						No Libraries Created
					</div>
				}
			</div>
		</div>
	)
};

export default Libraries;