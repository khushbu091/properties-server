module.exports = (sequelize, DataTypes) => {
  const PropertyType = sequelize.define(
    "property_type",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      property_type: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
    }
  );

  return PropertyType;
};
