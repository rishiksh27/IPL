const request=require("request");
const cheerio=require("cheerio");
const getissues=require("./issue");
function getRespoPageHtml(url,name)
{
    request(url,cb);
function cb(err,response,html)
{
if(err)
{
    console.log(err);
}

else if(response.statusCode==404)
 {
  console.log("page not found");
 }


else{
    getRespoLink(html);
}
}

function getRespoLink(html)
{
let $=cheerio.load(html);
let h1s=$(".f3.color-fg-muted.text-normal.lh-condensed");

console.log(name);
for(let i=0;i<h1s.length;i++)
{
    let respo=$(h1s[i]).find("a");
    link=$(respo[1]).attr("href");
    responame=link.split("/").pop();
    flink=`https://github.com/${link}/issues`;
    getissues(flink,name,responame);
}
console.log("_____________");
}
}

module.exports=getRespoPageHtml;
