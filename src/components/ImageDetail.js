import React, { useState, useEffect } from 'react';

import { useParams, useHistory } from 'react-router-dom';
import { db, storage } from './Firebase';
import firebase from 'firebase';

import { MdClose } from 'react-icons/md';
import { RiDeleteBinFill } from 'react-icons/ri';
import { GrFormAdd } from 'react-icons/gr';
import { gsap } from 'gsap';

import './ImageDetail.css';

const ImageDetail = () => {
	const [ url, setUrl ] = useState('');
	const [ imageDetail, setImageDetail ] = useState({});
	const [ imageList, setImageList ] = useState([]);
	const [ imageDate, setImageDate ] = useState('');
	const [ libraries, setLibraries ] = useState([]);
	const [ newLibraryName, setNewLibraryName ]= useState('');

	const { userid, imageid } = useParams();

	const history = useHistory();

	useEffect(()=>{
		gsap.set('#imgdropdown', {opacity: 0, scaleY: 0, transformOrigin:"bottom left"});
		db.collection("users").doc(userid).get().then(function(doc) {
			if (doc.exists) {
				setImageList(doc.data().images);
				setImageDetail(doc.data().images[imageid]);
				setLibraries(doc.data().libraries);
				storage.ref(userid).child(doc.data().images[imageid].name).getDownloadURL().then( imgUrl => {
					setUrl(imgUrl);
				});

				let disdate = doc.data().images[imageid].dateCreated.seconds;
				var date= new Date("1970 Jan 01");
				date.setSeconds(date.getSeconds() + disdate);
				setImageDate(date.toDateString());
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		}).catch(function(error) {
			console.log("Error getting document:", error);
		});

	}, []);

	const showDropdown = () => {
		gsap.to('#imgdropdown', {opacity: 1, scaleY: 1, duration: 0.3});
	}

	const hideDropdown = () => {
		gsap.to('#imgdropdown', {opacity: 0, scaleY: 0, duration: 0.3});
	}

	const handleNewLibraryName = (e) =>{
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

	const handleAddToLibrary = (e) => {
		hideDropdown();
		var similarplaylist = false;
		var playlist = imageDetail.playlist;
		playlist.forEach(play=>{
			if( play.toLowerCase() === e.target.innerText.toLowerCase() ){
				similarplaylist = true;
			}
		})

		if(similarplaylist === false){
			let newLibraries = libraries.map((library)=>{
				if (e.target.innerText.toLowerCase() === library.name.toLowerCase()){
					library.noOfItems+=1;
				}
				return(library);
			});

			let newImageDetail = imageDetail;
			newImageDetail.playlist.push(e.target.innerText);

			let newImageList = imageList;
			newImageList[imageid] = newImageDetail;

			db.collection("users").doc(userid).update({
				libraries: newLibraries,
				images: newImageList
			}).then(()=>{
				setImageDetail(newImageDetail);
				setImageList(newImageList);
				alert("sucessfully added");
			}).catch((error)=>{
				alert(error);
			});
		}else{
			alert("already in library");
		}
	}

	const handleDeleteImage = () =>{
		var newImageList = imageList;
		newImageList.splice(imageid, 1);

		let newLibraries = libraries.map((library)=>{
			var playlist = imageDetail.playlist;
			playlist.forEach(play=>{
				if( play.toLowerCase() === library.name.toLowerCase() ){
					library.noOfItems-=1;
				}
			})
			return library;
		});

		db.collection("users").doc(userid).update({
			libraries: newLibraries,
			images: newImageList
		}).then(()=>{
			history.replace(`/${userid}`);
		}).catch((error)=>{
			alert(error);
		});
	}

	return(
		<div>
			<div className='imagedetail-imageContainer'>
				<div className="imagedetail-cover"></div>
				<img src={url} className='imagedetail-image' alt=''/>
			</div>
			<div className='bodycover' style={{ minHeight: "50vh" }}>
				<div className='mainbody'>
					<table style={{width: "100%"}}>
						<tbody>
							<tr>
								<td style={{width: "30%"}}>File Name: </td>
								<td style={{ overflow: "auto"}}>{imageDetail.name}</td>
							</tr>
							<tr>
								<td>File Created: </td>
								<td>{imageDate}</td>
							</tr>
						</tbody>
					</table>
					<div className="imagedetail-bottom">
						<div className='imagedetail-addtoplaylist'>
							<span onClick={showDropdown} className="btn">Add to Library</span>
							<div className='dropdown' id='imgdropdown'>
								<div onClick={hideDropdown} className='close'><MdClose /></div>
								{libraries.map((library, index)=>{
									return(
										<div key={index} className='dropdownItems' onClick={handleAddToLibrary}>
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
						{/*<div className='imagedetail-deletebtn'>Download <FaDownload /></div>*/}
						<div onClick={handleDeleteImage} className='imagedetail-deletebtn'><RiDeleteBinFill /></div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ImageDetail;