
const socket = io();


socket.on('connect', () => {
    console.log('Conectado al servidor Socket.IO');
});

socket.emit("updatedProducts",(productos)=>{
    const productList = document.getElementById("productList");
    productList.innerHTML = productos.map((producto)=>`
    <li>
        <h3>${producto.title}</h3>
        <p>Precio: ${producto.price}</p>
        <p>Category: ${producto.category}</p>
        <p>Descripción: ${producto.description}</p>
        <p>Stock: ${producto.stock}</p>
    </li>
    `).join("")
})

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
});