import React, { useState, useEffect } from 'react';

import { createApi } from 'unsplash-js';

import { useParams } from 'react-router-dom';

import Masonry from 'react-masonry-css';

function UnsplashResult(){
	const unsplash = createApi({ accessKey: 'hhACRVDs9lDO-iauVmcxNK1nmZ2jWvYG4jPYINkeT8E' });

	const [ unsplashResult, setUnsplashResult ] = useState([]);

	const { searchval } = useParams();

	const breakpointColumnsObj = {
	  default: 4,
	  1100: 3,
	  700: 2,
	  500: 1
	};

	useEffect(()=>{
		unsplash.search.getPhotos({
		  query: searchval,
		  page: 1,
		  perPage: 15,
		}).then((result)=>{
			setUnsplashResult(result.response.results);
		});
	},[searchval]);

	return(
		
		<>
			<h3 style={{marginTop: "3rem",}}>Search result from UnSplash</h3>
			{unsplashResult.length > 0?
				<Masonry breakpointCols={breakpointColumnsObj}
				className="my-masonry-grid"
				columnClassName="my-masonry-grid_column">
					{unsplashResult.map((image, index) => {
						var link = image.links.html;
						return(
							<a href={link} key={index} target="_blank" rel="noopener noreferrer">
								<img src={image.urls.regular} alt="" />
							</a>
						)
					})}
				</Masonry>:
				<div className='noimg'>
					No Result in Unsplash
				</div>
			}
		</>
	)
}

export default UnsplashResult;