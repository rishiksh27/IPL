let url="https://github.com/topics";
const request=require("request");
const cheerio=require("cheerio");
const getRespoPageHtml=require("./res");
request(url,cb);
function cb(err,response,html)
{
if (err)
 {
    console.log(err);
 }

 else if(response.statusCode==404)
 {
  console.log("page not found");
 }

else {
    getLink(html);
  }
}
function getLink(html)
{
let $=cheerio.load(html);
let h1s=$(".no-underline.d-flex.flex-column.flex-justify-center");
for(let i=0;i<h1s.length;i++)
{
    let link=$(h1s[i]).attr("href");
    let name=link.split("/").pop();
    let flink=`https://github.com/${link}`
    
    getRespoPageHtml(flink,name);

}
}
