const { Property, PropertyType, Image } = require("../../config/db");

const createPropertyType = async (req, res) => {
  try {
    const { property_type } = req.body;

    const existingPropertyType = await PropertyType.findOne({
      where: { property_type: property_type },
    });

    if (existingPropertyType) {
      return res.status(409).json({ message: "Property type already exists" });
    }
    const newPropertyType = await PropertyType.create({
      property_type: property_type,
    });

    res.status(201).json({
      message: "Property type created successfully",
      data: newPropertyType,
    });
  } catch (error) {
    console.error("Error creating property type:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const createProperty = async (req, res) => {
  try {
    const {
      user_id,
      property_type_id,
      title,
      price,
      description,
      spaciousLife,
      noOfBedrooms,
      noOfBathrooms,
      listedProperties,
      address,
    } = req.body;
    const images = req.files;

    if (!images || images.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "At least one image is required." });
    }

    const mainImage = `${images[0].filename}`;

    const property = await Property.create({
      user_id,
      property_type_id,
      title,
      price,
      description,
      spaciousLife,
      noOfBedrooms,
      noOfBathrooms,
      listedProperties,
      address,
      main_img: mainImage,
    });

    const imageRecords = images.map((image) => ({
      property_id: property.id,
      image_url: `${image.filename}`,
    }));

    await Image.bulkCreate(imageRecords);

    res.status(201).json({
      status: true,
      message: "Property created successfully",
      property,
      images: imageRecords,
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};
const getPropertiesByType = async (req, res) => {
  try {
    const { propertyTypeId } = req.params;

    if (!propertyTypeId) {
      return res.status(400).json({ message: "Property Type ID is required" });
    }

    // Find the property type
    const propertyType = await PropertyType.findByPk(propertyTypeId);

    if (!propertyType) {
      return res.status(404).json({ message: "Property Type not found" });
    }

    // Fetch all listings related to this property type
    const properties = await Property.findAll({
      where: { property_type_id: propertyTypeId },
      //   attributes: ["id", "title", "description", "price"],
      include: [
        {
          model: Image,
          as: "images",
          attributes: ["id", "image_url"], // Only return image_id and image_url
        },
      ],
      order: [["title", "ASC"]], // Sort by title for better display
    });

    res.status(200).json({
      message: `Properties under ${propertyType.property_type}`,
      data: properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPropertyType = async (req, res) => {};
const getProperty = async (req, res) => {};

const updateProperty = async (req, res) => {};

const deleteProperty = async (req, res) => {};

module.exports = {
  createProperty,
  createPropertyType,
  getProperty,
  getPropertyType,
  updateProperty,
  deleteProperty,
  getPropertiesByType,
};
