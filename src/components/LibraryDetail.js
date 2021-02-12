import React, { useState, useEffect } from 'react';
import LibraryImageCard from './LibraryImageCard';

import { useHistory, useParams } from 'react-router-dom';
import { RiDeleteBinFill } from 'react-icons/ri';
import Masonry from 'react-masonry-css';

import { db } from "./Firebase";

import './Home.css';

const LibraryDetail = () => {
	const [ thisLibrary, setThisLibrary ] = useState({});
	const [ imageList, setImageList ] = useState([]);
	const [ libraryList, setLibraryList ] = useState([]);
	const [ libraryDate, setLibraryDate ] = useState([]);

	const { userid, libraryid } = useParams();

	const history = useHistory();

	const breakpointColumnsObj = {
	  default: 4,
	  1100: 3,
	  700: 2,
	  500: 1
	};

	useEffect(()=>{
		db.collection("users").doc(userid).get().then(function(doc) {
			if (doc.exists) {
				setThisLibrary(doc.data().libraries[libraryid]);
				setLibraryList(doc.data().libraries);
				setImageList(doc.data().images);

				let disdate = doc.data().libraries[libraryid].dateCreated.seconds;
				var date= new Date("1970 Jan 01");
				date.setSeconds(date.getSeconds() + disdate);
				setLibraryDate(date.toDateString());
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		}).catch(function(error) {
			console.log("Error getting document:", error);
		});
	}, []);

	const handleDeleteLibrary = () => {
		let newLibraryList = libraryList;
		newLibraryList.splice(libraryid,1);

		let newImageList = imageList;
		newImageList.forEach((imageData)=>{
			let inImage = false;
			let position = 0;
			imageData.playlist.forEach((dat, index)=>{
				if(dat.toLowerCase() === thisLibrary.name.toLowerCase()){
					inImage = true;
					position = index;
				}
			})
			if (inImage === true){
				imageData.playlist.splice(position, 1);
			}
		})

		db.collection("users").doc(userid).update({
			libraries: newLibraryList,
			images: newImageList
		}).then(()=>{
			history.replace(`/${userid}`);
		}).catch((error) =>{
			console.log(error);
		});
		
	}

	return(
		<div className='bodycover'>
			<div className='mainbody'>
				<div className='libdetail-card'>
					<div className='libdetail-cardtitle'>Library name: <span style={{ fontSize: "1.5rem", marginLeft: "1rem"}}>{thisLibrary.name}</span></div>
					<div className='libdetail-cardbody'>
						<table>
							<tbody>
								<tr>
									<td width="200px">Created:</td>
									<td>{libraryDate}</td>
								</tr>
								<tr>
									<td>Images count:</td>
									<td>{thisLibrary.noOfItems}</td>
								</tr>
							</tbody>
						</table>
						<div className='libdetail-cardbottom'><span onClick={handleDeleteLibrary} className="lib-deletebtn">Delete Library <RiDeleteBinFill /></span></div>
					</div>
				</div>
				{thisLibrary.noOfItems > 0?
					<Masonry breakpointCols={breakpointColumnsObj}
					className="my-masonry-grid libdetail-imagelist"
					columnClassName="my-masonry-grid_column">
						{imageList.map((imagedata, index)=>{
							let inList = false;
							if(imagedata.playlist){
								imagedata.playlist.forEach((lib)=>{
									if (lib === thisLibrary.name){
										inList = true;
									}
								})
							}
							
							if(inList === true){
								return(
									<LibraryImageCard key={index} imageid={index} userid={userid} image={imagedata} libraryid={libraryid} libraryname={thisLibrary.name}/>
								);
							}else{
								return null;
							}
						})}
					</Masonry>:
					<div className='noimg'>
						No Images in the Library
					</div>
				}
			</div>
		</div>
	);
}

export default LibraryDetail;