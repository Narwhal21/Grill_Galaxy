// Función para abrir el modal de edición
const showEditModal = (ID_EMPLEADO, ID_PRIVATEZONE, NOMBRE, APELLIDO) => {
    const form = document.getElementById('edit-empleado-form');
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('edit-empleado-modal').style.display = 'block';
    form['ID_EMPLEADO'].value = ID_EMPLEADO;
    form['ID_PRIVATEZONE'].value = ID_PRIVATEZONE;
    form['NOMBRE'].value = NOMBRE;
    form['APELLIDO'].value = APELLIDO;
    document.getElementById('submit-update-button').textContent = 'Update Empleado';
};

// Función para obtener los empleados
const getEmpleados = async () => {
    try {
        const url = 'http://localhost:8080/TFG/Controller?ACTION=EMPLEADO.FIND_ALL';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const empleados = await response.json();
        createEmpleadoDetail(empleados);
    } catch (error) {
        console.error('Error fetching empleados:', error);
    }
};

// Función para crear los detalles de los empleados
const createEmpleadoDetail = (empleados) => {
    const empleadosTableBody = document.querySelector('table tbody');
    empleadosTableBody.innerHTML = '';
    empleados.forEach(empleado => {
        const { ID_EMPLEADO, ID_PRIVATEZONE, NOMBRE, APELLIDO } = empleado;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ID_EMPLEADO}</td>
            <td>${ID_PRIVATEZONE}</td>
            <td>${NOMBRE}</td>
            <td>${APELLIDO}</td>
            <td class="action-buttons">
                <button class="update-button" data-id="${ID_EMPLEADO}" data-privatezone="${ID_PRIVATEZONE}" data-nombre="${NOMBRE}" data-apellido="${APELLIDO}">Update</button>
                <button class="delete-button" data-id="${ID_EMPLEADO}">Delete</button>
                <button class="add-button" data-id="${ID_EMPLEADO}">Añadir Empleado</button>
            </td>
        `;
        empleadosTableBody.appendChild(row);

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
            await deleteEmpleado(id);
        });
    });

    document.querySelectorAll('.add-button').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('add-empleado-form').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
        });
    });
};

// Función para eliminar empleados
const deleteEmpleado = async (id) => {
    const url = `http://localhost:8080/TFG/Controller?ACTION=EMPLEADO.DELETE&ID_EMPLEADO=${id}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `ID_EMPLEADO=${id}`
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log(`Empleado con ID ${id} eliminado.`);
        getEmpleados();
    } catch (error) {
        console.error('Error deleting empleado:', error);
    }
};

// Función para agregar empleados
const addEmpleado = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const isUpdate = formData.get('isUpdate') === 'true';
    const empleadoData = {
        ID_EMPLEADO: formData.get('ID_EMPLEADO'),
        ID_PRIVATEZONE: formData.get('ID_PRIVATEZONE'),
        NOMBRE: formData.get('NOMBRE'),
        APELLIDO: formData.get('APELLIDO')
    };

    const url = `http://localhost:8080/TFG/Controller?ACTION=EMPLEADO.${isUpdate ? 'UPDATE' : 'ADD'}`;
    const method = isUpdate ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empleadoData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        getEmpleados();
        document.getElementById('add-empleado-form').reset();
        document.getElementById('add-empleado-form').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('submit-button').textContent = 'Add Empleado';
        document.getElementById('isUpdate').value = 'false';
    } catch (error) {
        console.error('Error adding or updating empleado:', error);
    }
};

// Función para actualizar empleados
const updateEmpleado = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const ID_EMPLEADO = formData.get('ID_EMPLEADO');
    const ID_PRIVATEZONE = formData.get('ID_PRIVATEZONE');
    const NOMBRE = formData.get('NOMBRE');
    const APELLIDO = formData.get('APELLIDO');

    console.log('Datos capturados del formulario:', { ID_EMPLEADO, ID_PRIVATEZONE, NOMBRE, APELLIDO });

    const url = `http://localhost:8080/TFG/Controller?ACTION=EMPLEADO.UPDATE&ID_EMPLEADO=${ID_EMPLEADO}&ID_PRIVATEZONE=${ID_PRIVATEZONE}&NOMBRE=${encodeURIComponent(NOMBRE)}&APELLIDO=${encodeURIComponent(APELLIDO)}`;

    console.log('URL utilizada para la actualización:', url);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
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

        await getEmpleados();  // Asegúrate de que getEmpleados esté en el alcance
        document.getElementById('edit-empleado-form').reset();
        document.getElementById('edit-empleado-modal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    } catch (error) {
        console.error('Error updating empleado:', error.message);
    }
};


// Función para cerrar el modal de edición
const closeModal = () => {
    document.getElementById('edit-empleado-modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
};

// Función para cerrar el modal de agregar
const closeAddModal = () => {
    document.getElementById('add-empleado-form').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
};

// Añadir los event listeners después de definir todas las funciones
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-empleado-form').addEventListener('submit', addEmpleado);
    document.getElementById('edit-empleado-form').addEventListener('submit', updateEmpleado);
    getEmpleados();
});
