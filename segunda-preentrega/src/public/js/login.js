document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById("loginForm")

    formLogin.addEventListener('submit', async (e)=> {
        try {
            e.preventDefault()
        
            const formData = new FormData(formLogin) //Consulto el HTML y lo transformo en un objeto iterator
            
            const userData = Object.fromEntries(formData) //Transformo un objeto iterator en un objeto simple
    
            const response = await fetch('http://localhost:8080/api/sessions/login', {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData),
                credentials:"include" //Permitir el trabajo via cookies
            })

            const data = await response.json()
            if(data?.message === "Usuario logueado correctamente") {
                Toastify({
                    text: data.message,
                    duration: 3000,
                    close: true,
                    gravity: "top", 
                    position: "right", 
                    stopOnFocus: true,  
                    style: {
                      background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    onClick: function(){} 
                  }).showToast();
                setTimeout(() => {
                    window.location.href = "http://localhost:8080/api/products"
                }, 3000);
                
            } else {
                console.log(data);
            }
        } catch (e) {
            console.log(e);
        }
    })
})