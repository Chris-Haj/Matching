// Define the base URL and the current page number
let url = "https://api.disneyapi.dev/characters?page="
let page = "1"
$(document).ready(function () {
    $("#addImgs").hide();

    $("#starter").click(function () {
        $(".Game").show(1000);
        $("#addImgs").show(1000);
        $("#starter").hide(1000);
    });
    $("#addImgs").click(function () {
        $.getJSON(url, function (data) {
            let characters = data;
            let para = $("#para");
            para.append(characters);
        });
    });
    let disney = extractData();
    let chars = disney[0];
    console.log(chars);

});

function extractData() {
    let data = []
    console.log(typeof (data));
    $.ajax({
        url: url + page,
        type: 'GET',
        datatype: 'json',
        async:false,
        success: function (json) {
            for (let i in json) {
                data.push(json[i]);
            }
        }

    });
    return data;
}

/*// Define the base URL and the current page number
let baseUrl = "https://api.disneyapi.dev/characters?page=";
let currentPage = 1;

function init() {
  // Create an empty array to store character data
  let characters = [];
  // Construct the URL for the API request
  let url = `${baseUrl}${currentPage}`

  // Send an AJAX request to the API
  $.ajax({
    url: url,
    dataType: "json",
    success: function (data) {

      // Iterate over the character data and add each character to the array
      data.data.forEach(function (character) {
        characters.push(character);
      });

      // Set the number of rows and columns for the game board
      const raw = 5;
      const col = 4;

      // Initialize the click count to 0
      let clickCount = 0;

      // When the start button is clicked, remove it and start the game
      document.querySelector(".start-button span").onclick = function () {
        document.querySelector(".start-button").remove();

        // Send an AJAX request to get the current time from the server
        $.ajax({
          type: 'Get',
          url: 'get_current_time.php',
          success: function (startTime) {

            // Create arrays to store unmatched blocks, and references to the moves and matches HTML elements
            let unmatchedBlocks = [];
            let movesElement = document.querySelector('.moves span');
            let matchesElement = document.querySelector('.matches span');

            // Get a reference to the game-blocks container and set its width based on the number of rows and columns
            let blocksHolder = document.querySelector(".game-blocks");
            $(document).ready(function () {
              var containerWidth = raw * 220;
              $('.game-blocks').css('width', containerWidth + 'px');
            });

            // Create the game blocks and add event listeners to each block
            createNewBlocks();

            // Convert the HTMLCollection of blocks to an array and generate a random order for them
            let blocks = Array.from(blocksHolder.children);
            let orderOfBlocks = [...Array(blocks.length).keys()];
            shuffleBlocks(orderOfBlocks);

            // Set the order of the blocks based on the shuffled order
            blocks.forEach((block, indexOfBlock) => {
              block.style.order = orderOfBlocks[indexOfBlock];
              // Add an event listener to the block to handle clicks
              block.addEventListener("click", function () {
                if (
                  block.classList.contains("pressed") ||
                  block.classList.contains("matched")
                ) {
                  return;
                }
                // If the block has not yet been clicked, rotate it and increment the click count
                rotateBlock(block);
              });
            });


            function createNewBlocks() {
              // Shuffle the characters array to ensure that the order of the blocks is randomized
              shuffleBlocks(characters);
              // Generate pairs of blocks for each character in the first (raw * col) / 2 elements of the shuffled array
              for (let i = 0; i < (raw * col) / 2; i++) {
              let character = characters[i];
              let imgurl = character.imageUrl;
               // Create two blocks for each character
              for (let j = 0; j < 2; j++) {
              let newDiv = document.createElement("div");
              newDiv.className = "block";
              newDiv.dataset.character = character.url;

              // Create a front side for the block
              let frontDiv = document.createElement("div");
              frontDiv.className = "side front";

               // Create a back side for the block with the character's image and name
               let backDiv = document.createElement("div");
              backDiv.className = "side back";

               let img = document.createElement("img");
               img.src = imgurl;
               img.alt = character.name;
               backDiv.appendChild(img);

               let name = document.createElement("p");
               name.textContent = character.name;
               backDiv.appendChild(name);

               // Append the front and back sides to the new block
               newDiv.appendChild(frontDiv);
               newDiv.appendChild(backDiv);

               // Append the new block to the blocksHolder element on the game board
               blocksHolder.appendChild(newDiv);
               }
              }
            }

            function rotateBlock(pressedBlock) {

              pressedBlock.classList.add('pressed'); // Add 'pressed' class to the clicked block
              clickCount++; // Increment the click count

              let rotatedBlocks = document.querySelectorAll('.block.pressed'); // Get all blocks with the 'pressed' class
              if (rotatedBlocks.length === 2) { // Check if two blocks have been rotated
              blocksHolder.classList.add('stopClick'); // Add 'stopClick' class to blocksHolder element to prevent further clicks
              checkRotatededBlocks(rotatedBlocks[0], rotatedBlocks[1]); // Pass the two rotated blocks to the checkRotatededBlocks function
              }
              }

              function checkRotatededBlocks(firstBlock, secondBlock) {

                // If the two blocks match, the following code executes
                if (firstBlock.dataset.character === secondBlock.dataset.character) {

                  // Decrease clickCount by 2, remove the 'pressed' class, and add the 'matched' class to the blocks
                  clickCount = clickCount - 2;
                  firstBlock.classList.remove('pressed');
                  secondBlock.classList.remove('pressed');
                  firstBlock.classList.add('matched');
                  secondBlock.classList.add('matched');

                  // Find the character data that matches the selected blocks
                  const characterData = characters.find(character => character.url === firstBlock.dataset.character);

                  // Create a new div for the character details and add it to the match screen
                  const matchScreen = document.querySelector('.match-screen');
                  const matchContent = matchScreen.querySelector('.match-content');
                  const characterDetails = document.createElement('div');
                  const charTitle = document.createElement('h2');
                    charTitle.textContent = "Character Details";
                    characterDetails.appendChild(charTitle);

                  // If the character has films, add them to the character details section
                  if (characterData.films.length > 0) {
                    const filmsTitle = document.createElement('h3');
                    filmsTitle.textContent = "Films";
                    characterDetails.appendChild(filmsTitle);
                    const filmsList = document.createElement('ul');
                    characterData.films.forEach(film => {
                      const filmItem = document.createElement('li');
                      filmItem.textContent = film;
                      filmsList.appendChild(filmItem);
                    });
                    characterDetails.appendChild(filmsList);
                  }

                  // If the character has TV shows, add them to the character details section
                  if (characterData.tvShows.length > 0) {
                    const tvShowsTitle = document.createElement('h3');
                    tvShowsTitle.textContent = "TV Shows";
                    characterDetails.appendChild(tvShowsTitle);
                    const tvShowsList = document.createElement('ul');
                    characterData.tvShows.forEach(tvShow => {
                      const tvShowItem = document.createElement('li');
                      tvShowItem.textContent = tvShow;
                      tvShowsList.appendChild(tvShowItem);
                    });
                    characterDetails.appendChild(tvShowsList);
                  }

                  // If the character has park attractions, add them to the character details section
                  if (characterData.parkAttractions.length > 0) {
                    const parkAttractionsTitle = document.createElement('h3');
                    parkAttractionsTitle.textContent = "parkAttractions";
                    characterDetails.appendChild(parkAttractionsTitle);
                    const attractionsList = document.createElement('ul');
                    characterData.parkAttractions.forEach(attraction => {
                      const attractionItem = document.createElement('li');
                      attractionItem.textContent = attraction;
                      attractionsList.appendChild(attractionItem);
                    });
                    characterDetails.appendChild(attractionsList);
                  }

                  // If the character has video games, add them to the character details section
                  if (characterData.videoGames.length > 0) {
                    const videoGamesTitle = document.createElement('h3');
                    videoGamesTitle.textContent = "videoGames";
                    characterDetails.appendChild(videoGamesTitle);
                    const gamesList = document.createElement('ul');
                    characterData.videoGames.forEach(game => {
                      const gameItem = document.createElement('li');
                      gameItem.textContent = game;
                      gamesList.appendChild(gameItem);
                    });
                    characterDetails.appendChild(gamesList);
                  }
                  // Add the character details section to the match screen and display it
                  if (characterData.videoGames.length === 0 && characterData.parkAttractions.length === 0 && characterData.films.length === 0 && characterData.tvShows.length === 0) {
                    const none = document.createElement('h3');
                    none.textContent = "Nohting to Show";
                    characterDetails.appendChild(none);
                  }
                  matchContent.appendChild(characterDetails);
                  matchScreen.style.display = 'flex';

                  // Increase the number of moves and matches, and add an event listener to the continue button
                  movesElement.innerHTML = parseInt(movesElement.innerHTML) + 1;
                  matchesElement.innerHTML = parseInt(matchesElement.innerHTML) + 1;

                  const continueButton = document.querySelector('.match-screen .continue');
                    // define event listener for continue button click
                    continueButton.addEventListener('click', () => {
                    // hide match screen and clear character details
                    matchScreen.style.display = 'none';
                    characterDetails.innerHTML = '';

                    // check if all blocks have been matched
                    if (matchesElement.innerHTML == blocks.length / 2) {
                      // send AJAX request to get current time
                      $.ajax({
                        type: 'Get',
                        url: 'get_current_time.php',
                        success: function (endTime) {
                          // calculate time difference in milliseconds
                          let diffInMilliseconds = (endTime - startTime) * 1000;
                          // format time into hours, minutes, and seconds
                          let hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
                          let minutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
                          let seconds = Math.floor((diffInMilliseconds % (1000 * 60)) / 1000);
                          let formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                          // display win screen with number of moves and time spent
                          let win = document.querySelector('.win-screen');
                          win.style.display = 'flex';
                          document.querySelector('.win-screen .tries span').innerHTML = movesElement.innerHTML;
                          document.querySelector('.win-screen .time').innerHTML = 'Time Spent: ' + formattedTime;

                          // define event listener for "next round" button
                          document.querySelector('.win-screen .next-round').onclick = function () {
                            // reset blocks, moves, and matches
                            blocks.forEach((block) => {
                              block.classList.remove('pressed');
                              block.classList.remove('matched');
                            });
                            document.querySelector('.moves span').innerHTML = 0;
                            document.querySelector('.matches span').innerHTML = 0;
                            clickCount = 0;
                            blocksHolder.innerHTML = '';

                            // increment current page or reset to 1
                            if (currentPage < 149) {
                              currentPage++;
                            }
                            else {
                              currentPage = 1;
                            }

                            // rearrange blocks according to orderOfBlocks array
                            blocks.forEach((block, index) => {
                              block.style.order = orderOfBlocks[index];
                            });

                            // hide win screen and display start button
                            win.style.display = 'none';
                            let startButton = document.createElement('div');
                            startButton.classList.add('start-button');
                            startButton.innerHTML = '<span>Start Round</span>';
                            document.body.appendChild(startButton);

                            // define event listener for start button click
                          startButton.querySelector('span').onclick = function () {
                            startButton.remove();
                          };
                          init();
                        };
                      }
                    });
                  }
                });

              } else {
                // Show the fail screen
                let fail = document.querySelector('.fail-screen');
                fail.style.display = 'flex';

                // Set an event listener for the continue button on the fail screen
                let failTimeout;
                document.querySelector('.fail-screen .continue').onclick = function () {
                    clearTimeout(failTimeout); // clear the timeout function
                    fail.style.display = 'none'; // hide the fail screen
                };

                // Set a timeout to hide the fail screen after 3 seconds if the user doesn't click continue
                failTimeout = setTimeout(() => {
                    fail.style.display = 'none'; // hide the fail screen
                }, 2000);

                // Increment the moves count by 1 and update the unmatchedBlocks array
                movesElement.innerHTML = parseInt(movesElement.innerHTML) + 1;
                unmatchedBlocks.push(firstBlock);
                unmatchedBlocks.push(secondBlock);
            }


              // Allow clicking on the blocks after 1 second
              setTimeout(() => {
                blocksHolder.classList.remove('stopClick');
              }, 1000);

              // Add an event listener for a click on the document
              document.addEventListener("click", function () {
                if (clickCount === 3) { // If three clicks have been registered
                  unmatchedBlocks.forEach((block) => { // Remove the 'pressed' class from all unmatched blocks
                    block.classList.remove('pressed');
                  });
                  unmatchedBlocks = []; // Reset the unmatchedBlocks array
                  clickCount = clickCount - 2; // Reset the clickCount
                }
              });
            }

            function shuffleBlocks(blocksArr) { // function to shuffle the blocks

              return blocksArr.sort(() => Math.random() - 0.5);
            }

            document.querySelector('.new span').onclick = function () {

              // Reset all the blocks by removing 'pressed' and 'matched' classes
              blocks.forEach((block) => {
              block.classList.remove('pressed');
              block.classList.remove('matched');
              });

              // Reset the move and match counters to 0
              document.querySelector('.moves span').innerHTML = 0;
              document.querySelector('.matches span').innerHTML = 0;
              clickCount = 0;

              // Clear the game board of all blocks
              blocksHolder.innerHTML = '';

              // Determine the next page of characters to load
              if (currentPage < 149) {
              currentPage++;
              }
              else {
              currentPage = 1;
              }

              // Set the order of the blocks to the original order
              blocks.forEach((block, index) => {
              block.style.order = orderOfBlocks[index];
              });

              // Create a new start button to initiate the game
              let startButton = document.createElement('div');
              startButton.classList.add('start-button');
              startButton.innerHTML = '<span>Start Game</span>';
              document.body.appendChild(startButton);

              // Add an event listener to the start button to remove it when clicked
              startButton.querySelector('span').onclick = function () {
              startButton.remove();
              };
              // Initialize the game again
              init();
              };
          }
        });
      };
    },
    error: function () {
      console.log("Error retrieving character data.");
    }
  });
}*/