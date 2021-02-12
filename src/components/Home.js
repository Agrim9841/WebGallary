import React, { useState, useEffect } from 'react';
import ImageCard from './ImageCard';

import { db } from './Firebase';
import { useParams, useHistory } from 'react-router-dom';

import Masonry from 'react-masonry-css';

import './Home.css';

function Home(props){
	const [ imageList, setImageList ] = useState([]);

	const { userid } = useParams();
	const history = useHistory();

	const breakpointColumnsObj = {
	  default: 4,
	  1100: 3,
	  700: 2,
	  500: 1
	};

	useEffect(()=> {
		db.collection("users").doc(userid).get().then(function(doc) {
			if (doc.exists) {
				setImageList(doc.data().images);
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		}).catch(function(error) {
			console.log("Error getting document:", error);
		});
	}, []);

	return(
		<div className="bodycover">
			<div className="mainbody home">
				<h2>Your Images</h2>
				{imageList.length > 0?
					
					<Masonry breakpointCols={breakpointColumnsObj}
					className="my-masonry-grid"
					columnClassName="my-masonry-grid_column">
						{imageList.map((image, index)=>{
							return(
								<div className="grid-item" key={index}>
									<ImageCard imageid={index} userid={userid} image={image}/>
								</div>
							)
						})}
					</Masonry>
					:
					<div className="noimg">
						<h1>No Image Uploaded Yet</h1>
						<div className='redirectUpload' onClick={()=> history.push(`/${userid}/upload`)}>Click Here to upload New Images</div>
					</div>
				}
			</div>
		</div>
	)
}

export default Home;