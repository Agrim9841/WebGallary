import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { MdClose } from 'react-icons/md';
import { GrFormAdd } from 'react-icons/gr';
import { FaHourglassHalf } from 'react-icons/fa';

import { storage, db } from './Firebase';
import firebase from 'firebase';
import axios from 'axios';

import './Upload.css';

function Upload(){
	const [ uploading, setUploading ] = useState(false);
	const [ imageList, setImageList ] = useState([]);
	const [ imageNumber, setImageNumber ] = useState(0);
	const [ libraries, setLibraries ] = useState([]);
	const [ newLibraryName, setNewLibraryName ]= useState('');
	const [ addedLibraryName, setAddedLibraryName ]= useState('None');

	const { userid } = useParams();

	useEffect(()=>{
		gsap.set('#uploaddropdown', {opacity: 0, scaleY: 0, transformOrigin:"top left"});
		db.collection("users").doc(userid).get().then(function(doc) {
			if (doc.exists) {
				setLibraries(doc.data().libraries);
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		}).catch(function(error) {
			console.log("Error getting document:", error);
		});
	}, [])

	const handleImage = (e) => {
		setImageList(e.target.files);
		setImageNumber(e.target.files.length);
	}

	const handleNewLibraryName = (e) =>{
		setNewLibraryName(e.target.value);
	}

	const showDropdown = () => {
		gsap.to('#uploaddropdown', {opacity: 1, scaleY: 1, duration: 0.2});
	}

	const hideDropdown = () => {
		gsap.to('#uploaddropdown', {opacity: 0, scaleY: 0, duration: 0.2});
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
					setNewLibraryName('');
					setLibraries(dat => [...dat, newLib]);
				});
			}else{
				alert("Similar Named Library Alredy Exists");
			}
		}else{
			alert("Empty String");
		}
	}

	const handleAddedLibraryName = (e) => {
		setAddedLibraryName(e.target.innerText);
		hideDropdown();
	}
	
	const handleUpload = () => {
		setUploading(true);

		if(addedLibraryName !== 'None'){
			var newLibraryList = libraries.map((librarydat)=>{
				if(librarydat.name === addedLibraryName){
					var newlibrarydat = librarydat;
					newlibrarydat.noOfItems += imageList.length;
					return newlibrarydat;
				}else{
					return librarydat;
				}
			})
			db.collection("users").doc(userid).update({
				libraries: newLibraryList,
			}).then(()=>{
				setAddedLibraryName("None");
			}).catch((error)=>{
				alert(error);
			})
		}

		for(let i=0; i<imageList.length; i++){
			let file = imageList[i];
			let uploadTask = storage.ref(`${userid}/${file.name}`).put(file);
			uploadTask.on('state_changed',
				(snapshot)=>{
					//progress
				},(error) => {
					alert(error);
				},()=>{
					//complete

					const now = new Date();
					var newImage = {
						name: file.name,
						dateCreated: now,
						playlist: [addedLibraryName]
					}
					db.collection("users").doc(userid).update({
						images: firebase.firestore.FieldValue.arrayUnion(newImage),
					});

					if(imageNumber<=0){
						setImageNumber(0);
					}else{
						setImageNumber(prev=> prev-1);
					}
					
					if(i === imageList.length-1){
						setUploading(false);
						gsap.set('#uploaddropdown', {opacity: 0, scaleY: 0, transformOrigin:"top left"});
						setImageNumber(0);
					}
				});
		}
		
	}

	function getTags(){
		axios.post('http://localhost:5000/tags',null, {
			image: imageList[0],
			text: "hello",
		}).then(function(res){
			console.log(res);
		})
	}

	return(
		<div className='bodycover'>
			<div className='mainbody'>
				{
					uploading? 
					<div className='uploadingbox'>
						<h3 style={{ width: "100%"}}>This might take some time.</h3>
						<div className="upload-loading"><FaHourglassHalf /></div>
						<div>
							Uploading <br/>
							<span style={{ color: "crimson", fontSize: "1.3rem"}}>{imageNumber}</span> images left
						</div>
					</div>:
					<div className='uploadingbox'>
						<div className='uploadingbox-left'>
							<div style={{marginBottom: "1rem", marginTop: "0.3rem"}}>
								<span>Uploading Files:</span>
								<input type="file" name="file" className='choosefilebtn' onChange={handleImage} accept=".jpg, .jpeg, .png" multiple/>
							</div>
							<div>
								<span>Selected Library: </span>
								<div className='upload-addtoplaylist'>
									<span onClick={showDropdown} className="btn">{addedLibraryName}</span>
									<div className='dropdown' id='uploaddropdown'>
										<div className='close'><MdClose onClick={hideDropdown}/></div>
										<div className='dropdownItems' onClick={handleAddedLibraryName}>
											None
										</div>
										{libraries.map((library, index)=>{
											return(
												<div key={index} className='dropdownItems' onClick={handleAddedLibraryName}>
													{library.name}
												</div>
											)
										})}
										<div className='dropdownAdd'>
											<input type="text" placeholder="New Library Name" value={newLibraryName} onChange={handleNewLibraryName} />
											<span onClick={ handleNewLibrary }><GrFormAdd /></span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<button className='uploadbtn' onClick={handleUpload} disabled={imageNumber>0?false:true}
						 style={imageNumber>0? {backgroundColor: "red"}:{backgroundColor: "lightgrey"}}>Upload ({imageNumber})</button>
					</div>
				}
				<button onClick={getTags}>Hello</button>
			</div>
		</div>
	);
}

export default Upload;