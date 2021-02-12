import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IoMdExpand } from "react-icons/io";
import { BiMinus } from "react-icons/bi";

import { storage, db } from './Firebase';

import './Home.css';

const LibraryImageCard = ({ image, userid, imageid, libraryid, libraryname }) => {
	const [ url, setUrl ] = useState('');

	const history = useHistory();
	
	useEffect(()=>{
		if( userid && image.name){
			storage.ref(userid).child(image.name).getDownloadURL().then( imgUrl => {
				setUrl(imgUrl);
			});
		}

	}, [image]);

	const handleClick = () => {
		history.push(`/${userid}/image/${imageid}`);
	}

	const handleRemoveFromLibrary = () => {

		db.collection("users").doc(userid).get().then(function(doc) {
			if (doc.exists) {
				var imageList = doc.data().images;
				var libraryList = doc.data().libraries;

				var newLibraryList = libraryList.map((lib, index)=>{
					if(index == libraryid){
						var newlib = lib;
						newlib.noOfItems -= 1;
						if(newlib.noOfItems < 0){
							newlib.noOfItems = 0;
						}
						return newlib;
					}else{
						return lib;
					}
				});

				var newImageList = imageList.map((img, index)=>{
					if(index == imageid){
						var newplaylist = img.playlist;
						var playlistpos = 0;
						newplaylist.forEach((playlist, pos)=>{
							if(playlist == libraryname){
								playlistpos = pos;
							}
						})
						newplaylist.splice(playlistpos, 1);
						img.playlist = newplaylist;
						return img;
					}else{
						return img;
					}
				});

				db.collection("users").doc(userid).update({
					images: newImageList,
					libraries: newLibraryList
				}).then(()=>{
					window.location.reload(false);
				})
			} else {
				console.log("No such document!");
			}
		}).catch(function(error) {
			console.log("Error getting document:", error);
		});
	}

	return(
		<div className="imagecard">
			<div className="imagecard-overlay">
				<div className="imagecard-view" onClick={handleClick}>
					<IoMdExpand />
				</div>
				<div className="imagecard-library" onClick={handleRemoveFromLibrary}>
					<BiMinus />
				</div>
			</div>
			<img src={url} alt="kimage" />
		</div>
	)
}

export default LibraryImageCard;