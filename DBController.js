const DB = require("./DB.js");
const DBC = require("./DBController.js");

async function getUsers(){ 
const users = await DB.User.findAll({
    include: {
        model :DB.AccessLevel, 
        required: false,
    }});
    console.log(JSON.stringify(users, null, 2));
}

async function getCarriage(){
const carriages = await DB.Carriage.findAll({
    raw:true,
    include:{
        model:DB.CarriageType,
        model:DB.CarriageStatus,
        model:DB.Cargo,
            include:{
                model:DB.CargoType
            }
    }});
    console.log(JSON.stringify(carriages, null, 2));
}

module.exports = {
    getUsers,
    getCarriage,
}