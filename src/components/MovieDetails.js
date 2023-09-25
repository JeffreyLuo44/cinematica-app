import React, { useState, useEffect } from 'react';

const MovieDetails = ({idToken, userId, movieId, handleToggleMovieDetails}) => {
    const apiUrlPrefix = process.env.REACT_APP_API_URL_PREFIX;
    const [movieTab, setMovieTab] = useState("overview");
    const [movieDetails, setMovieDetails] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [movieList, setMovieList] = useState([]);

    useEffect(() => {
    // Send movie id to server
    fetch(apiUrlPrefix + 'movies/' + movieId, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (response.ok) { // Check if the response status code is in the 2xx range
            return response.json().then(data => {
                data.genres = data.genres.join(", ");
                data.studios = data.studios.join(", ");
                setMovieDetails(data);
            });
        } else {
            alert(response.title);
        }
    })
    .catch(error => {
        console.error('Error during getting movie details', error);
    });
    if (userId !== '')
        getMovieList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (userId !== '')
            checkIfSubscribedMovie();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movieDetails, movieList]);

    const handleAddMovie = () => {
        if (userId === ''){
            alert("Sign in to subscribe!");
            return;
        }
        setIsSubscribed(true);
        // Send id data to server
        fetch(apiUrlPrefix + 'users/add-movie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({
            userId: userId,
            movieId: movieId,
            })
        })
        .then(response => {
            if (response.ok) { // Check if the response status code is in the 2xx range

            } else {
                return response.json().then(data => {
                    console.error('Request failed with status: ' + response.status);
                    alert(data.message);
                });
            }
        })
        .catch(error => {
            console.error('Error during reset password:', error);
        });
    }

    const handleRemoveMovie = () => {
        setIsSubscribed(false);
        // Send id data to server
        fetch(apiUrlPrefix + 'users/remove-movie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({
            userId: userId,
            movieId: movieId,
            })
        })
        .then(response => {
            if (response.ok) { // Check if the response status code is in the 2xx range

            } else {
                return response.json().then(data => {
                    console.error('Request failed with status: ' + response.status);
                    alert(data.message);
                });
            }
        })
        .catch(error => {
            console.error('Error during reset password:', error);
        });
    }

    const getMovieList =() => {
        fetch(apiUrlPrefix + 'users/movies/' + userId, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
        })
        .then(response => {
            if (response.ok) { // Check if the response status code is in the 2xx range
                return response.json().then(data => {
                setMovieList(data);
                });
            } else {
                alert(response.title);
            }
        })
        .catch(error => {
            console.error('Error during getting movie list', error);
        });
    }

    const checkIfSubscribedMovie = () => {
        let isMovieIdInArray = movieList.some(movie => movie.id === movieId);
        setIsSubscribed(isMovieIdInArray);
    }
    
    const changeTab = (e, tab) => {
        const tabs = document.getElementsByClassName("profile__tabs")[0].childNodes;
        tabs.forEach((item, index) => {
            if (item.classList.contains("tab--clicked")) {
                item.classList.remove("tab--clicked");
            }
        })
        e.target.classList.add("tab--clicked");
        setMovieTab(tab);
    }

    return (<div className="feed-container">
        <button className="back" onClick={() => handleToggleMovieDetails(false)}><i class='fa fa-arrow-left'></i>&emsp;Back</button>

        {movieDetails.length === 0 ? <div className="movie-details-unloaded">
            <p>Loading movie details...</p>
            <div id="loadingTimelineIndicator" class="loading__centre"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>
            </div>
            :
            <div className="movie-details">
            <div class="movie__heading-container">
                <div class="movie__banner">
                    <img src={movieDetails.banner} alt="Banner"/>
                </div>
                <div class="movie__poster">
                    <img src={movieDetails.poster} alt="Poster"/>
                </div>
                <div class="movie__main-details">
                    <p>{movieDetails.title} ({movieDetails.releaseYear})</p>
                    <p>Directed by {movieDetails.director}</p>
                    <p>{movieDetails.genres} &bull; {movieDetails.runningTime} mins</p>
                </div>  
                <div>
                    {isSubscribed === false ? <div className="movie__subscribe-button" onClick={() => handleAddMovie()}>Subscribe</div>: 
                    <div className="movie__subscribe-button--followed" onClick={() => handleRemoveMovie()}>Subscribed</div>}
                </div>
            </div>
            <div className="profile__tabs movie__tabs">
                <div onClick={(event) => changeTab(event, "overview")} className="tab--clicked">Overview</div>
                <div onClick={(event) => changeTab(event, "cast")}>Cast</div>
                <div onClick={(event) => changeTab(event, "details")}>Details</div>
            </div>  
            {movieTab === "overview" && <div>
                <p>{movieDetails.overview}</p>
            </div>}
            {movieTab === "cast" && <div class="movie__cast-container">
                { movieDetails.cast.map((actor, index) => (
                    <div className="movie__cast-member-container">
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
                    <p>{movieDetails.runningTime} mins</p>
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
        </div>}  
    </div>
    );
};
    
export default MovieDetails;