// Mantenemos el carrito como un array global
let cart = [];

// Función para agregar un producto al carrito
function addToCart(button) {
    const productElement = button.parentElement;
    const productId = productElement.getAttribute("data-id");
    const productName = productElement.getAttribute("data-name");
    const productPrice = parseFloat(productElement.getAttribute("data-price"));

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    updateCart();
}

// Función para actualizar el carrito
function updateCart() {
    const cartElement = document.getElementById("cart");
    cartElement.innerHTML = ""; // Limpiamos el carrito para volver a llenarlo

    let total = 0;

    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        const itemInfo = document.createElement("p");
        itemInfo.textContent = `${item.name} - $${item.price} x ${item.quantity}`;

        const totalItemPrice = item.price * item.quantity;
        total += totalItemPrice;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Eliminar";
        removeButton.onclick = () => removeFromCart(item.id);

        cartItem.appendChild(itemInfo);
        cartItem.appendChild(removeButton);

        cartElement.appendChild(cartItem);
    });

    // Actualizamos el total
    document.getElementById("cart-total").textContent = total.toFixed(2);

    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "El carrito está vacío.";
        cartElement.appendChild(emptyMessage);
    }
}

// Función para eliminar un producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}
