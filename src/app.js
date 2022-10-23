const DB = require("./DB");
const Sequelize = require("sequelize");
const express = require("express");
const expressHbs = require("express-handlebars");
const hbs = require("hbs");
const app = express();
const urlencodedParser = express.urlencoded({extended: false});
 
const sequelize = DB.sequelize;

app.engine("hbs", expressHbs.engine(
  {
      layoutsDir: "views/layouts", 
      defaultLayout: "layout",
      extname: "hbs"
  }
))
hbs.registerPartials(__dirname + "/views/partials");

app.set("view engine", "hbs");

// синхронизация с бд, после успшной синхронизации запускаем сервер
sequelize.sync().then(()=>{
  app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
  });
}).catch(err=>console.log(err));
 
//users module
{
app.get("/", function(req, res){
    DB.User.findAll(
      {
        include: { 
          model: DB.AccessLevel,
        },
        raw: true,
      },
      ).then(data=>{
      console.log(data);
      res.render("view/index.hbs", {
        users: data
      });
    }).catch(err=>console.log(err));
});

app.get("/create/user", function(req, res){
  DB.AccessLevel.findAll({raw:true}).then(data=>{
    console.log(data);
    res.render("create/user.hbs", {accesslevels: data})})
  .catch(err=>console.log(err));
});
 
// добавление данных
app.post("/create/user", urlencodedParser, function (req, res) {
         
    if(!req.body) return res.sendStatus(400);
    
    const username = req.body.name;
    const password = req.body.password;
    const accesslevel = req.body.accesslevel;
    DB.User.create({ name: username, password: password, accesslevelId: accesslevel}).then(()=>{
      res.redirect("/");
    }).catch(err=>console.log(err));
});
 
// получаем объект по id для редактирования
app.get("/edit/user/:id", function(req, res){
  const userid = req.params.id;
  const user = DB.User.findAll({where:{id: userid},
    include: { 
    model: DB.AccessLevel,
  }, 
  raw: true,
  });
  const accesslevel = DB.AccessLevel.findAll({raw: true});
  Promise.all([user, accesslevel]).then(data=>{
    console.log(data);
    res.render("edit/user.hbs", {
      user: data
    });
  })
  .catch(err=>console.log(err));
});
 
// обновление данных в БД
app.post("/edit/user", urlencodedParser, function (req, res) {
         
  if(!req.body) return res.sendStatus(400);
 
  const username = req.body.name;
  const accesslevel = req.body.accesslevel;
  const userid = req.body.id;
  DB.User.update({name:username, accesslevelId: accesslevel}, {where: {id: userid} }).then(() => {
    res.redirect("/");
  })
  .catch(err=>console.log(err));
});
 
// удаление данных
app.post("/delete/user/:id", function(req, res){  
  const userid = req.params.id;
  DB.User.destroy({where: {id: userid} }).then(() => {
    res.redirect("/");
  }).catch(err=>console.log(err));
});
}

//carriages module
{
app.get("/carriages", function(req, res){
  DB.Carriage.findAll(
    {
      include:[
        {model: DB.CarriageStatus},
        {model: DB.CarriageType},
        {model: DB.Cargo, 
          include: DB.CargoType,
        },
      ],
    raw: true,
    }
  ).then(data=>{
    res.render("view/carriages.hbs",{
      carriages: data
    });
  }).catch(err=>console.log(err));
});

app.get("/create/carriage", function(req, res){
  let train; let cargo; let carriagestatus; let carriagetype;
  train = DB.Train.findAll({raw:true});
  carriagestatus = DB.CarriageStatus.findAll({raw:true});
  carriagetype = DB.CarriageType.findAll({raw:true});
  cargo = DB.Cargo.findAll({raw:true});
  Promise.all([train, carriagestatus, carriagetype, cargo]).then(data=>{
    console.log(data);
    res.render("create/carriage.hbs", {carriage:data})
  }).catch(err=>console.log(err));
});

app.post("/create/carriage", urlencodedParser, function(req, res){

  if(!req.body) return res.sendStatus(400);
 
  const id = req.body.id;
  const train = req.body.train;
  const carriagestatus = req.body.carriagestatus;
  const carriagetype = req.body.carriagetype;
  const cargo = req.body.cargo;
  DB.Carriage.create( {
    id: id,
    carriagetypeId:carriagetype,
    carriagestatusId:carriagestatus,
    cargoId: cargo,
    train: train
  }  ).then(() => {
    res.redirect("/carriages");
  })
  .catch(err=>console.log(err));
});

app.get("/edit/carriage/:id", function(req, res){
  const id = req.params.id;
  let carriage;let train; let carriagestatus; let carriagetype; let cargo; 
  carriagestatus = DB.CarriageStatus.findAll({raw: true});
  carriagetype = DB.CarriageType.findAll({raw: true});
  cargo = DB.Cargo.findAll({raw: true});
  train = DB.Train.findAll({raw: true});
  carriage = DB.Carriage.findAll({where:{id: id},
    include:[
      {model: DB.CarriageStatus},
      {model: DB.CarriageType},
      {model: DB.Cargo}
    ],
  raw: true
  });
  Promise.all([carriage, train, carriagestatus, carriagetype, cargo]).then(data=>{
    console.log(data);
    res.render("edit/carriage.hbs", {
      carriage: data
    });
  }).catch(err=>console.log(err));
});

app.post("/edit/carriage", urlencodedParser, function (req, res) {
         
  if(!req.body) return res.sendStatus(400);
 
  const id = req.body.id;
  const train = req.body.train;
  const carriagestatus = req.body.carriagestatus;
  const carriagetype = req.body.carriagetype;
  const cargo = req.body.cargo;
  DB.Carriage.update(
    {
      carriagetypeId: carriagetype,
      carriagestatusId: carriagestatus,
      cargoId: cargo,
      trainId: train
    },
    {
      where: {id: id} 
    }).then(() => {
    res.redirect("/carriages");
  })
  .catch(err=>console.log(err));
});

app.post("/delete/carriage/:id", function(req, res){  
  const carriageid = req.params.id;
  DB.Carriage.destroy({where: {id: carriageid} }).then(() => {
    res.redirect("/carriages");
  }).catch(err=>console.log(err));
});

}//carriages module

module.exports.close = function(){
  sequelize.close();
}