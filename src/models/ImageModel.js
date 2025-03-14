module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    "image",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      property_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "properties",
          key: "id",
        },
      },
      image_url: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
    }
  );

  return Image;
};
