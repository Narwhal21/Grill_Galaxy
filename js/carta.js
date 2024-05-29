// Array of products
const products = [
    { id: 1, name: 'Producto 1', description: 'Descripción del producto 1', image: '/iamgenes/Hambuurguesas/Bacon&Chicken.png' },
    { id: 2, name: 'Producto 2', description: 'Descripción del producto 2', image: 'https://via.placeholder.com/100' },
    { id: 3, name: 'Producto 3', description: 'Descripción del producto 3', image: 'https://via.placeholder.com/100' },
    { id: 4, name: 'Producto 4', description: 'Descripción del producto 4', image: 'https://via.placeholder.com/100' },
    { id: 5, name: 'Producto 5', description: 'Descripción del producto 5', image: 'https://via.placeholder.com/100' },
    { id: 6, name: 'Producto 6', description: 'Descripción del producto 6', image: 'https://via.placeholder.com/100' },
    { id: 7, name: 'Producto 7', description: 'Descripción del producto 7', image: 'https://via.placeholder.com/100' },
    { id: 8, name: 'Producto 8', description: 'Descripción del producto 8', image: 'https://via.placeholder.com/100' },
    { id: 9, name: 'Producto 9', description: 'Descripción del producto 9', image: 'https://via.placeholder.com/100' },
    { id: 10, name: 'Producto 10', description: 'Descripción del producto 10', image: 'https://via.placeholder.com/100' },
    { id: 11, name: 'Producto 11', description: 'Descripción del producto 11', image: 'https://via.placeholder.com/100' },
    { id: 12, name: 'Producto 12', description: 'Descripción del producto 12', image: 'https://via.placeholder.com/100' },
    { id: 13, name: 'Producto 13', description: 'Descripción del producto 13', image: 'https://via.placeholder.com/100' },
    { id: 14, name: 'Producto 14', description: 'Descripción del producto 14', image: 'https://via.placeholder.com/100' },
    { id: 15, name: 'Producto 15', description: 'Descripción del producto 15', image: 'https://via.placeholder.com/100' },
];

// Function to render product cards
function renderProducts() {
    const productList = document.getElementById('product-list');
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        const productImage = document.createElement('img');
        productImage.src = product.image;
        productImage.alt = product.name;

        const productName = document.createElement('h2');
        productName.innerText = product.name;

        const productDescription = document.createElement('p');
        productDescription.innerText = product.description;

        const addToCartButton = document.createElement('button');
        addToCartButton.classList.add('add-to-cart-btn');
        addToCartButton.innerText = 'Añadir al Carrito';
        addToCartButton.onclick = () => addToCart(product.id);

        productCard.appendChild(productImage);
        productCard.appendChild(productName);
        productCard.appendChild(productDescription);
        productCard.appendChild(addToCartButton);

        productList.appendChild(productCard);
    });
}

// Function to handle adding to cart
function addToCart(productId) {
    alert(`Producto ${productId} añadido al carrito.`);
}

// Initial render
renderProducts();
