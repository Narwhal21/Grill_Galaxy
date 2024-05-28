document.addEventListener('DOMContentLoaded', async () => {
    const getProductos = async () => {
        try {
            const url = 'http://localhost:8080/TFG/Controller?ACTION=PRODUCTOS.FIND_ALL';
            const response = await fetch(url);
            const productos = await response.json();

            console.log('Productos recibidos:', productos);

            createProductoDetail(productos);
        } catch (error) {
            console.error('Error fetching productos:', error);
        }
    };

    const createProductoDetail = (productos) => {
        const productosTableBody = document.querySelector('table tbody');
        productosTableBody.innerHTML = '';
        productos.forEach(productos => {
            console.log('Productos:', productos);

            const { ID_PRODUCTOS, ID_CATEGORIA, NOMBRE, PRECIO } = productos;

            const row = `
                <tr data-id="${ID_PRODUCTOS}">
                    <td>${ID_PRODUCTOS}</td>
                    <td>${ID_CATEGORIA}</td>
                    <td>${NOMBRE} $</td>
                    <td>${PRECIO} </td>
                    <td class="action-buttons">
                    <button id="show-add-productos-form">Añadir Productos</button>
            <button onclick="openEditModal('${ID_PRODUCTOS}', '${ID_CATEGORIA}', '${PRECIO}', '${NOMBRE}' )">Update</button>
            <button onclick="deleteProduct('${ID_PRODUCTOS}')">Delete</button>
            </td>
            `;

            productosTableBody.insertAdjacentHTML('beforeend', row);
        });
    };

    const addProductos = async (event) => {
        event.preventDefault();
    
        const formData = new FormData(event.target);
        const productosData = {
            ID_PRODUCTOS: formData.get('ID_PRODUCTOS'),
            ID_CATEGORIA: formData.get('ID_CATEGORIA'),
            NOMBRE: formData.get('NOMBRE'),
            PRECIO: formData.get('PRECIO')
        };
    
        console.log('Productos Data:', productosData); // Verifica que los datos se estén capturando correctamente
    
        const url = 'http://localhost:8080/TFG/Controller?ACTION=PRODUCTOS.ADD';
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productosData)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log('Server Response:', result);
    
            getProductos(); // Refresh the product list
            document.getElementById('add-productos-form').reset(); // Reset the form
            document.getElementById('add-productos-form').style.display = 'none'; // Hide the form
        } catch (error) {
            console.error('Error adding productos:', error);
        }
    };
    
    document.getElementById('show-add-productos-form').addEventListener('click', () => {
        document.getElementById('add-productos-form').style.display = 'block';
    });
    
    document.getElementById('add-productos-form').addEventListener('submit', addProductos);
    
    getProductos(); // Ensure this is called in an async function or handles its promises correctly
    
});
