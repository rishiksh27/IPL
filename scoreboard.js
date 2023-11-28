// const url =
//   "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";

const request = require("request");
const cheerio = require("cheerio");

const path = require("path");
const fs = require("fs");

const xlsx = require("xlsx");

function processScoreCard(url) {
  request(url, cb);
}

function cb(error, response, html) {
  if (error) {
    console.log(error);
  } else {
    extractMatchdetails(html);
  }
}
// request(url, function (error, response, html) {
//   if (error) {
//     console.log(error);
//   } else {
//     extractMatchdetails(html);
//   }
// });

function extractMatchdetails(html) {
  let $ = cheerio.load(html);

  let desEle = $(".header-info .description");
  // console.log(desEle.text())

  let descArr = desEle.text().split(",");
  // console.log(descArr)

  let venue = descArr[1].trim();
  let date = descArr[2].trim();

  // console.log(venue)
  // console.log(date)

  let result = $(
    ".match-info.match-info-MATCH.match-info-MATCH-half-width .status-text"
  ).text();

  console.log(result);

  console.log("-----------------------------------------");
  let innings = $(".card.content-block.match-scorecard-table>.Collapsible");
  // console.log(innings)

  let htmlString = "";

  for (let i = 0; i < innings.length; i++) {
    htmlString += $(innings[i]).html();

    let teamName = $(innings[i]).find("h5").text();
    teamName = teamName.split("INNINGS")[0].trim();

    let opponentIndex = i == 0 ? 1 : 0;

    let opponentTeam = $(innings[opponentIndex]).find("h5").text();

    opponentTeam = opponentTeam.split("INNINGS")[0].trim();

    // console.log(venue , date , teamName , opponentTeam , result)

    // * String Literals
    // console.log(`${venue} , | ${date} , | ${teamName} , |  ${opponentTeam} , | ${result}`)

    let cInning = $(innings[i]);

    let allRows = cInning.find(".table.batsman tbody tr");

    for (let j = 0; j < allRows.length; j++) {
      let allCols = $(allRows[j]).find("td");
      let isWorthy = $(allCols[0]).hasClass("batsman-cell");

      if (isWorthy == true) {
        //  Player Name  , runs , balls , fours , sixes , Str

        let playerName = $(allCols[0]).text().trim();
        let runs = $(allCols[2]).text().trim();
        let balls = $(allCols[3]).text().trim();
        let fours = $(allCols[5]).text().trim();
        let sixes = $(allCols[6]).text().trim();
        let STR = $(allCols[7]).text().trim();

        console.log(
          `${playerName} | ${runs} | ${balls} | ${fours} | ${sixes} | ${STR} | `
        );
        playerProcess(
          teamName,
          playerName,
          runs,
          balls,
          fours,
          sixes,
          STR,
          opponentTeam,
          venue,
          result,
          date
        );
      }
    }
    console.log("----------------------------------------");
  }

  // console.log(htmlString)
}

function playerProcess(
  teamName,
  playerName,
  runs,
  balls,
  fours,
  sixes,
  STR,
  opponentTeam,
  venue,
  result,
  date
) {
  let teamPath = path.join(__dirname, "IPL", teamName);
  dirCreator(teamPath);

  let filePath = path.join(teamPath, playerName + ".xlsx");
  let content = excelReader(filePath, playerName);

  let playerObj = {
    teamName,
    playerName,
    runs,
    balls,
    fours,
    sixes,
    STR,
    opponentTeam,
    venue,
    result,
    date,
  };
  content.push(playerObj)
  excelWriter(filePath , content , playerName)

}

function dirCreator(filePath) {
  if (fs.existsSync(filePath) == false) {
    fs.mkdirSync(filePath);
  }
}

function excelWriter(filePath, jsonData, sheetname) {
  let newWB = xlsx.utils.book_new();
  let newWS = xlsx.utils.json_to_sheet(jsonData);
  xlsx.utils.book_append_sheet(newWB, newWS, sheetname);
  xlsx.writeFile(newWB, filePath);
}

function excelReader(filePath, sheetname) {
  if (fs.existsSync(filePath) == false) {
    return [];
  }
  let wb = xlsx.readFile(filePath);
  let excelData = wb.Sheets[sheetname];
  let ans = xlsx.utils.sheet_to_json(excelData);
  return ans;
}

module.exports = {
  ps: processScoreCard,
};
