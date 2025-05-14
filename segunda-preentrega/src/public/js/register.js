import logger from "../../config/logger.config";

document.addEventListener('DOMContentLoaded', () => {
    const formRegister = document.getElementById("registerForm");

    formRegister.addEventListener('submit', async (e) => {
        logger.INFO("Form enviado");

        try {
            e.preventDefault();

            const formData = new FormData(formRegister);
            const userData = Object.fromEntries(formData);

            const response = await fetch('http://localhost:8080/api/sessions/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData),
                credentials: "include"
            });

            const data = await response.json();
            logger.INFO("Respuesta del servidor:", data);

            const mensajeServidor = data?.message?.toLowerCase().trim();
            logger.INFO("Mensaje procesado:", mensajeServidor);

            if (mensajeServidor === "usuario registrado correctamente") {
                

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
                    logger.INFO("Redirigiendo a login...");
                    window.location.href = "http://localhost:8080/api/sessions/viewlogin";
                }, 3000);
            } else {
                logger.ERROR("NO se cumplió la condición del mensaje.");
            }
        } catch (e) {
            logger.ERROR("Error en el fetch:", e);
        }
    });
});
