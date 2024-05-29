// Función para abrir el modal de findAll
const showFindAllModal = (admins) => {
    const modal = document.getElementById('findall-admin-modal');
    const tbody = modal.querySelector('tbody');
    tbody.innerHTML = ''; // Limpiar cualquier dato anterior

    admins.forEach(admin => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${admin.ID_ADMIN}</td>
            <td>${admin.ID_PRIVATEZONE}</td>
            <td>${admin.NOMBRE}</td>
            <td>${admin.APELLIDO}</td>
        `;

        tbody.appendChild(tr);
    });

    document.getElementById('overlay').style.display = 'block';
    modal.style.display = 'block';
};

// Función para obtener los admin
const getAdmin = async () => {
    try {
        const url = 'http://localhost:8080/TFG/Controller?action=ADMIN.FIND_ALL';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const admins = await response.json();
        showFindAllModal(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
    }
};

// Función para cerrar el modal
const closeFindAllModal = () => {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('findall-admin-modal').style.display = 'none';
};

document.addEventListener('DOMContentLoaded', (event) => {
    getAdmin();
});
