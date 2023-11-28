const request = require('request')
const cheerio = require('cheerio')

const scoreCardObj = require('./scoreboard')


function  getAllmatchLink(uri) {
    request(uri , cb1)
    function cb1(error , response , html) {
        if(error){
            console.log(error)
        }
        else{
            getScoreboard(html)
        }
        
    }
    
}
function getScoreboard(html) {
    let $ = cheerio.load(html)
    let ScoreEleArr = $('a[data-hover="Scorecard"]')
    for(let i = 0 ; i<ScoreEleArr.length  ;i++){
        let scoreLink = $(ScoreEleArr[i]).attr('href')
        // console.log(scoreLink)
        let ScorefullLink = "https://www.espncricinfo.com" + scoreLink
        // console.log(ScorefullLink)

        scoreCardObj.ps(ScorefullLink)
    }
}

module.exports = {
    getAllmatch : getAllmatchLink
}
