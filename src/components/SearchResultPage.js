import React, { useState, useEffect } from 'react';
import ImageCard from './ImageCard';
import UnsplashResult from './UnsplashResult';

import { useParams, useHistory } from 'react-router-dom';

import { useStateValue } from './StateProvider';
import { db } from './Firebase';

import Masonry from 'react-masonry-css';

import './Home.css';

const SearchResultPage = () => {
	const [ resultImages, setResultImages ] = useState([]);
	const [ resultLibraries, setResultLibraries ] = useState([]);

	const [{ search }, dispatch] = useStateValue();

	const { userid, searchval } = useParams();

	const history = useHistory();

	const breakpointColumnsObj = {
	  default: 4,
	  1100: 3,
	  700: 2,
	  500: 1
	};

	useEffect(()=>{
		if(searchval !== search){
			dispatch({
				type: 'SET_SEARCH_ITEM',
				search: searchval
			})
		}
		db.collection("users").doc(userid).get().then(function(doc) {
			setResultLibraries([]);
			setResultImages([]);
			if (doc.exists) {
				if(searchval){
					doc.data().libraries.forEach((library, index)=>{
						var libname = library.name;
						if(libname.toLowerCase().includes(searchval.toLowerCase())){
							var result = library;
							result.index = index;
							setResultLibraries(lib=>[...lib, result])
						}
					});

					doc.data().images.forEach((image, index) => {
						var imgname = image.name;
						if(imgname.toLowerCase().includes(searchval.toLowerCase())){
							var result = image;
							result.index = index;
							setResultImages(img=>[...img, result])
						}
					});
				}
				
			} else {
				console.log("No such document!");
			}
		}).catch(function(error) {
			console.log("Error getting document:", error);
		});
	}, [search]);

	return(
		<div className='bodycover'>
			<div className='mainbody'>
				<h2>SearchResult for "<i>{ search }</i>"</h2>
				{resultLibraries.length > 0?
					<div className='searchlibrarylist'>
						{resultLibraries.map((library, index) => {
							return(
								<div key={index} className='librarycard' onClick={()=> history.push(`/${userid}/library/${library.index}`)}>
									{library.name}
								</div>
							)
						})}
					</div>:
					null
				}
				{resultImages.length > 0?
					<Masonry breakpointCols={breakpointColumnsObj}
					className="my-masonry-grid"
					columnClassName="my-masonry-grid_column">
						{resultImages.map((image, index) => {
							return(
								<ImageCard key={index} imageid={image.index} userid={userid} image={image}/>
							)
						})}
					</Masonry>:
					<div className='noimg'>
						No Image Result in your gallary
					</div>
				}
				<UnsplashResult />
			</div>
		</div>
	);
}

export default SearchResultPage;