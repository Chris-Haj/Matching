// Define the base URL and the current page number
let url = "https://api.disneyapi.dev/characters?page="
let page = 0
let id = '_id';
let image = 'imageUrl';
let matches = 0;
let moves = 0;
let card1 = null;
let card2 = null;
let startTime = null;
let endTime = null;

$(document).ready(function () {
    startTime = getTime();
    $("#addImgs").hide();

    $("#starter").click(function () {
        $(".Game").show(1000);
        $(".Game").css('display', 'flex');
        $("#addImgs").show(1000);
        $("#starter").hide(1000);
        startTime = getTime();
    });

    $("#addImgs").click(function () {
        restart();
    });

    $('.Win button').click(function () {
        $('.Win').hide();
        restart();
    });

    $(".Wrong button").click(function () {
        $(".Wrong").hide()
        $('.AllCards').css('pointer-events', 'auto');
    });
    $(".Right button").click(function () {
        $(".Right").hide()
        $('.AllCards').css('pointer-events', 'auto');
        $('.Right p').remove();
    });
    addCards();
});

function getTime() {
    let time = null;
    $.ajax({
        url: 'get_current_time.php', type: 'GET', success: function (res) {
            time = parseInt(res);
        }, error: function () {
            console.log('error');
        }

    });
    return time;
}

function addFlip() {
    $('.OneCard').on('click', function () {
            //OneCard can only be clicked if it is not already flipped
            if (!$(this).hasClass('flipped')) {
                if (card1 === null && card2 === null) {
                    moves++;
                    card1 = $(this);
                    card1.addClass('flipped');
                } else if (card2 === null) {
                    moves++;
                    card2 = $(this);
                    card2.addClass('flipped');
                }
                if (card1 !== null && card2 !== null) {
                    checkMatch();
                }
            }
        }
    );
}

function checkMatch() {
    let id1 = card1.find('.Back').attr('id');
    let id2 = card2.find('.Back').attr('id');
    if (id1 === id2) {
        card1.addClass('matched');
        card2.addClass('matched');
        addInfo();
        card1 = null;
        card2 = null;
        matches++;
        if (matches === 10) {
            endTime = getTime();
            let time = endTime - startTime;
            let minutes = Math.floor(time / 60);
            let seconds = time % 60;
            let timeString = minutes + ' minutes and ' + seconds + ' seconds';
            $('.Win').css('display', 'flex');
            $('.Win').append('<p>Time: ' + timeString + '</p>');
            $('.Win').append('<p>Moves: ' + moves + '</p>');
            return;
        }
        $('.Right').css('display', 'flex');
        $('.AllCards').css('pointer-events', 'none');
    } else {
        $('.Wrong').css('display', 'flex');
        $('.AllCards').css('pointer-events', 'none');
        setTimeout(function () {
            card1.removeClass('flipped');
            card2.removeClass('flipped');
            card1 = null;
            card2 = null;
            $('.Wrong').hide();
            $('.AllCards').css('pointer-events', 'auto');
        }, 300);
    }
}

function addInfo() {
    //Get info that is located in the back of the card <p> tag and add it to .Right
    let info = card1.find('.Back p').html();
    $('.Right').append('<p>' + info + '</p>');
}

function randomNumbers(chars) {
    let arr = [];
    while (arr.length < 10) {
        const randomNum = Math.floor(Math.random() * chars.length);
        if (!arr.includes(randomNum)) {
            arr.push(randomNum);
        }
    }
    arr = arr.concat(arr);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function extractData() {
    let data = []
    $.ajax({
        url: url + page,
        type: 'GET',
        datatype: 'json',
        async: false,
        success: function (json) {
            for (let i in json) {
                data.push(json[i]);
            }
        }

    });
    return data;
}

function addCards() {
    let disney = extractData();
    let chars = disney[0];
    //create array with random numbers from 0 to chars length
    let random = randomNumbers(chars);
    for (let i = 0; i < 20; i++) {
        let char = chars[random[i]];
        let img = char[image];
        let name = char.name;
        let id = char._id;
        let info = '<p>';
        if (char.films.length > 0 || char.shortFilms.length > 0) {
            info += 'Films: ';
            for (let j = 0; j < char.films.length; j++) {
                if (j === 0) {
                    info += char.films[j];
                } else
                    info += ', ' + char.films[j];
            }
            for (let j = 0; j < char.shortFilms.length; j++) {
                if (j === 0) {
                    info += char.shortFilms[j];
                } else
                    info += ', ' + char.shortFilms[j];
            }
            info += '<br>';
        }
        if (char.tvShows.length > 0) {
            info += 'TV Shows: ';
            for (let j = 0; j < char.tvShows.length; j++) {
                if (j === 0) {
                    info += char.tvShows[j];
                } else
                    info += ', ' + char.tvShows[j];
            }
            info += '<br>';
        }
        if (char.videoGames.length > 0) {
            info += 'Video Games: ';
            for (let j = 0; j < char.videoGames.length; j++) {
                if (j === 0) {
                    info += char.videoGames[j];
                } else
                    info += ', ' + char.videoGames[j];
            }
            info += '<br>';
        }
        if (char.parkAttractions.length > 0) {
            info += 'Park Attractions: ';
            for (let j = 0; j < char.parkAttractions.length; j++) {
                if (j === 0) {
                    info += char.parkAttractions[j];
                } else
                    info += ', ' + char.parkAttractions[j];
            }
            info += '<br>';
        }
        info += '</p>';
        let card = `
                    <div class="Back visual" id="${id}">
                        ${info}
                        <img id="${id}" src="${img}" alt="${name}">
                    </div>
                    `;
        //add card to the game to each li in order
        $('.AllCards li').eq(i).append(card);
    }
    addFlip();
}

//Restart the game
function restart() {
    matches = 0;
    moves = 0;
    card1 = null;
    card2 = null;
    //Remove all divs with class Back from AllCards class
    $('.AllCards').find('.Back').remove();
    //Remove all p tags from .Right
    $('.Right').find('p').remove();
    //remove all p tags from .Win
    $('.Win').find('p').remove();
    //remove class flipped from all cards
    $('.AllCards').find('.flipped').removeClass('flipped');
    page++;
    if (page === 149)
        page = 0;
    addCards();
}