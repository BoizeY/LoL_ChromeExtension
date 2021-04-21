//let me know that the extension is working
console.log("Chrome extension go!");

//////////////////////////* HMTL INJECTIONS *///////////////////////////////////

//inject the activate button
let button = document.createElement("button");
button.innerHTML = "Activate";
button.id = "activate";
let body = document.body;
body.insertBefore(button, body.firstChild);

//inject Modal window;
body.innerHTML +=
  "<style> body {font-family: Arial, Helvetica, sans-serif;} /* The Modal (background) */ .modal { display: none; /* Hidden by default */ position: fixed; /* Stay in place */ z-index: 100; /* Sit on top */ padding-top: 50px; /* Location of the box */ left: 0; top: 0; width: 100%; /* Full width */ height: 100%; /* Full height */ overflow: auto; /* Enable scroll if needed */ background-color: rgb(0,0,0); /* Fallback color */ background-color: rgba(0,0,0,0.4); /* Black w/ opacity */ } /* Modal Content */ .modal-content { position: relative; background-color: #fefefe; margin: auto; padding: 0; border: 1px solid #888; width: 80%; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19); -webkit-animation-name: animatetop; -webkit-animation-duration: 0.4s; animation-name: animatetop; animation-duration: 0.4s } /* Add Animation */ @-webkit-keyframes animatetop { from {top:-300px; opacity:0} to {top:0; opacity:1} } @keyframes animatetop { from {top:-300px; opacity:0} to {top:0; opacity:1} } /* The Close Button */ .close { color: white; float: right; font-size: 28px; font-weight: bold; } .close:hover, .close:focus { color: #000; text-decoration: none; cursor: pointer; } .modal-header { padding: 2px 16px; background-color: #5cb85c; color: white; } .modal-body {padding: 2px 16px;} .modal-footer { padding: 2px 16px; background-color: #5cb85c; color: white; } .champTable th, td { text-align: center;padding-left: 10px; padding-right: 10px; padding-bottom: 10px;}</style>" +
  '<!-- The Modal --> <div id="myModal" class="modal"> <!-- Modal content --> <div class="modal-content"> <div class="modal-header"> <span class="close">&times;</span> <h2>Compare & Suggestions</h2> </div><div class="modal-body"><div style="font-weight: bold; width: 100%; text-align: center; font-size: 20px;">Here is how your <span class="ModalChampName"></span> compares to top players</div> <br> <br> <table class="champTable"> <tr> <th></th> <th>Winrate</th> <th>KDA</th> <th>CS per Min</th> <th>Average Damage Dealt</th> <th>Average Damage Taken</th> </tr> <tr class="TopPlayer"> <th>Top Player</th> <td class="ModalwinRate">56.4%</td> <td class="ModalKDA">KDA</td> <td class="ModalCS">CS (CS per Min)</td> <td class="ModalAGD">Average Damage Dealt</td> <td class="ModalADT">Average Damage Taken</td> </tr> <tr class="User"> <th>You</th> <td class="ModalwinRate">34.4%</td> <td class="ModalKDA">KDA</td> <td class="ModalCS">CS (CS per Min)</td> <td class="ModalAGD">Average Damage Dealt</td> <td class="ModalADT">Average Damage Taken</td> </tr> </table> <br> <br> <div id="ModalSuggestion"> </div> </div> </div> </div>';

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var closeModal = document.getElementsByClassName("close")[0];

//store user data
let userData = new Array();
//get the user's most played champians
let topRankerPuller = document.getElementsByClassName("Row TopRanker");
//TopRankedPlayerData
//this data is stored in the TopPlayerPerChamp.js

//new class for store user information for easier access
class ChampianStat {
  constructor() {
    this.kda = 0;
    this.winRatio = 0;
  }

  getKDA() {
    this.kda = (this.avgKills + this.avgAssist) / this.avgDeath;
    return this.kda;
  }
  getWinRatio() {
    this.winRatio = (this.wins / (this.loses + this.wins)) * 100;
    return this.winRatio;
  }
}

////////////////////* ACTIVATE & DATA GATHERING FUNCTIONALITIES */////////////////////////////

activate.addEventListener("click", async () => {
  //loop for pulling data for each of the top most played champion
  for (i = 0; i < topRankerPuller.length; i++) {
    //make new class of ChampianStat
    var champ = new ChampianStat();

    //extract champion's name
    let tempElement = topRankerPuller[i].getElementsByClassName(
      "ChampionName Cell"
    );
    champ.champName = tempElement[0].outerText;

    //get number of games won
    tempElement = topRankerPuller[i].getElementsByClassName("Text Left");
    if (typeof tempElement[0] == "undefined") {
      champ.wins = 0.0;
    } else {
      let win = tempElement[0].outerText;
      champ.wins = parseFloat(win.replace(/\D/g, "")); //covert to number only;
    }

    //get number of games lost
    tempElement = topRankerPuller[i].getElementsByClassName("Text Right");
    if (typeof tempElement[0] == "undefined") {
      champ.loses = 0.0;
    } else {
      let lost = tempElement[0].outerText;
      champ.loses = parseFloat(lost.replace(/\D/g, "")); //covert to number only;
    }

    //get the average kill
    tempElement = topRankerPuller[i].getElementsByClassName("Kill");
    champ.avgKills = parseFloat(tempElement[0].outerText);

    //get the average death
    tempElement = topRankerPuller[i].getElementsByClassName("Death");
    champ.avgDeath = parseFloat(tempElement[0].outerText);

    //get the average assist
    tempElement = topRankerPuller[i].getElementsByClassName("Assist");
    champ.avgAssist = parseFloat(tempElement[0].outerText);

    tempElement = topRankerPuller[i].getElementsByClassName("Value Cell");

    //get the average gold per game
    let avgGold = tempElement[0].outerText;
    champ.avgGold = parseFloat(avgGold.replace(/\D/g, ""));

    //get the average minion kill per game
    let temp = tempElement[1].outerText.split(" "); //seperate cs and csPerMin
    champ.avgCS = parseFloat(temp[0]);
    let csPerMin = temp[1];
    champ.avgCsPerMin = parseFloat(csPerMin.replace(/[()]/g, "")); //remove brackets

    //get the Max kill
    champ.maxKills = parseFloat(tempElement[2].outerText);

    //get the Max kill
    champ.maxDeaths = parseFloat(tempElement[3].outerText);

    //get the average damage dealt per game
    let avgDam = tempElement[4].outerText;
    champ.avgDmgDealt = parseFloat(avgDam.replace(/\D/g, "")); //covert to number only;

    //get the average damage taken per game
    let avgDamTaken = tempElement[5].outerText;
    champ.avgDmgTaken = parseFloat(avgDamTaken.replace(/\D/g, "")); //covert to number only;

    champ.getKDA();
    champ.getWinRatio();

    userData.push(champ);
  }

  //change the the original table cells to be onclick functionality
  let table = document.getElementsByTagName("tbody");
  if (table != null) {
    for (let i = 0; i < table[0].rows.length; i++) {
      for (let j = 0; j < table[0].rows[i].cells.length; j++)
        table[0].rows[i].cells[j].onclick = function () {
          TableCellFunction(i, j);
          modal.style.display = "block";
        };
    }
  }
});

//////////////////////////* CEll CLICK FUNCTIONALITIES *////////////////////////////////////
//Cell onClick functionalities
function TableCellFunction(rowNum, cellNum) {
  //get modal body
  let modalChampionName = document.getElementsByClassName("ModalChampName");
  let modalTable = document.getElementsByClassName("champTable");
  //this is where we add the text suggestions
  let modalSugTextDisplay = document.createElement("div");
  //this is where we add the video suggestions
  let modalSugVideo = document.createElement("div");
  let ModalSuggestion = document.getElementById("ModalSuggestion");
  let topData;
  //isolate the topPlayerData needed to compare to user data

  for (let i = 0; i < topPlayerData.length; i++) {
    if (topPlayerData[i].champName == userData[rowNum].champName) {
      topData = topPlayerData[i];
    }
  }

  //content generation
  //change the title of the champion's name
  modalChampionName[0].textContent = userData[rowNum].champName;

  ///////////change the table data////////////////////
  //change player row data
  //winrate
  modalTable[0].rows[1].cells[1].innerText = topData.winRatio + "%";
  modalTable[0].rows[2].cells[1].innerText =
    userData[rowNum].winRatio.toFixed(1) + "%";
  //kda
  modalTable[0].rows[1].cells[2].innerText = topData.kda;
  modalTable[0].rows[2].cells[2].innerText = userData[rowNum].kda.toFixed(1);
  //avg cs
  modalTable[0].rows[1].cells[3].innerText = topData.avgCsPerMin;
  modalTable[0].rows[2].cells[3].innerText = userData[rowNum].avgCsPerMin;
  //avg dmg dealt
  modalTable[0].rows[1].cells[4].innerText = topData.avgDmgDealt;
  modalTable[0].rows[2].cells[4].innerText = userData[rowNum].avgDmgDealt;
  //avg dmg taken
  modalTable[0].rows[1].cells[5].innerText = topData.avgDmgTaken;
  modalTable[0].rows[2].cells[5].innerText = userData[rowNum].avgDmgTaken;

  //data comparsion
  let message;
  let skillRating = {
    R_totalGame: 0,
    R_winRate: 0.0,
    R_kda: 0.0,
    R_cs: 0.0,
    R_dmgDealt: 0.0,
    R_dmgTaken: 0.0,
    ratingCount: 0,
  };
  // calculate the difference between each of the stats
  skillRating.R_totalGame = userData[rowNum].wins + userData[rowNum].loses;
  skillRating.R_winRate = topData.winRatio - userData[rowNum].winRatio;
  skillRating.R_kda = topData.kda - userData[rowNum].kda;
  skillRating.R_cs = topData.avgCsPerMin - userData[rowNum].avgCsPerMin;
  //this two is going to be a little different. Depending on the role of the champion, to some champion it might be a good thing if they are not doing damage.
  // THIS LOGIC IS FOR THE PROTOTYPE, which is a special case.
  skillRating.R_dmgDealt = topData.avgDmgDealt / userData[rowNum].avgDmgDealt;
  skillRating.R_dmgTaken = userData[rowNum].avgDmgTaken / topData.avgDmgTaken;
  //count the number Ratings that is high than 1
  //this well help us determine the overall skill level of the player
  //for example, if a player tiggers 4 of the ratings, It is more likely that the user is a new players, so a general tutorial will be offered
  if (skillRating.R_winRate > 5) {
    skillRating.ratingCount++;
  }
  if (skillRating.R_kda > 1) {
    skillRating.ratingCount++;
  }
  if (skillRating.R_cs > 1.5) {
    skillRating.ratingCount++;
  }
  if (skillRating.R_dmgDealt > 1.15) {
    skillRating.ratingCount++;
  }
  if (skillRating.R_dmgTaken > 1.15) {
    skillRating.ratingCount++;
  }
  console.log(skillRating);
  console.log(skillRating.ratingCount);

  //////////////////// RECOMMENDATION DECISION LOGIC /////////////////////////

  if (skillRating.R_totalGame < 30) {
    modalSugTextDisplay.innerText =
      "Looks like you are new to this champion. I suggestion that you take a quick look at this guide at how to play this champion";
    modalSugVideo.innerHTML = topData.vidBasicGuide;
  }
  // if player's
  else if (skillRating.ratingCount >= 3) {
    modalSugTextDisplay.innerText =
      "Looks like you are struggling playing the current role! Here is a guide on some the most common mistakes people make in this role. Fixing these mistake will great increase you chances of winning";
    modalSugVideo.innerHTML = topData.vidRoleMistake;
  } else if (skillRating.R_cs > 1.5) {
    modalSugTextDisplay.innerText =
      "Keeping pace in farm ensure you stay relevant in levels and items, and increases you chance of winning fights. Here is a tutorial on how to effectively farm with this champion";
    modalSugVideo.innerHTML = topData.vidFarming;
  } else if (skillRating.R_kda > 1) {
    modalSugTextDisplay.innerText =
      "Looks like you are not contributing during fight. This could be you are dying too early in fights, or your not effectively assisting your teammates during fights";
    modalSugVideo.innerHTML = topData.vidTeamFight;
  } else if (skillRating.R_dmgTaken > 1.15 || skillRating.R_dmgDealt > 1.15) {
    modalSugTextDisplay.innerText =
      "looks like you taking too much or not dealing enough damage for your role on " + topData.champName + " we suggest that you take a look at this video on how to be more effect at dealing damage and avoiding taking unnecessary damage";
    modalSugVideo.innerHTML = topData.vidDueling;
  }

  //console.log(modalCompareDisplay);
  //add message to the HTML element
  ModalSuggestion.appendChild(modalSugTextDisplay);
  //add the video imbed to our modal
  ModalSuggestion.appendChild(modalSugVideo);
}

//////////////////////////* MODAL FUNCTIONALITIES *////////////////////////////////////

// When the user clicks on <span> (x), close the modal
closeModal.onclick = function () {
  modal.style.display = "none";
  ModalSuggestion.innerHTML = " ";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    ModalSuggestion.innerHTML = " ";
  }
};
