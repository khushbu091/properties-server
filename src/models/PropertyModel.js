module.exports = (sequelize, DataTypes) => {
  const Property = sequelize.define(
    "property",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      property_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "property_types",
          key: "id",
        },
      },
      title: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      spaciousLife: {
        type: DataTypes.STRING,
      },
      noOfBedrooms: {
        type: DataTypes.INTEGER,
      },
      noOfBathrooms: {
        type: DataTypes.INTEGER,
      },
      listedProperties: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      approve: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return Property;
};
