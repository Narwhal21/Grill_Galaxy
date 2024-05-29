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
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.setAttribute('data-id', ID_PRODUCTOS);
            productDiv.setAttribute('data-name', NOMBRE);
            productDiv.setAttribute('data-price', PRECIO);
            productDiv.innerHTML = `
                <img src="${PRODUCTOSIMG}" alt="${NOMBRE}" class="product-image">
                <h2>${NOMBRE}</h2>
                <p>PRICE: ${PRECIO}€</p>
                <button class="boton" onclick="addToCart(this)">ADD TO CART</button>
            `;
            productMenu.appendChild(productDiv);
        });
    };

    window.addToCart = (button) => {
        const product = button.parentElement;
        const id = product.getAttribute('data-id');
        const name = product.getAttribute('data-name');
        const price = parseFloat(product.getAttribute('data-price'));
        const imgSrc = product.querySelector('img').src;

        const cartItems = document.getElementById('cart-items');
        let cartItem = document.getElementById(`cart-item-${id}`);

        if (cartItem) {
            let quantityInput = cartItem.querySelector('.quantity');
            quantityInput.value = parseInt(quantityInput.value) + 1;
        } else {
            cartItem = document.createElement('li');
            cartItem.className = 'cart-item';
            cartItem.id = `cart-item-${id}`;
            cartItem.innerHTML = `
                <img src="${imgSrc}" alt="${name}">
                <p>${name}</p>
                <p class="total-price">€${price.toFixed(2)}</p>
                <input type="number" class="quantity" value="1" min="1">
                <button onclick="removeFromCart(${id}, ${price})">X</button>
            `;
            cartItems.appendChild(cartItem);
        }

        updateCartTotal();
    };

    window.removeFromCart = (id, price) => {
        const cartItem = document.getElementById(`cart-item-${id}`);
        cartItem.remove();
        updateCartTotal();
    };

    const updateCartTotal = () => {
        const cartItems = document.querySelectorAll('.cart-item');
        let total = 0;

        cartItems.forEach(item => {
            const priceElement = item.querySelector('.total-price');
            const quantityElement = item.querySelector('.quantity');
            const price = parseFloat(priceElement.innerText.replace('€', ''));
            const quantity = parseInt(quantityElement.value);
            total += price * quantity;
        });

        document.getElementById('cart-total').innerText = total.toFixed(2);
    };

    getProductos();
});
