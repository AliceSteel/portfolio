const movieItem = {
    props: ["movie"],
    methods: {
        getMovieInfo(id) {
            this.$emit("getMovie", id)
        },
        addToFaves(movie) { //becomes @add-to-faves in template
            this.$emit("addToFaves", movie)
        }
    },
    template: "#movieItem"
}

const App = {
    data() {
        return {
            API_KEY: '44d6a131',
            search: '',
            movieList: [],
            movieInfo: {},
            showModal: false,
            myMovies: [],
            showFaves: false
        }
    },
    components: {
        movieItem
    },
    methods: {
        searchMovies() {
            if (this.search !== '') {
                axios.get(`https://www.omdbapi.com/?apikey=${this.API_KEY}&s=${this.search}`)
                    .then((response) => {
                        this.movieList = response.data.Search; //after checking what we got in response
                    })
                    .catch(function (error) {
                        // handle error
                    })
                    .then(function () {
                        //always executes
                    });
            }
        },
        showMovieInfo() {
            this.showModal = true;
        },
        getMovieInfo(id) {
            axios.get(`https://www.omdbapi.com/?apikey=${this.API_KEY}&i=${id}`)
                .then(response => {
                    this.movieInfo = response.data;
                    this.showMovieInfo();
                })
                .catch(function (error) {
                    // handle error
                })
                .then(function () {
                    // always executed
                });

        },
        addFromStorage() {
            const storageMovies = JSON.parse(localStorage.getItem('myMovies'));
            this.myMovies = storageMovies;
            this.showFaves = true;
        },
        addToFaves(movie) {
            let found = this.myMovies.find(el => el.imdbID === movie.imdbID); //result is found element or undefined
            if (found === undefined) {
                movie.starred = true;
                this.myMovies.push(movie);

            } else {
                this.myMovies = this.myMovies.filter(item => item.imdbID !== movie.imdbID)
            }
            this.showFaves = true;
            localStorage.setItem('myMovies', JSON.stringify(this.myMovies));

        },
        movieListAddStar() {
            let arr = []; //new array of MovieList w/extra property 'starred'
            this.movieList.forEach(el => {
                let findStar = this.myMovies.find(item => el.imdbID === item.imdbID)
                el.starred = findStar !== undefined ? true : false;
                arr.push(el);
            });
            return arr;

        }
    }
}


Vue.createApp(App).mount('#app')