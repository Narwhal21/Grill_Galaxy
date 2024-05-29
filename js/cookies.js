const cookieContainer = document.getElementById('cookieContainer');
const acceptBtn = document.getElementById('acceptBtn');
const rejectBtn = document.getElementById('rejectBtn');

acceptBtn.addEventListener('click', () => {
  cookieContainer.style.display = 'none'; // Oculta el contenedor de cookies cuando se acepta
  // Aquí puedes agregar el código para establecer una cookie de aceptación
});

rejectBtn.addEventListener('click', () => {
  cookieContainer.style.display = 'none'; // Oculta el contenedor de cookies cuando se rechaza
  // Aquí puedes agregar el código para redirigir o realizar otras acciones cuando se rechaza
});


