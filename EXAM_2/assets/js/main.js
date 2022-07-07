$(window).on('scroll', function () {
    if (window.scrollY > 80) {
        $('#header').addClass('scroll')
    } else {
        $('#header').removeClass('scroll')
    }
})
$('.hamburger, #page_overlay, #mobile_menu a').on('click', function () {
    toggleMenu();
})
$('#mobile_menu a', '#main_menu a').on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top - 107}, 500)
});

function toggleMenu() {
    $('.hamburger').toggleClass('is-active');
    $('#side_block, #page_overlay').toggleClass('open');
    $('body').toggleClass('lock');
}

$(function () {
    const slider1 = $('#lightSlider1').lightSlider({
        item: 1,
        controls: false,
        loop: true,
        vertical: true,
        verticalHeight: 800,
        speed: 1000,
        slideMargin: 0,
        addClass: 'firstSlider',
        responsive: [{
            breakpoint: 800,
            settings: {
                pager: false
            }
        }]
    });
    $('#btn_slider_1_next').on('click', function () {
        slider1.goToNextSlide();
    });

    $.ajax('assets/data/news.json')
        .done(function (resp) {
            buildNews(resp);
        })
        .fail(function (err) {
            console.log(err);
            alert('Cannot get the news');
        });

    function buildNews(json) {
        let html = '';
        json.forEach(item => {
            html += `
                <li class="news_card">
                    <div class="news_img_wrap">
                        <img src="${item.img}">
                    </div>   
                    <h4 class="news_title">${item.title}</h4>
                    <p class="news_text">${item.text}</p>
                    <div class="authors">
                        <img src=${item.avatar} alt="foto" class="authors_img">
                        <div class="authors_info">
                            <div class="authors_name">${item.name}</div>
                            <div class="authors_date">${item.date}</div>
                        </div>
                    </div>
            </li>
                `;
        });
        html += '';
        $('#lightSlider2').html(html);


        const slider2 = $('#lightSlider2').lightSlider({
            item: 3,
            controls: false,
            loop: true,
            auto: true,
            pauseOnHover: true,
            slideMargin: 30,
            pager: true,
            addClass: 'newsSlider',
            slideMove: 2,
            responsive: [{
                    breakpoint: 800,
                    settings: {
                        item: 2,
                        slideMove: 1,
                        slideMargin: 10,
                    }
                },
                {
                    breakpoint: 550,
                    settings: {
                        item: 1,

                    }
                }
            ]
        });
        $('#btn_news_prev').on('click', function () {
            slider2.goToPrevSlide();
        });
        $('#btn_news_next').on('click', function () {
            slider2.goToNextSlide();
        });
    }

})
//___Gallery:

lightGallery(document.getElementById('gallery'), {
    plugins: [lgZoom, lgThumbnail],
    thumbnail: true,
    zoom: true,
    actualSize: true,
    animateThumb: true,
    zoomFromOrigin: true,
});

//______MAP:________________________________________________________________
function initMap() {
    const map = L.map('map').setView([55.6685514578586, 12.59589738187602], 12);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const icons = {
        blue: L.icon({
            iconUrl: 'assets/plugins/leaflets/images/icons_blue_40.png',
            iconSize: [40, 40],
            iconAnchor: [25, 50],
            popupAnchor: [-3, -76]
        }),
        black: L.icon({
            iconUrl: 'assets/plugins/leaflets/images/marker_black@48.png',
            iconSize: [40, 40],
            iconAnchor: [25, 50],
            popupAnchor: [-3, -76]
        })
    }

    const places = [{
            lat: 55.69251251074549,
            lng: 12.616618898960663,
            text: '<b>Our headquaters</b>',
            img: 'assets/plugins/leaflets/images/icon_office@96.png',
            icon: 'blue'
        },
        {
            lat: 55.657717470404314,
            lng: 12.64367700068164,
            text: '<b>Our Office</b>',
            img: 'assets/plugins/leaflets/images/icon_office@96.png',
            icon: 'black'
        }
    ]

    const markers = L.markerClusterGroup();

    places.forEach(place => {
        markers.addLayer(L.marker([place.lat, place.lng], {
            icon: icons[place.icon]
        }).bindPopup(`
            <div class="popup">
                <div class="popup_pic">
                    ${place.img !== null ? ' <img src="'+place.img+'" alt="">' : ''}
                </div>
                <div class="popup_text">${place.text}</div>
            </div>
        `));
    })

    map.addLayer(markers);
}
$('#load_map_link').on('click', function (event) {
    event.preventDefault();
    $('#map').html('');
    initMap();
})
///____Form:_____________________________________________________________

const topPanel = {
    show: function (text, className) {
        let panel = `<div id='panel' class="panel ${className}">${text}</div>`;
        if ($('#panel') !== null) {
            $('#panel').remove();
        }
        $('#header').append(panel)
        this.hide();
    },
    hide: function () {
        setTimeout(function () {
            if ($('#panel') !== null) {
                $('#panel').remove();
            }
        }, 5000); //equal to 5sec
    },
    error: function (text) {
        this.show(text, 'panel_err');
    },
    success: function (text) {
        this.show(text, 'panel_success');
    },
}

$("#contact_form").on('submit', function (e) {
    e.preventDefault();
    let name = $("#name").val();
    let email = $("#email").val();
    if (name.length <= 1) {
        topPanel.error('Enter your full name, please!');
    }else if (email.length <= 1) {
        topPanel.error('Please enter valid email!');
        return false;
    } else {
        topPanel.success('Your data was successfully sent!');
    }
});