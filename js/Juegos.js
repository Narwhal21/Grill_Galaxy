document.addEventListener('DOMContentLoaded', () => {
    const getJuegos = async () => {
        try {
            const url = 'http://localhost:8080/TFG/Controller?ACTION=JUEGOS.FIND_ALL';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const juegos = await response.json();
            createJuegoDetail(juegos);
        } catch (error) {
            console.error('Error fetching juegos:', error);
        }
    };

    const createJuegoDetail = (juegos) => {
        const juegosMenu = document.getElementById('juegos-menu');
        juegosMenu.innerHTML = '';
        juegos.forEach(juego => {
            const { Nombre, urlTrailer, descripcion, año, idjuego, puntuacion, precio } = juegos;
            const juegosCard = document.createElement('div');
            juegosCard.className = 'juegos-card';
            juegosCard.innerHTML = `
                <div class="juego-info">
                    <h3>${Nombre}</h3>
                    <p>Price: ${precio}€</p>
                </div>
                <button class="order-button" onclick="location.href='Cart.html'">ORDER</button>
            `;
            juegosMenu.appendChild(juegosCard);
        });
    };

    getJuegos();
});