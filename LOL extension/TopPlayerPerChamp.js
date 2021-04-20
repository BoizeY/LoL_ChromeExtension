let topPlayerData = [
  {
    champName: "Master Yi",
    wins: 267,
    loses: 244,
    winRatio: 52.2,
    avgKills: 7.9,
    avgDeath: 5.3,
    avgAssist: 4.7,
    kda: 2.38,
    avgGold: 12400,
    avgCS: 190.4,
    avgCsPerMin: 7.1,
    maxKills: 24,
    maxDeaths: 15,
    avgDmgDealt: 195976,
    avgDmgTaken: 29680,
    vidBasicGuide: '<iframe width="560" height="315" src="https://www.youtube.com/embed/Sdz_s0dOLF4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    vidJungleMistake:'<iframe width="560" height="315" src="https://www.youtube.com/embed/QnvV_cTAbdI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    vidFarming:'',
    vidDueling:'',
    vidTeamFight:'',

  },
  {
    champName: "Olaf",
    wins: 87,
    loses: 58,
    winRatio: 60,
    avgKills: 7.7,
    avgDeath: 4.4,
    avgAssist: 7.8,
    kda: 3.51,
    avgGold: 11026,
    avgCS: 157.1,
    avgCsPerMin: 6.0,
    maxKills: 21,
    maxDeaths: 10,
    avgDmgDealt: 151695,
    avgDmgTaken: 31308,
  },
];

chrome.storage.sync.set({ topPlayerData: topPlayerData });