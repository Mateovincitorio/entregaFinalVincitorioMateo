



const addToCartButtons = document.querySelectorAll(".add-to-cart");
console.log("botones encontrados:",addToCartButtons)
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM completamente cargado");
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  console.log("Botones encontrados:", addToCartButtons);
  addToCartButtons.forEach(button => {
    button.addEventListener("click", async (e) => {
        Swal.fire({
            title: "¡Producto agregado!",
            text: "agregaste un producto",
            icon: "success"
        });
      e.preventDefault();
      const productId = e.target.getAttribute("data-product-id");
      console.log("Product ID (antes de enviar):", productId);

      if (!productId || productId.length !== 24) {
        console.error("Product ID no válido:", productId);
        return;
      }

      fetch('/api/carts/add', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId })
    })

    .then(response => {
      if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
      }
      return response.json();
  })  
  .then(data =>{
    console.log("Respuesta del servidor:", data);
  })
  .catch(error => {
    console.error("Error:", error);
});
    });
    
  });
});
