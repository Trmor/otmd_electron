const DB = require("./DB");
const Sequelize = require("sequelize");
const express = require("express");
const expressHbs = require("express-handlebars");
const hbs = require("hbs");
const { TIME } = require("sequelize");
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
      res.render("view/index.hbs", {
        users: data
      });
    }).catch(err=>console.log(err));
});

app.get("/create/user", function(req, res){
  DB.AccessLevel.findAll({raw:true}).then(data=>{
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

}

//cargos module
{
  app.get("/cargos", function(req, res){
    DB.Cargo.findAll(
      {
        include: { 
          model: DB.CargoType,
        },
        raw: true,
      },
      ).then(data=>{
      console.log(data);
      res.render("view/cargos.hbs", {
        cargos: data
      });
    }).catch(err=>console.log(err));
});

app.get("/create/cargo", function(req, res){
  DB.CargoType.findAll({raw:true}).then(data=>{
    console.log(data);
    res.render("create/cargo.hbs", {cargotypes: data})})
  .catch(err=>console.log(err));
});
 
app.post("/create/cargo", urlencodedParser, function (req, res) {
         
    if(!req.body) return res.sendStatus(400);
    
    const id = req.body.id;
    const name = req.body.name;
    const cargotype = req.body.cargotype;
    if(!req.body.id){
    DB.Cargo.create({ name: name, cargotypeId: cargotype}).then(()=>{
      res.redirect("/cargos");
    }).catch(err=>console.log(err));
    }
    else 
    {
    DB.Cargo.create({ id: id, name: name, cargotypeId: cargotype}).then(()=>{
      res.redirect("/cargos");
    }).catch(err=>console.log(err));
    }
});

app.get("/edit/cargo/:id", function(req, res){
  const id = req.params.id;
  const cargo = DB.Cargo.findAll({where:{id: id},
    include: { 
    model: DB.CargoType,
  }, 
  raw: true,
  });
  const cargotypes = DB.CargoType.findAll({raw: true});
  Promise.all([cargo, cargotypes]).then(data=>{
    res.render("edit/cargo.hbs", {
      cargo: data
    });
  })
  .catch(err=>console.log(err));
});
 
app.post("/edit/cargo", urlencodedParser, function (req, res) {
         
  if(!req.body) return res.sendStatus(400);

  const id = req.body.id;
  const name = req.body.name;
  const cargotype = req.body.cargotype;
  DB.Cargo.update({name: name, cargotypeId: cargotype}, {where: {id: id} }).then(() => {
    res.redirect("/cargos");
  })
  .catch(err=>console.log(err));
});

app.post("/delete/cargo/:id", function(req, res){  
  const cargo = req.params.id;
  DB.Cargo.destroy({where: {id: cargo} }).then(() => {
    res.redirect("/cargos");
  }).catch(err=>console.log(err));
});

}

//shipment module
{
  app.get("/shipments", function(req, res){
    DB.Shipment.findAll(
      {
        include: [
          {model: DB.User},
          {model: DB.Train},
          {model: DB.StartingStation},
          {model: DB.DestinationStation},
          {model: DB.ShipmentStatus}
        ],
        raw: true,
      },
      ).then(data=>{
      res.render("view/shipments.hbs", {
        shipments: data
      });
    }).catch(err=>console.log(err));
});

app.get("/create/shipment", function(req, res){
let user; let shipmentstatus; let startingstation; let destinationstation;
user = DB.User.findAll({raw: true});
train = DB.Train.findAll({raw:true});  
shipmentstatus = DB.ShipmentStatus.findAll({raw: true});
startingstation = DB.StartingStation.findAll({raw: true});
destinationstation = DB.DestinationStation.findAll({raw: true});
Promise.all([user, startingstation, destinationstation, train, shipmentstatus]).then(data=>{
    res.render("create/shipment.hbs", {shipment: data})})
  .catch(err=>console.log(err));
});
 
app.post("/create/shipment", urlencodedParser, function (req, res) {
         
    if(!req.body) return res.sendStatus(400);
    
    const id = req.body.id;
    const user = req.body.user;
    const startingstation = req.body.startingstation;
    const destinationstation = req.body.destinationstation;
    const train = req.body.train;
    const shipmentstatus = req.body.shipmentstatus;
    if(!req.body.id){
      DB.Shipment.create({
        userId: user,
        startingstationId: startingstation,
        destinationstationId: destinationstation,
        trainId: train,
        shipmentstatusId: shipmentstatus
      }).then(()=>{
        res.redirect("/shipments");
      }).catch(err=>console.log(err));
    }else{
      DB.Shipment.create({
        id: id,
        userId: user,
        startingstationId: startingstation,
        destinationstationId: destinationstation,
        trainId: train,
        shipmentstatusId: shipmentstatus
      }).then(()=>{
        res.redirect("/shipments");
      }).catch(err=>console.log(err));
    }
});
 
app.get("/edit/shipment/:id", function(req, res){
  const id = req.params.id;
  let shipment = DB.Shipment.findAll({where:{id: id},
    include: [
      {model: DB.User},
      {model: DB.Train},
      {model: DB.StartingStation},
      {model: DB.DestinationStation},
      {model: DB.ShipmentStatus}
    ],
    raw: true
  });
  let user = DB.User.findAll({raw: true});
  let train = DB.Train.findAll({raw: true});
  let startingstation = DB.StartingStation.findAll({raw: true});
  let destinationstation = DB.DestinationStation.findAll({raw:true});
  let shipmentstatus = DB.ShipmentStatus.findAll({raw: true});
  Promise.all([shipment ,user, startingstation, destinationstation, train, shipmentstatus]).then(data=>{
    console.log(data);
    res.render("edit/shipment.hbs", {
      shipment: data
    });
  })
  .catch(err=>console.log(err));
});
 
app.post("/edit/shipment", urlencodedParser, function (req, res) {
         
  if(!req.body) return res.sendStatus(400);
 
  const id = req.body.id;
  const user = req.body.user;
  const startingstation = req.body.startingstation;
  const destinationstation = req.body.destinationstation;
  const train = req.body.train;
  const shipmentstatus = req.body.shipmentstatus;
  DB.Shipment.update({
    userId: user,
    startingstationId: startingstation,
    destinationstationId: destinationstation,
    trainId: train,
    shipmentstatusId:shipmentstatus
  }, {where: {id: id} }).then(() => {
    res.redirect("/shipments");
  })
  .catch(err=>console.log(err));
});
 
app.post("/delete/shipment/:id", function(req, res){  
  const id = req.params.id;
  DB.Shipment.destroy({where: {id: id} }).then(() => {
    res.redirect("/shipments");
  }).catch(err=>console.log(err));
});

}

module.exports.close = function(){
  sequelize.close();
}