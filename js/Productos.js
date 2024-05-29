// Función para abrir el modal de edición
const showEditModal = (ID_PRODUCTOS, ID_CATEGORIA, NOMBRE, PRECIO, PRODUCTOSIMG) => {
    const form = document.getElementById('edit-productos-form');
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('edit-productos-modal').style.display = 'block';
    form['ID_PRODUCTOS'].value = ID_PRODUCTOS;
    form['ID_CATEGORIA'].value = ID_CATEGORIA;
    form['NOMBRE'].value = NOMBRE;
    form['PRECIO'].value = PRECIO;
    form['PRODUCTOSIMG'].value = PRODUCTOSIMG;
    document.getElementById('submit-update-button').textContent = 'Update Productos';
};

// Función para obtener los productos
const getProductos = async () => {
    try {
        const url = 'http://localhost:8080/TFG/Controller?ACTION=PRODUCTOS.FIND_ALL';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const productos = await response.json();
        createProductoDetail(productos);
    } catch (error) {
        console.error('Error fetching productos:', error);
    }
};

// Función para crear los detalles de los productos
const createProductoDetail = (productos) => {
    const productosTableBody = document.querySelector('table tbody');
    productosTableBody.innerHTML = '';
    productos.forEach(producto => {
        const { ID_PRODUCTOS, ID_CATEGORIA, NOMBRE, PRECIO, PRODUCTOSIMG } = producto;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ID_PRODUCTOS}</td>
            <td>${ID_CATEGORIA}</td>
            <td>${NOMBRE}</td>
            <td>${PRECIO} $</td>
            <td><img src="${PRODUCTOSIMG}" alt="${NOMBRE}" /></td>
            <td class="action-buttons">
                <button class="update-button" data-id="${ID_PRODUCTOS}" data-categoria="${ID_CATEGORIA}" data-nombre="${NOMBRE}" data-precio="${PRECIO}" data-img="${PRODUCTOSIMG}">Update</button>
                <button class="delete-button" data-id="${ID_PRODUCTOS}">Delete</button>
                <button class="add-button" data-id="${ID_PRODUCTOS}">Añadir Productos</button>
            </td>
        `;
        productosTableBody.appendChild(row);

        row.querySelector('.update-button').addEventListener('click', (event) => {
            const button = event.target;
            const id = button.getAttribute('data-id');
            const categoria = button.getAttribute('data-categoria');
            const nombre = button.getAttribute('data-nombre');
            const precio = button.getAttribute('data-precio');
            const img = button.getAttribute('data-img');
            showEditModal(id, categoria, nombre, precio, img);
        });
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', async () => {
            const id = button.getAttribute('data-id');
            await deleteProductos(id);
        });
    });

    document.querySelectorAll('.add-button').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('add-productos-form').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
        });
    });
};

// Función para eliminar productos
const deleteProductos = async (id) => {
    const url = `http://localhost:8080/TFG/Controller?ACTION=PRODUCTOS.DELETE&ID_PRODUCTOS=${id}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `ID_PRODUCTOS=${id}`
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log(`Producto con ID ${id} eliminado.`);
        getProductos();
    } catch (error) {
        console.error('Error deleting productos:', error);
    }
};

// Función para agregar productos
const addProductos = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const isUpdate = formData.get('isUpdate') === 'true';
    const productosData = {
        ID_PRODUCTOS: formData.get('ID_PRODUCTOS'),
        ID_CATEGORIA: formData.get('ID_CATEGORIA'),
        NOMBRE: formData.get('NOMBRE'),
        PRECIO: formData.get('PRECIO'),
        PRODUCTOSIMG: formData.get('PRODUCTOSIMG')
    };

    const url = `http://localhost:8080/TFG/Controller?ACTION=PRODUCTOS.${isUpdate ? 'UPDATE' : 'ADD'}`;
    const method = isUpdate ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productosData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        getProductos();
        document.getElementById('add-productos-form').reset();
        document.getElementById('add-productos-form').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('submit-button').textContent = 'Add Productos';
        document.getElementById('isUpdate').value = 'false';
    } catch (error) {
        console.error('Error adding or updating productos:', error);
    }
};

// Función para actualizar productos
const updateProductos = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const productosData = {
        ID_PRODUCTOS: formData.get('ID_PRODUCTOS'),
        ID_CATEGORIA: formData.get('ID_CATEGORIA'),
        NOMBRE: formData.get('NOMBRE'),
        PRECIO: formData.get('PRECIO'),
        PRODUCTOSIMG: formData.get('PRODUCTOSIMG')
    };

    console.log('Datos capturados del formulario:', productosData);

    const url = `http://localhost:8080/TFG/Controller?ACTION=PRODUCTOS.UPDATE`;

    console.log('URL utilizada para la actualización:', url);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productosData)
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

        getProductos();  // Asegúrate de que getProductos esté en el alcance
        document.getElementById('edit-productos-form').reset();
        document.getElementById('edit-productos-modal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    } catch (error) {
        console.error('Error updating productos:', error.message);
    }
};

// Función para cerrar el modal de edición
const closeModal = () => {
    document.getElementById('edit-productos-modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
};

// Función para cerrar el modal de agregar
const closeAddModal = () => {
    document.getElementById('add-productos-form').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
};

// Añadir los event listeners después de definir todas las funciones
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-productos-form').addEventListener('submit', addProductos);
    document.getElementById('edit-productos-form').addEventListener('submit', updateProductos);
    getProductos();
});
