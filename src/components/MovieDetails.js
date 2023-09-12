import React, { useState, useEffect } from 'react';
// Oppenheimer movie id: 872585
// Spider-Man: Across the Spiderverse movie id: 569094
const MovieDetails = ({movieId, handleToggleMovieDetails}) => {
    let startingPath = "https://localhost:53134/images/movies/";
    const [movieTab, setMovieTab] = useState("overview");
    const [movieDetails, setMovieDetails] = useState([]);
    // There will be a fetch request that gets the movie details by id.
    useEffect(() => {
        // Send movie id to server
        fetch('https://localhost:53134/api/movies/' + movieId, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (response.ok) { // Check if the response status code is in the 2xx range
                return response.json().then(data => {
                    setMovieDetails(data);
                });
            } else {
                alert(response.title);
            }
        })
        .catch(error => {
            console.error('Error during getting movie details', error);
        });
   
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    return (
    <div className="feed-container">
        <button className="back" onClick={() => handleToggleMovieDetails(false)}><i class='fa fa-arrow-left'></i>&emsp;Back</button>
        <div class="movie__heading-container">
            <div class="movie__banner">
                <img src={startingPath + movieDetails.banner} alt="Banner"/>
            </div>
            <div class="movie__poster">
                <img src={startingPath + movieDetails.poster} alt="Poster"/>
            </div>
            <div class="movie__main-details">
                <p>{movieDetails.title} ({movieDetails.releaseYear})</p>
                <p>Directed by {movieDetails.director}</p>
                <p>{movieDetails.genres} &bull; {movieDetails.runningTime} mins</p>
            </div>  
        </div>
        <div className="profile__tabs movie__tabs">
            <div onClick={() => setMovieTab("overview")}>Overview</div>
            <div onClick={() => setMovieTab("cast")}>Cast</div>
            <div onClick={() => setMovieTab("details")}>Details</div>
        </div>  
        {movieTab === "overview" && <div>
            <p>{movieDetails.overview}</p>
        </div>}
        {movieTab === "cast" && <div class="movie__cast-container">
            { movieDetails.cast.map((actor, index) => (
                <div className="movie__cast-member-container">
                    <div className="cinematica__profile-circle"></div>
                    <div>
                        <p className="post-author"><span>{actor.name}</span><br/>{actor.role}</p>
                    </div>
                </div>
            ))}
        </div>}
        {movieTab === "details" && <div>
            <div className="movie__details-item-container">
                <p>Release Date</p>
                <p>{movieDetails.releaseDate}, {movieDetails.releaseYear}</p>
            </div>
            <div className="movie__details-item-container">
                <p>Genres</p>
                <p>{movieDetails.genres}</p>
            </div>
            <div className="movie__details-item-container">
                <p>Runtime</p>
                <p>{movieDetails.runningTime}</p>
            </div>
            <div className="movie__details-item-container">
                <p>Language</p>
                <p>{movieDetails.language}</p>
            </div>
            <div className="movie__details-item-container">
                <p>Studios</p>
                <p>{movieDetails.studios}</p>
            </div>
        </div>}    
    </div>
    );
};
    
export default MovieDetails;