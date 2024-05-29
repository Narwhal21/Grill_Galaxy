document.addEventListener('DOMContentLoaded', () => {
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

    const createProductoDetail = (productos) => {
        const productMenu = document.getElementById('product-menu');
        productMenu.innerHTML = '';
        productos.forEach(producto => {
            const { ID_PRODUCTOS, NOMBRE, PRECIO, PRODUCTOSIMG } = producto;
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-info">
                    <img src="${PRODUCTOSIMG}" alt="${NOMBRE}" class="product-image">
                    <h3>${NOMBRE}</h3>
                    <p>Price: ${PRECIO}€</p>
                </div>
                <button class="order-button" onclick="location.href='Cart.html'">ORDER</button>
            `;
            productMenu.appendChild(productCard);
        });
    };

    getProductos();
});
