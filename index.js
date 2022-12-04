const formEl = document.getElementById('form')
const searchInput = document.getElementById('search-input')
const moviesContainer = document.getElementById('movies-container')
let requestUrl = ''
let moviesHtml = ''
let moviesArray = []
let moviesArrayDetailed = []
let watchlist = JSON.parse(localStorage.getItem('watchlist') || "[]")

formEl.addEventListener('submit', (e)=>{
    e.preventDefault()
    let searchString = searchInput.value
    
    requestUrl = `https://www.omdbapi.com/?s=${searchString}&type=movie&apikey=6a616cc4`
    fetch(requestUrl)
        .then(res => res.json())
        .then(data => {
            moviesHtml = ''
            if(data.Response == "False"){
                renderApology()
            }else {
                moviesArray = data.Search
                for(let movie of moviesArray){
                    getMovieDetails(movie.imdbID)
                }
            }
        })
})

document.addEventListener('click', (e)=>{
    if(e.target.dataset.id){
        const targetMovieObj = moviesArrayDetailed.filter(movie => movie.imdbID === e.target.dataset.id)[0]
        if(!watchlist.includes(targetMovieObj)){
            watchlist.push(targetMovieObj)
        }
        localStorage.setItem('watchlist', JSON.stringify(watchlist))
    }
})

function getMovieDetails(movieId){
    requestUrl = `https://www.omdbapi.com/?i=${movieId}&type=movie&apikey=6a616cc4`
    fetch(requestUrl)
        .then(res => res.json())
        .then(data => {
            moviesArrayDetailed.push(data)
            updateResultsHtml(data)
            renderResults()
        })
}

function updateResultsHtml(movie){

        moviesHtml += `
        <div class="movie">
            <div class="movie-poster">
                <img src=${movie.Poster}  alt="movie-poster"> 
            </div>
            <div class="movie-body">
                <div class="movie-data">
                    <h2 class="movie-title">${movie.Title}</h2>
                    <p class="movie-rating">⭐${movie.imdbRating}</p>
                </div>
                <div class="movie-details">
                    <p class="movie-runtime">${movie.Runtime}</p>
                    <p class="movie-genres">${movie.Genre}</p>
                    <button class="add-remove-btn" data-id=${movie.imdbID}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="https://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM9 5C9 4.44772 8.55228 4 8 4C7.44772 4 7 4.44772 7 5V7H5C4.44772 7 4 7.44771 4 8C4 8.55228 4.44772 9 5 9H7V11C7 11.5523 7.44772 12 8 12C8.55228 12 9 11.5523 9 11V9H11C11.5523 9 12 8.55228 12 8C12 7.44772 11.5523 7 11 7H9V5Z" fill="white"/>
                        </svg>
                        Watchlist
                    </button>
                </div>
                <p class="movie-description">
                    ${movie.Plot}
                </p>
            </div>
        </div>
        <hr>
        ` 
}


function renderResults(){
    moviesContainer.innerHTML = moviesHtml
}

function renderApology(){
    moviesContainer.innerHTML = `
        <div class="body-wrapper">
            <h2 class="no-data">Unable to find what you&#39;re looking for. Please try another search.</h2>
        </div>
    `
}

