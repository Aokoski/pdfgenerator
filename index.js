 const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const pdf = require('html-pdf');
const axios = require("axios");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your name?"
    },
    {
      type: "input",
      name: "location",
      message: "Where are you from?"
    },
    {
      type: "input",
      name: "color",
      message: "What is your favorite color?"
    },
    {
      type: "input",
      name: "github",
      message: "Enter your GitHub Username"
    }
  ]);
}

function generateHTML(answers, gitRes) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>
  <style>
          @page {
            margin: 0;
          }
         *,
         *::after,
         *::before {
         box-sizing: border-box;
         }
         html, body {
         padding: 0;
         margin: 0;
         }
         html, body, .wrapper {
         height: 100%;
         }
         .wrapper {
         background-color: ${answers.color};
         padding-top: 100px;
         }
         body {
         background-color: ${answers.color};
         -webkit-print-color-adjust: exact !important;
         font-family: 'Cabin', sans-serif;
         }
         main {
         background-color: #E9EDEE;
         height: auto;
         padding-top: 30px;
         }
         h1, h2, h3, h4, h5, h6 {
         font-family: 'BioRhyme', serif;
         margin: 0;
         }
         h1 {
         font-size: 3em;
         }
         h2 {
         font-size: 2.5em;
         }
         h3 {
         font-size: 2em;
         }
         h4 {
         font-size: 1.5em;
         }
         h5 {
         font-size: 1.3em;
         }
         h6 {
         font-size: 1.2em;
         }
         .photo-header {
         position: relative;
         margin: 0 auto;
         margin-bottom: -50px;
         display: flex;
         justify-content: center;
         flex-wrap: wrap;
         background-color: ${answers.color};
         color: ${answers.color};
         padding: 10px;
         width: 95%;
         border-radius: 6px;
         }
         .photo-header img {
         width: 250px;
         height: 250px;
         border-radius: 50%;
         object-fit: cover;
         margin-top: -75px;
         border: 6px solid ${answers.color};
         box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
         }
         .photo-header h1, .photo-header h2 {
         width: 100%;
         text-align: center;
         }
         .photo-header h1 {
         margin-top: 10px;
         }
         .links-nav {
         width: 100%;
         text-align: center;
         padding: 20px 0;
         font-size: 1.1em;
         }
         .nav-link {
         display: inline-block;
         margin: 5px 10px;
         }
         .workExp-date {
         font-style: italic;
         font-size: .7em;
         text-align: right;
         margin-top: 10px;
         }
         .container {
         padding: 50px;
         padding-left: 100px;
         padding-right: 100px;
         }
         .row {
           display: flex;
           flex-wrap: wrap;
           justify-content: space-between;
           margin-top: 20px;
           margin-bottom: 20px;
         }
         .card {
           padding: 20px;
           border-radius: 6px;
           background-color: ${answers.color};
           color: ${answers.color};
           margin: 20px;
         }
         
         .col {
         flex: 1;
         text-align: center;
         }
         a, a:hover {
         text-decoration: none;
         color: inherit;
         font-weight: bold;
         }
         @media print { 
          body { 
            zoom: .75; 
          } 
         }
      </style>
</head>
<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4">Hi! My name is ${answers.name}</h1>
    <p class="lead">I am from ${answers.location}.</p>
    <h3><span class="badge badge-secondary">Contact Me</span></h3>
    <ul class="list-group">
    <li class="list-group-item">My GitHub username is ${answers.github}</li>
    <li class="list-group-item">Bio: ${gitRes.data.bio}</li>
    <li class="list-group-item">Img: ${gitRes.data.avatar_url}</li>
    <li class="list-group-item">Followers: ${gitRes.data.followers}</li>
    <li class="list-group-item">Following: ${gitRes.data.following}</li>
    <li class="list-group-item">Profile: ${gitRes.data.html_url}</li>
    <li class="list-group-item">Repos: ${gitRes.data.repos_url}</li>
  </ul>
  </div>
</div>
</body>
</html>`;
}

async function init() {
  console.log("hi");
  try {
    const answers = await promptUser();
    const gitRes = await axios.get(`https://api.github.com/users/${answers.github}`)
    console.log(gitRes);
    const html = generateHTML(answers, gitRes);
   

    
    await writeFileAsync("index.html", html);
     

    var readHtml = fs.readFileSync('index.html', 'utf8');
    var options = { format: 'Letter' };
     
    pdf.create(readHtml, options).toFile('test.pdf', function(err, res) {
      if (err) return console.log(err);
      console.log(res); 
    });

    console.log("Successfully wrote to index.html");
  } catch (err) {
    console.log(err);
  }
}

init();
