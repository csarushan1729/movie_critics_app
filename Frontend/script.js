const APILINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=41ee980e4b5f05f6693fda00eb7c4fd4&page=1';
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=41ee980e4b5f05f6693fda00eb7c4fd4&query=";
const mongo_atlas='mongodb+srv://tejasrisaladi555:Tejasri@cluster0.kekfr.mongodb.net/movies'
const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");
const movieDetailsSection = document.getElementById("movieDetails");

returnMovies(APILINK);



search.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchMovies();
  }
});

function returnMovies(url) {
  fetch(url).then(res => res.json())
    .then(function (data) {
      console.log(data.results);
      data.results.forEach(element => {
        const div_card = document.createElement('div');
        div_card.setAttribute('class', 'card');

        const image = document.createElement('img');
        image.setAttribute('class', 'thumbnail');
        image.setAttribute('id', 'image');
        image.src = IMG_PATH + element.poster_path;

        const title = document.createElement('h3');
        title.setAttribute('id', 'title');
        title.innerHTML = `${element.title}`;

        div_card.appendChild(image);
        div_card.appendChild(title);
        main.appendChild(div_card);

        div_card.addEventListener('click', function () {
          displayMovieDetails(element); 
        });
      });
    });
}

function searchMovies() {
  main.innerHTML = '';  
  const searchItem = search.value;
  if (searchItem) {
    returnMovies(SEARCHAPI + searchItem);
    search.value = "";
  }
}

function displayMovieDetails(movie) {
  movieDetailsSection.style.display = 'block'; 
  main.style.display = 'none';  

  document.getElementById("movieTitle").innerText = movie.title;
  document.getElementById("moviePoster").src = IMG_PATH + movie.poster_path;


  fetchReviews(movie.id,movie.title);
}

function goBackToMovies() {
  movieDetailsSection.style.display = 'none';
  main.style.display = 'block';
}
function fetchReviews(movieID,movieTitle) {
  fetch(`https://movies-tw09.onrender.com/review/${movieID}`)
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        addReview(movieID,movieTitle) 
      } else {
        displayReviews(data, movieID);
      }
    })
    .catch(error => {
      console.error('Error fetching reviews:', error);
    });
}

function addReview(movieID, movieTitle) {
  const reviewText = prompt('Enter your review for this movie:');
  if (reviewText) {
    const reviewData = {
      movieName: movieTitle,
      movieID: movieID,
      review: reviewText,
    };

    fetch(`https://movies-tw09.onrender.com/review/${movieID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Review added:', data);
        alert('Review added successfully!');
        fetchReviews(movieID, movieTitle);  
      })
      .catch(error => {
        console.error('Error adding review:', error);
      });
  }
}

function displayReviews(reviews, movieID) {
  const reviewSection = document.getElementById("reviewsSection");
  reviewSection.innerHTML = '';  

  reviews.forEach(review => {
    const reviewCard = document.createElement('div');
    reviewCard.classList.add('reviewCard');

    const movieName = document.createElement('h4');
    movieName.innerText = `Movie: ${review.movieName}`;
    movieName.style.fontSize = "20px";  
    movieName.style.fontWeight = "bold";  
    movieName.style.color = "#333";  
    movieName.style.marginBottom = "10px";  
    movieName.style.textAlign = "center";  

    const reviewText = document.createElement('p');
    reviewText.innerText = `Review: ${review.review}`;
    reviewText.style.fontSize = "16px";  
    reviewText.style.color = "#555";  
    reviewText.style.lineHeight = "1.6";  
    reviewText.style.marginBottom = "15px"; 
    reviewText.style.padding = "10px";  
    reviewText.style.backgroundColor = "#f9f9f9";  
    reviewText.style.borderRadius = "5px";  
    reviewText.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";

    const editButton = document.createElement('button');
    editButton.innerText = "Edit";
    editButton.style.padding = "12px 24px";  
    editButton.style.backgroundColor = "#4CAF50"; 
    editButton.style.color = "white";
    editButton.style.border = "none";
    editButton.style.borderRadius = "8px";  
    editButton.style.cursor = "pointer";
    editButton.style.fontSize = "16px";  
    editButton.style.marginTop = "10px";  
    editButton.style.marginRight = "10px";  
    editButton.onmouseover = function() {
      editButton.style.backgroundColor = "#45a049";  
    };
    editButton.onmouseout = function() {
      editButton.style.backgroundColor = "#4CAF50";  
    };
    editButton.onclick = () => editReview(review, movieID);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = "Delete";
    deleteButton.style.padding = "8px 16px";
    deleteButton.style.backgroundColor = "#f44336";  
    deleteButton.style.color = "white";
    deleteButton.style.border = "none";
    deleteButton.style.borderRadius = "5px";
    deleteButton.style.cursor = "pointer";
    deleteButton.style.fontSize = "14px";
    deleteButton.style.marginTop = "5px";
    deleteButton.onmouseover = function() {
      deleteButton.style.backgroundColor = "#e53935";  
    };
    deleteButton.onmouseout = function() {
      deleteButton.style.backgroundColor = "#f44336"; 
    };

    deleteButton.onclick = () => deleteReview(review, movieID);

    reviewCard.appendChild(movieName);
    reviewCard.appendChild(reviewText);
    reviewCard.appendChild(editButton);
    reviewCard.appendChild(deleteButton);

    reviewSection.appendChild(reviewCard);
  });
}

function editReview(review, movieID) {
  const newReview = prompt('Edit your review:', review.review);
  if (newReview && newReview !== review.review) {
    fetch(`https://movies-tw09.onrender.com/review/${movieID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ review: newReview }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Review updated:', data);
      alert('Review updated successfully!');
      fetchReviews(movieID); 
    })
    .catch(error => {
      console.error('Error updating review:', error);
    });
  }
}

function deleteReview(review, movieID) {
  const confirmDelete = confirm('Are you sure you want to delete this review?');
  if (confirmDelete) {
    fetch(`https://movies-tw09.onrender.com/review/${movieID}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      console.log('Review deleted:', data);
      alert('Review deleted successfully!');
      fetchReviews(movieID); 
    })
    .catch(error => {
      console.error('Error deleting review:', error);
    });
  }
}
