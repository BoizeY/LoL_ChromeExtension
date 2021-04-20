let localTable = document.body.getElementsByClassName("champTable");
let userData;


//fill the table based on the user data gathered
fillTable.addEventListener("click", async () => {
  //checking I have got the table
  console.log(localTable);

  chrome.storage.sync.get("userData", function (obj) {
    //retreive the data from storage
    userData = obj;

    //table population loop
    for (i = 0; i < obj.userData.length; i++) {
      //vars
      let temp;

      //creat new row
      let row = localTable[0].insertRow();
      //insert each cell
      //champion name
      temp = row.insertCell(0);
      temp.innerHTML = obj.userData[i].champName;

      //games played
      temp = row.insertCell(1);
      let button = document.createElement("button");
      button.innerHTML =
        +obj.userData[i].wins +
        "W/" +
        obj.userData[i].loses +
        "L " +
        "(" +
        obj.userData[i].winRatio.toFixed(1) +
        "%)";
      temp.appendChild(button);
      button.id = "Played";

      //KDA
      temp = row.insertCell(2);
      //get kda ratio
      temp.innerHTML =
        obj.userData[i].avgKills +
        "/" +
        obj.userData[i].avgDeath +
        "/" +
        obj.userData[i].avgAssist +
        "(" +
        obj.userData[i].kda.toFixed(1) +
        ")";

      //AvgGold per Game

      //CS and csPerMin

      //AvgDmgDealt

      //AvgDmgTaken
    }
  });
});

//getting the data from the site
getData.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: GetTopRankerData,
  });
});

// The body of this function will be executed as a content script inside the current page

function GetTopRankerData() {
  //class for storing info
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

  let userData = new Array();
  //get the user's most played champians
  let topRankerPuller = document.getElementsByClassName("Row TopRanker");

  //loop for each champion
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
    champ.avgGold = parseFloat(tempElement[0].outerText);

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
  //console.log(userData);
  //store the gathered data into local storage.
  chrome.storage.sync.set({ userData: userData });

  /********   USED FOR JSON EXPORT *********/
  // let userDataJSON = JSON.stringify(userData[0]);
  // console.log(userDataJSON);
}
