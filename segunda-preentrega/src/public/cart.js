import logger from "../config/logger.config";

const addToCartButtons = document.querySelectorAll(".add-to-cart");
logger.INFO("botones encontrados:", addToCartButtons);
document.addEventListener("DOMContentLoaded", () => {
  logger.INFO("DOM completamente cargado");
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  logger.INFO("Botones encontrados:", addToCartButtons);
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      Swal.fire({
        title: "¡Producto agregado!",
        text: "agregaste un producto",
        icon: "success",
      });
      e.preventDefault();
      const productId = e.target.getAttribute("data-product-id");
      logger.INFO("Product ID (antes de enviar):", productId);

      if (!productId || productId.length !== 24) {
        logger.WARN("Product ID no válido:", productId);
        return;
      }

      fetch("/api/carts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
          }
          return response.json();
        })
        .then((data) => {
          logger.INFO("Respuesta del servidor:", data);
        })
        .catch((error) => {
          logger.ERROR("Error:", error);
        });
    });
  });
});
