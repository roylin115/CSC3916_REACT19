import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies, setMovie } from "../actions/movieActions";
import { Link } from 'react-router-dom';
import { Image, Nav, Carousel, Form, Button } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';

function MovieList() {
    const dispatch = useDispatch();
    const movies = useSelector(state => state.movie.movies);

    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const memoizedMovies = useMemo(() => movies, [movies]);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        dispatch(fetchMovies());
    }, [dispatch]);

    const handleSelect = (selectedIndex) => {
        const list = isSearching ? searchResults : memoizedMovies;
        dispatch(setMovie(list[selectedIndex]));
    };

    const handleClick = (movie) => {
        dispatch(setMovie(movie));
    };

    const searchMovies = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${apiUrl}/search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({ query })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Search failed");
            }

            setSearchResults(data);
            setIsSearching(true);
        } catch (err) {
            console.error("Error searching movies:", err);
        }
    };

    const resetSearch = () => {
        setIsSearching(false);
        setSearchResults([]);
        setQuery('');
    };

    if (!memoizedMovies) {
        return <div>Loading....</div>;
    }

    const displayMovies = isSearching ? searchResults : memoizedMovies;

    return (
        <div>

            {/* 🔍 SEARCH UI */}
            <div className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Search movies or actors..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button className="mt-2 me-2" onClick={searchMovies}>
                    Search
                </Button>
                {isSearching && (
                    <Button variant="secondary" onClick={resetSearch}>
                        Reset
                    </Button>
                )}
            </div>

            {/* 🎬 MOVIE DISPLAY */}
            <Carousel onSelect={handleSelect} className="bg-dark text-light p-4 rounded">
                {displayMovies.map((movie) => (
                    <Carousel.Item key={movie._id}>
                        <Nav.Link
                            as={Link}
                            to={`/movie/${movie._id}`}
                            onClick={() => handleClick(movie)}
                        >
                            <Image className="image" src={movie.imageUrl} thumbnail />
                        </Nav.Link>
                        <Carousel.Caption>
                            <h3>{movie.title}</h3>
                            <BsStarFill /> {movie.avgRating || "N/A"} &nbsp;&nbsp; {movie.releaseDate}
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
}

export default MovieList;