// Función para abrir el modal de edición
const showEditModal = (ID_ADMIN, ID_PRIVATEZONE, NOMBRE, APELLIDO) => {
    const form = document.getElementById('edit-admin-form');
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('edit-admin-modal').style.display = 'block';
    form['ID_ADMIN'].value = ID_ADMIN;
    form['ID_PRIVATEZONE'].value = ID_PRIVATEZONE;
    form['NOMBRE'].value = NOMBRE;
    form['APELLIDO'].value = APELLIDO;
    document.getElementById('submit-update-button').textContent = 'Update Admin';
};

// Función para obtener los admins
const getAdmins = async () => {
    try {
        const url = 'http://localhost:8080/TFG/Controller?ACTION=ADMIN.FIND_ALL';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const admins = await response.json();
        createAdminDetail(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
    }
};

// Función para crear los detalles de los admins
const createAdminDetail = (admins) => {
    const adminsTableBody = document.querySelector('table tbody');
    adminsTableBody.innerHTML = '';
    admins.forEach(admin => {
        const { ID_ADMIN, ID_PRIVATEZONE, NOMBRE, APELLIDO } = admin;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ID_ADMIN}</td>
            <td>${ID_PRIVATEZONE}</td>
            <td>${NOMBRE}</td>
            <td>${APELLIDO}</td>
            <td class="action-buttons">
                <button class="update-button" data-id="${ID_ADMIN}" data-privatezone="${ID_PRIVATEZONE}" data-nombre="${NOMBRE}" data-apellido="${APELLIDO}">Update</button>
                <button class="delete-button" data-id="${ID_ADMIN}">Delete</button>
                <button class="add-button" data-id="${ID_ADMIN}">Añadir Admin</button>
            </td>
        `;
        adminsTableBody.appendChild(row);

        row.querySelector('.update-button').addEventListener('click', (event) => {
            const button = event.target;
            const id = button.getAttribute('data-id');
            const privatezone = button.getAttribute('data-privatezone');
            const nombre = button.getAttribute('data-nombre');
            const apellido = button.getAttribute('data-apellido');
            showEditModal(id, privatezone, nombre, apellido);
        });
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', async () => {
            const id = button.getAttribute('data-id');
            await deleteAdmin(id);
        });
    });

    document.querySelectorAll('.add-button').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('add-admin-form').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
        });
    });
};

// Función para eliminar admins
const deleteAdmin = async (id) => {
    const url = `http://localhost:8080/TFG/Controller?ACTION=ADMIN.DELETE&ID_ADMIN=${id}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `ID_ADMIN=${id}`
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log(`Admin con ID ${id} eliminado.`);
        getAdmins();
    } catch (error) {
        console.error('Error deleting admin:', error);
    }
};

// Función para agregar admins
const addAdmin = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const isUpdate = formData.get('isUpdate') === 'true';
    const adminData = {
        ID_ADMIN: formData.get('ID_ADMIN'),
        ID_PRIVATEZONE: formData.get('ID_PRIVATEZONE'),
        NOMBRE: formData.get('NOMBRE'),
        APELLIDO: formData.get('APELLIDO')
    };

    const url = `http://localhost:8080/TFG/Controller?ACTION=ADMIN.${isUpdate ? 'UPDATE' : 'ADD'}`;
    const method = isUpdate ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        getAdmins();
        document.getElementById('add-admin-form').reset();
        document.getElementById('add-admin-form').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('submit-button').textContent = 'Add Admin';
        document.getElementById('isUpdate').value = 'false';
    } catch (error) {
        console.error('Error adding or updating admin:', error);
    }
};

// Función para actualizar admins
const updateAdmin = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const adminData = {
        ID_ADMIN: formData.get('ID_ADMIN'),
        ID_PRIVATEZONE: formData.get('ID_PRIVATEZONE'),
        NOMBRE: formData.get('NOMBRE'),
        APELLIDO: formData.get('APELLIDO')
    };

    console.log('Datos capturados del formulario:', adminData);

    const url = `http://localhost:8080/TFG/Controller?ACTION=ADMIN.UPDATE`;

    console.log('URL utilizada para la actualización:', url);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminData)
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
        }

        let result;
        try {
            result = await response.json();
        } catch (e) {
            console.error('Error parseando JSON:', e.message);
            throw new Error(`Error parseando JSON: ${e.message}`);
        }

        console.log('Respuesta del servidor:', result);

        getAdmins();  // Asegúrate de que getAdmins esté en el alcance
        document.getElementById('edit-admin-form').reset();
        document.getElementById('edit-admin-modal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    } catch (error) {
        console.error('Error updating admin:', error.message);
    }
};

// Función para cerrar el modal de edición
const closeModal = () => {
    document.getElementById('edit-admin-modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
};

// Función para cerrar el modal de agregar
const closeAddModal = () => {
    document.getElementById('add-admin-form').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
};

// Añadir los event listeners después de definir todas las funciones
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-admin-form').addEventListener('submit', addAdmin);
    document.getElementById('edit-admin-form').addEventListener('submit', updateAdmin);
    getAdmins();
});
