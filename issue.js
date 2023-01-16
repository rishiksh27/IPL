const request=require("request");
const cheerio=require("cheerio");
const fs=require("fs");
const path=require("path");
const PDFDocument = require('pdfkit');
function getissues(url,name,responame)
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
        getiname(html);
    }
    }

function getiname(html)
      {
let $=cheerio.load(html);
let h1s=$(".markdown-title");

console.log(h1s.length);

for(let i=0;i<h1s.length;i++)
{
    let text=$(h1s[i]).text();
  //  console.log(name," ",text);
    let folderpath=path.join(__dirname,name);
    dircreate(folderpath);
    let filepath=path.join(folderpath,responame+".json");
    fs.writeFileSync(filepath,text);

    let pdfDoc = new PDFDocument;
pdfDoc.pipe(fs.createWriteStream(filepath));
pdfDoc.text(name);
pdfDoc.end();
}

}

}
function dircreate(folderpath)
{
if(fs.existsSync(folderpath)==false)
{
    fs.mkdirSync(folderpath);
}
}

module.exports=getissues;