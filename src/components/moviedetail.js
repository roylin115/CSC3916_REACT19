import React, { useEffect, useState } from 'react';
import { fetchMovie } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Image } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom'; // Import useParams

const MovieDetail = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams(); // Get movieId from URL parameters
  const selectedMovie = useSelector(state => state.movie.selectedMovie);
  const loading = useSelector(state => state.movie.loading); // Assuming you have a loading state in your reducer
  const error = useSelector(state => state.movie.error); // Assuming you have an error state in your reducer
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  


  useEffect(() => {
    dispatch(fetchMovie(movieId));
  }, [dispatch, movieId]);

  const submitReview = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          movieId: movieId,
          rating: Number(rating),
          review: reviewText
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      window.location.reload(); // refresh page after submit
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };



  if (loading) {
    return <div>Loading....</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedMovie) {
    return <div>No movie data available.</div>;
  }

  return (
    <Card className="bg-dark text-dark p-4 rounded">
      <Card.Header>Movie Detail</Card.Header>
      <Card.Body className="card-body bg-white">


      {/* ADD REVIEW FORM */}
      <div style={{ marginTop: "20px" }}>
        <h5>Add Review</h5>

        <input
          type="number"
          min="1"
          max="5"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

        <br />

        <textarea
          placeholder="Write your review"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        <br />

        <button onClick={submitReview}>Submit</button>
      </div>
    </Card.Body>
      <ListGroup>
        <ListGroupItem>{selectedMovie.title}</ListGroupItem>
        <ListGroupItem>
          {selectedMovie.actors.map((actor, i) => (
            <p key={i}>
              <b>{actor.actorName}</b> {actor.characterName}
            </p>
          ))}
        </ListGroupItem>
        <ListGroupItem>
          <h4>
            <BsStarFill /> {selectedMovie.avgRating}
          </h4>
        </ListGroupItem>
      </ListGroup>
      <Card.Body className="card-body bg-white">
        {selectedMovie.movieReviews.map((review, i) => (
          <p key={i}>
            <b>{review.username}</b>&nbsp; {review.review} &nbsp; {' '}
            {review.rating}
          </p>
        ))}
      </Card.Body>
    </Card>
  );
};



export default MovieDetail;
