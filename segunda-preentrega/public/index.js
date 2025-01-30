import { productsModel } from "../src/models/products.model";

const socket = io();


socket.on('connect', () => {
    console.log('Conectado al servidor Socket.IO');
});

socket.on("updatedProducts", (productos) => {
    const productList = document.getElementById("productList");
    productList.innerHTML = productos
      .map(
        (producto) => `
      <li>
          <h3>${producto.title}</h3>
          <p>Precio: ${producto.price}</p>
          <p>Categoría: ${producto.category}</p>
          <p>Descripción: ${producto.description}</p>
          <p>Stock: ${producto.stock}</p>
      </li>
      `
      )
      .join("");
  });

document.getElementById("addProductForm").addEventListener("submit",async(e)=>{
    e.preventDefault();

    const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
    await fetch('/api/products/agregar',{
        method:"POST",
        headers:{ "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    e.target.reset();
})

document.getElementById("deleteProductForm").addEventListener("submit",async(e)=>{
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
  
    await fetch('/api/products/borrar',{
        method:"POST",
        headers:{ "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    e.target.reset();
});id

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM completamente cargado");
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  console.log("Botones encontrados:", addToCartButtons);
  addToCartButtons.forEach(button => {
    button.addEventListener("click", async (e) => {
      console.log("Botón clickeado");
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
