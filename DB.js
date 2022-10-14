const Sequelize = require("sequelize");
const sequelize = new Sequelize("OtMD_DB", "postgres", "1488", {
    dialect: "postgres",
    host: "localhost",
    define:{
        timestamps:false
    }
});

const StartingStation = sequelize.define("startingstation",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

const DestinationStation = sequelize.define("destinationstation",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

const ShipmentStatus = sequelize.define("shipmentstatus",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

const User = sequelize.define("user",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull:false
    }
});

const AccessLevel = sequelize.define("accesslevel",{
    id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    }
}); 

const Carriage = sequelize.define("carriage",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    }
});

const CarriageType = sequelize.define("carriagetype",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

const CarriageStatus = sequelize.define("carriagestatus",{
    id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

const Cargo = sequelize.define("cargo",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

const CargoType = sequelize.define("cargotype",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

const Train = sequelize.define("train",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    }
});

const Shipment = sequelize.define("shipment",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
}, {
    timestamps: true
});

//Relations in DB
{
User.hasMany(Shipment);
Shipment.belongsTo(User);

StartingStation.hasMany(Shipment);
Shipment.belongsTo(StartingStation);

DestinationStation.hasMany(Shipment);
Shipment.belongsTo(DestinationStation);

Train.hasMany(Shipment);
Shipment.belongsTo(Train);

ShipmentStatus.hasMany(Shipment);
Shipment.belongsTo(ShipmentStatus);

AccessLevel.hasMany(User);
User.belongsTo(AccessLevel);

CarriageType.hasMany(Carriage);
Carriage.belongsTo(CarriageType);

CarriageStatus.hasMany(Carriage);
Carriage.belongsTo(CarriageStatus);

Cargo.hasMany(Carriage);
Carriage.belongsTo(Cargo);

CargoType.hasMany(Cargo);
Cargo.belongsTo(CargoType);

Train.hasMany(Carriage);
Carriage.belongsTo(Train);
}

// sequelize.sync().then(result=>console.log(result))
// .catch(err=> console.log(err));


//exports to DBC
module.exports = {
    StartingStation,
    DestinationStation,
    ShipmentStatus,
    User,
    AccessLevel, 
    Carriage,
    CarriageType,
    CarriageStatus,
    Cargo,
    CargoType,
    Train,
    Shipment
};
