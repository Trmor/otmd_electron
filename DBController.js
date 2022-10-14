const DB = require("./DB.js");
const DBC = require("./DBController.js");
const Sequelize = require("sequelize");

module.exports.userFind = function(){
    DB.User.findAll({
    raw: true,
    include: {
        model :DB.AccessLevel, 
        required: false,
    }
    }).then(users=>{
        console.log(users);
    });
};

module.exports.carriageFind = function(){
    DB.Carriage.findAll({
        raw:true,
        include:{
            model:DB.CarriageType,
            model:DB.CarriageStatus,
            model:DB.Cargo,
                include:{
                    model:DB.CargoType
                }
        }
    }).then(carriages=>{
        console.log(carriages);
    });
};

