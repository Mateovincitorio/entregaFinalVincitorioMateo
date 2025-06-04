import swaggerJsDoc from "swagger-jsdoc";
import __dirname from "../../utils.js";

const opts = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "CODER COMMERCE 70435",
      description: "Documentación de la API de CoderCommerce70435",
    },
  },
  apis: [__dirname + "/src/docs/*.yaml"],
};
const swaggerSpecs = swaggerJsDoc(opts);

export default swaggerSpecs;
