document.addEventListener('DOMContentLoaded', function() {
    const closeButton = document.querySelector('.close-btn');
    const openRegisterModalButton = document.getElementById('openRegisterModal');
    const registerModal = document.getElementById('registerModal');
    const closeModalButton = document.querySelector('.modal .close');

    closeButton.onclick = function () {
        window.location.href = '/html/my_grill_galaxy.html'; // Redirige al usuario a la página principal o donde desees
    }

    openRegisterModalButton.onclick = function() {
        registerModal.style.display = "block";
    }

    closeModalButton.onclick = function() {
        registerModal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == registerModal) {
            registerModal.style.display = "none";
        }
    }

    // Manejar el formulario de inicio de sesión

    const users = [
        { email: 'admin@galxy.com', password: 'admin123', role: 'admin' },
        { email: 'empleado@galaxy.com', password: 'empleado123', role: 'empleado' }
    ];
    localStorage.setItem('users', JSON.stringify(users));
    
    
    document.getElementById('loginForm').onsubmit = function (event) {
        event.preventDefault();
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;

        // Comprobar credenciales de usuario
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const user = storedUsers.find(user => user.email === email && user.password === password);

        if (user) {
            if (user.role === 'admin') {
                window.location.href = '/Html/PrivateZone_admin.html'; // Redirige a la página de administrador
            } else if (user.role === 'empleado') {
                window.location.href = '/Html/PrivateZone_empleados.html'; // Redirige a la página de empleado
            } else {
                alert('Acceso denegado.');
            }
        } else {
            alert('Acceso denegado.');
        }
    }

    // Función para agregar cliente
    const addCliente = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const isUpdate = formData.get('isUpdate') === 'true';
        const clienteData = {
            ID_CLIENTE: formData.get('ID_CLIENTE'),
            NOMBRE: formData.get('NOMBRE'),
            APELLIDO: formData.get('APELLIDO'),
            DIRECCION: formData.get('DIRECCION'),
            CORREO: formData.get('CORREO'),
            password: formData.get('password')
        };

        const url = `http://localhost:8080/TFG/Controller?ACTION=CLIENTE.${isUpdate ? 'UPDATE' : 'ADD'}`;
        const method = isUpdate ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clienteData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Aquí puedes añadir cualquier acción que necesites después de registrar el cliente
            document.getElementById('registerForm').reset();
            registerModal.style.display = 'none';
            document.getElementById('submit-button').textContent = 'REGISTER';
            document.getElementById('isUpdate').value = 'false';
        } catch (error) {
            console.error('Error adding or updating cliente:', error);
        }
    };

    document.getElementById('registerForm').addEventListener('submit', addCliente);
});
