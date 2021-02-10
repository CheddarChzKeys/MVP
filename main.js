class Player {
  constructor (name, clanTag, userName, wins, kills, deaths, games, operator) {
  this.name = name;
  this.clanTag = clanTag;
  this.userName= userName;
  this.wins = wins;
  this.kills = kills;
  this.deaths = deaths;
  this.kdr = (kills / deaths).toFixed(2);
  this.games = games;
  this.winRatio = ((wins/games) * 100).toFixed(1);
  this.killsPerGame = (kills/games).toFixed(1);
  this.operator = operator;
  }
}

var playersForRecords = [];
var playersForOperators= {};

let milo = new Player('Milo', '[e702*]', 'M3', 169, 12390, 7076, 2970);
let jeff = new Player('Jefe', '', 'ToeJam', 67, 8912, 6204, 2883);
let chino = new Player('Chino', '[e702*]', 'E88', 66, 2801, 3493, 1256, './Warzone Images/nikto.png');
let eric = new Player('Erick', '[hupd]', 'darkerthanpoo', 66, 5361, 2955, 1301);
let john = new Player('John', '[e702*]', 'fguritout2morrow', 53, 2765, 3171, 1138);
let rey = new Player('Rey', '[hupd]', 'Fluid-Motional', 48, 2300, 2556, 1015);
let randy = new Player('Randy', '[e702*]', 'nohypejustBEAST', 24, 1120, 924, 369);
let joel = new Player('Manung', '[SE$D]', 'joel', 24, 2103, 1534, 623);
let jerrick = new Player ('J Rock', '[e702*]', 'JRICKROSS', 23, 1277, 1731, 668, './Warzone Images/allegianceDefault.png');
let tryk = new Player('Tryk', '[hupd]', 'TRYK187', 15, 640, 1231, 460);
let ken = new Player('RSX Ken', '[ganja]', 'KillaKen', 70, 4421, 3990, 1718);
let jeron = new Player('Jeronimo', '[e702*]', 'Jeronimo', 49, 1928, 2972, 1282, './Warzone Images/azrael.png');
let justin = new Player('Just', '[D4W]', 'JUSSdoIT', 138, 8105, 7169, 3240, './Warzone Images/humboldt.png');
let jimby = new Player('Juice', '[e702*]', 'johnny punani', 82, 5105, 4341, 1823);
let victor = new Player('Laosy Bebeh', '[BIDEN]', 'ThoughtMOB', 94, 6744, 6485, 2535);
let noelito = new Player('Noelito', '', 'Noe', 84, 6266, 4392, 1897);

playersForOperators.milo = milo;
playersForOperators.jeff = jeff;
playersForOperators.chino = chino;
playersForOperators.eric = eric;
playersForOperators.john = john;
playersForOperators.rey = rey;
playersForOperators.randy = randy;
playersForOperators.joel = joel;
playersForOperators.jerrick = jerrick;
playersForOperators.tryk = tryk;
playersForOperators.ken = ken;
playersForOperators.jeron = jeron;
playersForOperators.justin = justin;
playersForOperators.jimby = jimby;
playersForOperators.victor = victor;
playersForOperators.noelito = noelito;

playersForRecords.push(milo, jeff, chino, eric, john, rey, randy, joel, jerrick, tryk, ken, jeron, justin, jimby, victor, noelito);

playersForRecords = playersForRecords.sort((a, b) => (a.kdr < b.kdr) ? 1 : -1)

var createNewRankings = function () {
  $('#rankings #tbody tr').remove()
  for (let i = 0; i < playersForRecords.length; i++) {
  var recordsBody = document.getElementById('tbody');
  var tr = '<tr class= "recordsRows">';
  tr +=
  `<td class ='position'>${i + 1}</td><td class='gamerTag'>${playersForRecords[i].userName}</td><td class='KDR'>${playersForRecords[i].kdr}</td>
  <td class='winRatio'>${playersForRecords[i].winRatio}%</td><td class='wins'>${playersForRecords[i].wins}</td><td class='games'>${playersForRecords[i].games}</td>
  <td class='kills'>${playersForRecords[i].kills}</td><td class='deaths'>${playersForRecords[i].deaths}</td><td class='killsGame'>${playersForRecords[i].killsPerGame}</td>`;
  tr += '</tr>';
  recordsBody.innerHTML += tr;
  };
};

var sortRankings = function () {

  createNewRankings();

  $('.position').hover(
    function () { $('#positionHead').css({'text-shadow':'0px 0px 10px #79d9ff', 'color':'#79d9ff'})},
    function () { $('#positionHead').css({'text-shadow':'none', 'color':'white'})}
    )

  $('.gamerTag').hover(
    function () { $('#gamerTagHead').css({'text-shadow':'0px 0px 10px #79d9ff', 'color':'#79d9ff'})},
    function () { $('#gamerTagHead').css({'text-shadow':'none', 'color':'white'})}
    )

  $('.KDR').hover(
    function () { $('#KDRHead').css({'text-shadow':'0px 0px 10px #79d9ff', 'color':'#79d9ff'})},
    function () { $('#KDRHead').css({'text-shadow':'none', 'color':'white'})}
    )

  $('.KDR').click(
    function () {
    playersForRecords = playersForRecords.sort((a, b) => (a.kdr < b.kdr) ? 1 : -1)
    // $('#mainBox').hide()
    sortRankings();
    // $('#mainBox').fadeToggle(1000)
    })


  $('.winRatio').hover(
    function () { $('#winRatioHead').css({'text-shadow':'0px 0px 10px #79d9ff', 'color':'#79d9ff'})},
    function () { $('#winRatioHead').css({'text-shadow':'none', 'color':'white'})}
    )

    $('.winRatio').click(
    function () {
    playersForRecords = playersForRecords.sort((a, b) => (a.winRatio < b.winRatio) ? 1 : -1)
    // $('#mainBox').hide()
    sortRankings();
    // $('#mainBox').fadeToggle(1000)
    })

  $('.wins').hover(
    function () { $('#winsHead').css({'text-shadow':'0px 0px 10px #79d9ff', 'color':'#79d9ff'})},
    function () { $('#winsHead').css({'text-shadow':'none', 'color':'white'})}
    )

  $('.wins').click(
    function () {
    playersForRecords = playersForRecords.sort((a, b) => (a.wins < b.wins) ? 1 : -1)
    // $('#mainBox').hide()
    sortRankings();
    // $('#mainBox').fadeToggle(1000)
    })

  $('.games').hover(
    function () { $('#gamesHead').css({'text-shadow':'0px 0px 10px #79d9ff', 'color':'#79d9ff'})},
    function () { $('#gamesHead').css({'text-shadow':'none', 'color':'white'})}
    )

  $('.games').click(
    function () {
    playersForRecords = playersForRecords.sort((a, b) => (a.games < b.games) ? 1 : -1)
    // $('#mainBox').hide()
    sortRankings();
    // $('#mainBox').fadeToggle(1000)
    })

  $('.kills').hover(
    function () { $('#killsHead').css({'text-shadow':'0px 0px 10px #79d9ff', 'color':'#79d9ff'})},
    function () { $('#killsHead').css({'text-shadow':'none', 'color':'white'})}
    )

  $('.kills').click(
    function () {
    // $('#mainBox').hide()
    playersForRecords = playersForRecords.sort((a, b) => (a.kills < b.kills) ? 1 : -1)
    sortRankings();
    // $('#mainBox').fadeToggle(1000)
    })

  $('.deaths').hover(
    function () { $('#deathsHead').css({'text-shadow':'0px 0px 10px #79d9ff', 'color':'#79d9ff'})},
    function () { $('#deathsHead').css({'text-shadow':'none', 'color':'white'})}
    )

  $('.deaths').click(
    function () {
    // $('#mainBox').hide()
    playersForRecords = playersForRecords.sort((a, b) => (a.deaths < b.deaths) ? 1 : -1)
    sortRankings();
    // $('#mainBox').fadeToggle(1000)
    })

  $('.killsGame').hover(
    function () { $('#killsGameHead').css({'text-shadow':'0px 0px 10px #79d9ff', 'color':'#79d9ff'})},
    function () { $('#killsGameHead').css({'text-shadow':'none', 'color':'white'})}
    )

  $('.killsGame').click(
    function () {
    // $('#mainBox').hide()
    playersForRecords = playersForRecords.sort((a, b) => (a.killsPerGame < b.killsPerGame) ? 1 : -1)
    sortRankings();
    // $('#mainBox').fadeToggle(1000)
  })

}

$(document).ready(function () {
  var operatorsScroll = document.getElementById('operatorsScroll');

  $('html').css({'background': 'url("./Warzone Images/Background Images/reaper.jpg")',
  'background-size': 'cover',
  'background-repeat': 'no-repeat',
  'background-position': 'center center',
  'background-attachment':'fixed'})

  $('#recordsButton').click(function() {
    $('#operatorsBox').fadeOut(500);
    sortRankings();
    $('#rankingsBox').fadeToggle(1000)
    $('html').css({'background': 'url("./Warzone Images/Background Images/season6.jpg")',
    'background-size': 'cover',
    'background-repeat': 'no-repeat',
    'background-position': 'center center',
    'background-attachment':'fixed'})
  })

  $('#operatorsButton').click(function() {
    $('#rankingsBox').fadeOut(500);

    $('html').css({'background': 'url("./Warzone Images/Background Images/season1.jpg")',
    'background-size': 'cover',
    'background-repeat': 'no-repeat',
    'background-position': 'center center',
    'background-attachment':'fixed'})

    $('#operatorsBox').fadeToggle(2000);
  })

  $(".operatorthumb").hover (function() {
    $( "#operatorNameBox").hide();
    $( "#operatorInfo").hide();
    $( "#operatorInfo").hide();
    $( "#operatorBigImageDiv" ).hide();
    var id = $(this).attr('id');
    id = id.slice(0, (id.length - 5));
    $( "#operatorClanTag" ).text(playersForOperators[id].clanTag);
    $( "#operatorGamerTag" ).text(playersForOperators[id].userName);
    $( "#operatorName" ).html(`Alias: &nbsp; ${playersForOperators[id].name}`);
    $( "#operatorKDR" ).html(`Kill/Death Ratio: &nbsp; ${playersForOperators[id].kdr}`);
    $( "#operatorWins" ).html(`Games won: &nbsp; ${playersForOperators[id].wins}`);
    $( "#operatorKills" ).html(`Kills: &nbsp; ${playersForOperators[id].kills}`);
    $( "#operatorDeaths" ).html(`Deaths: &nbsp; ${playersForOperators[id].deaths}`);
    $( "#operatorGames" ).html(`Games Played: &nbsp; ${playersForOperators[id].games}`);
    $( "#operatorKillsGame" ).html(`Average Kills/Game: &nbsp; ${playersForOperators[id].killsPerGame}`);
    $( "#operatorBigImageDiv" ).html(`<img id=operatorBigImage src="${playersForOperators[id].operator}"></img>`);

    $( "#operatorNameBox" ).fadeIn(300);
    $( "#operatorInfo" ).fadeIn(300);
    $( "#operatorBigImageDiv" ).fadeIn(300);
  })
  // $( "#jerrickthumb" ).hover(function() {
  //   $( "#operatorClanTag" ).text(playersForOperators.jerrick.clanTag);
  //   $( "#operatorGamerTag" ).text(playersForOperators.jerrick.userName);
  // });
  // $( "#jerrickthumb" ).click(function() {
  //   $( "#operatorClanTag" ).text(playersForOperators.jerrick.clanTag);
  //   $( "#operatorGamerTag" ).text(playersForOperators.jerrick.userName);
  // });
});



