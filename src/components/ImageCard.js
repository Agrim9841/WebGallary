import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IoMdExpand } from "react-icons/io";

import { storage } from './Firebase';

import './Home.css';

function ImageCard({ image, userid, imageid }){
	const [ url, setUrl ] = useState('');

	const history = useHistory();
	
	useEffect(()=>{
		if( userid && image.name){
			storage.ref(userid).child(image.name).getDownloadURL().then( imgUrl => {
				setUrl(imgUrl);
			});
		}

	}, [image]);

	const handleClick= () => {
		history.push(`/${userid}/image/${imageid}`);
	}

	return(
		<div className="imagecard">
			<div className="imagecard-overlay">
				<div className="imagecard-view" onClick={handleClick}>
					<IoMdExpand />
				</div>
			</div>
			<img src={url} alt="kimage" />
		</div>
	)
}

export default ImageCard;