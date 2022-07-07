const topPanel = {
    show: function (text, className) {
        let panel = `<div id='panel' class="panel ${className}">${text}</div>`;
        if (document.getElementById('panel') !== null) {
            document.getElementById('panel').remove();
        }
        document.body.insertAdjacentHTML('afterbegin', panel);
        this.hide();
    },
    hide: function () {
        setTimeout(function () {
            if (document.getElementById('panel') !== null) {
                document.getElementById('panel').remove();
            }
        }, 3000);
    },
    error: function (text) {
        this.show(text, 'panel_error');
    },
    success: function (text) {
        this.show(text, 'panel_success');
    }
};

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

const Pagination = {
    props: {
        page: {
            type: Number,
            default: 1,
            required: true
        },
        total: {
            type: Number,
            default: 0,
            required: true
        }
    },
    methods: {
        goToPage(pag_num) {
            this.$emit('goToPage', pag_num)
        }
    },
    template: '#pagination'
}

const App = {
    data() {
        return {
            API_KEY: '44d6a131',
            search: '',
            select: '',
            year: '',
            movieList: [],
            movieInfo: {},
            showModal: false,
            myMovies: [],
            showFaves: false,
            totalPages: 0,
            currPage: 1,
            isDarkTheme: false
        }
    },

    created() {

        this.myMovies = JSON.parse(localStorage.getItem('myMovies')) || []
        if(document.cookie !== ''){
            this.isDarkTheme = JSON.parse(document.cookie.split(`dark=`).pop())
        }
        if (this.isDarkTheme) {
            document.querySelector('html').classList.add('dark');
        }
    },

    components: {
        movieItem,
        Pagination
    },

    methods: {
        searchMovies() {
            if (this.search !== '') {
                axios.get(`https://www.omdbapi.com/?apikey=${this.API_KEY}&s=${this.search}&type=${this.select}&y=${this.year}&page=${this.currPage}`)
                    .then((response) => {
                        if (response.data.Response === "False") {
                            topPanel.error('Movie with entered title not found');
                        } else {
                            this.movieList = response.data.Search;
                            this.totalPages = Math.ceil(response.data.totalResults / 10);
                        }
                    })
                    .catch(function (error) {
                        topPanel.error(`${error.code}. Try again later`)
                    })
            } else {
                topPanel.error('Enter movie title, please!')
            }
        },
        goToPage(pageNum) {
            this.currPage = pageNum;
            this.searchMovies();
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
                    topPanel.error(`${error.code}. Try again later`)
                })

        },
        showFav() {
            this.showFaves = true;
        },
        addToFaves(movie) {
            let found = this.myMovies.find(el => el.imdbID === movie.imdbID); //result is found element or undefined
            if (found === undefined) {
                movie.starred = true;
                this.myMovies.push(movie);
                topPanel.success('Added to Favorites');
            } else {
                this.myMovies = this.myMovies.filter(item => item.imdbID !== movie.imdbID)
                topPanel.success('Removed from Favorites!')
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
        },
        toggleTheme() {
            this.isDarkTheme = !(this.isDarkTheme);
            document.querySelector('html').classList.toggle('dark');
            let value = JSON.stringify(this.isDarkTheme);
            document.cookie = "dark=" + value + ";max-age=260000000;path=/";
        },
        widthProgressBar(index) {
            const width = parseFloat(this.movieInfo.Ratings[index].Value) * 10 + '%';
            return width;
        }
    }
}


Vue.createApp(App).mount('#app')