document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById("loginForm");

    formLogin.addEventListener('submit', async (e) => {
        console.log("Form enviado");

        try {
            e.preventDefault();

            const formData = new FormData(formLogin);
            const userData = Object.fromEntries(formData);

            const response = await fetch('http://localhost:8080/api/sessions/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData),
                credentials: "include"
            });

            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            const mensajeServidor = data?.message?.toLowerCase().trim();
            console.log("Mensaje procesado:", mensajeServidor);

            if (mensajeServidor === "usuario logueado correctamente") {
                console.log("Entró en el IF, ejecutando Toastify...");

                Toastify({
                    text: data.message,
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();

                setTimeout(() => {
                    console.log("Redirigiendo a products...");
                    window.location.href = "http://localhost:8080/api/products";
                }, 3000);
            } else {
                console.log("NO se cumplió la condición del mensaje.");
            }
        } catch (e) {
            console.log("Error en el fetch:", e);
        }
    });
});
