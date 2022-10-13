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
AccessLevel.hasMany(User);

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
CarriageType.hasMany(Carriage);

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
CarriageStatus.hasMany(Carriage);

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
Cargo.hasMany(Carriage);

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

CargoType.hasMany(Cargo);

const Train = sequelize.define("train",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    }
});
Train.hasMany(Carriage);

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
User.hasMany(Shipment);
StartingStation.hasMany(Shipment);
DestinationStation.hasMany(Shipment);
Train.hasMany(Shipment);
ShipmentStatus.hasMany(Shipment);

sequelize.sync().then(result=>console.log(result))
.catch(err=> console.log(err));
