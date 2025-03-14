const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("../src/models/userModel")(sequelize, Sequelize);
db.Property = require("../src/models/PropertyModel")(sequelize, Sequelize);
db.PropertyType = require("../src/models/PropertyTypeModel")(
  sequelize,
  Sequelize
);
db.Image = require("../src/models/ImageModel")(sequelize, Sequelize);

// Define Relationships
db.PropertyType.hasMany(db.Property, {
  foreignKey: "property_type_id",
  as: "properties",
});
db.Property.belongsTo(db.PropertyType, {
  foreignKey: "property_type_id",
  as: "propertyType",
}); // Fixed alias

db.User.hasMany(db.Property, { foreignKey: "user_id" });
db.Property.belongsTo(db.User, { foreignKey: "user_id" });

db.Property.hasMany(db.Image, { foreignKey: "property_id", as: "images" });
db.Image.belongsTo(db.Property, { foreignKey: "property_id", as: "property" });

sequelize.sync({ alter: true });

module.exports = db;
