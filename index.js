const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require('./database/Resposta');

//Database
connection.authenticate()
          .then(() => {
            console.log("Conexão feita com o banco de dados!")
          })
          .catch((msgError)=> {
            console.log(msgError);
          })


//Estou dizendo para o Express
// (view engine)motor de html = ejs
app.set('view engine', 'ejs');
//usar arquivos estáticos arq css/img e etc.
app.use(express.static('public'));
//linkar o body-parser (que traduz os dados enviados)
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true}))

//Rotas
app.get("/",(req,res) => {
  Pergunta.findAll({ raw: true, order:[
    ['id', 'DESC'] //ASC - Crescente; DESC 
  ] }).then(perguntas => {
    res.render("index", {
      perguntas: perguntas
    });
  });
});

app.get("/perguntar",(req,res) => {
  res.render("perguntar");
});

app.post("/savequestion", (req,res) => {
  var titulo = req.body.titulo;
  var descricao = req.body.descricao;
  
  Pergunta.create({
    titulo: titulo,
    description: descricao
  }).then(() => {
    res.redirect("/");
  });
});

app.get("/pergunta/:id", (req, res) => {
   var id = req.params.id;
   Pergunta.findOne({
    where: {id: id}
   }).then(pergunta => {
     if(pergunta != undefined){

       Resposta.findAll({
        where: {perguntaId: pergunta.id},
        order: [['id', 'DESC']]
       }).then(respostas => {
        res.render("pergunta", {
          pergunta: pergunta,
          respostas: respostas
         });
       });
     }else{
       res.redirect("/");
     }
   })
});

app.post("/responder", (req, res) => {
  var corpo = req.body.corpo;
  var perguntaId = req.body.pergunta;

  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(() => {
    res.redirect("/pergunta/"+perguntaId);
  });
});

app.listen(8080,() => {
  console.log("App rodando");
});