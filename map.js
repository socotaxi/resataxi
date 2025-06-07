
document.addEventListener('DOMContentLoaded', () => {
  const mapContainer = document.createElement('div');
  mapContainer.id = 'map';
  mapContainer.style = 'width: 100%; height: 300px; margin-top: 1rem;';
  document.querySelector('#reservationPage').appendChild(mapContainer);

  const map = L.map('map').setView([0, 0], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    map.setView([lat, lon], 15);
    L.marker([lat, lon]).addTo(map).bindPopup('Votre position').openPopup();
  }, err => {
    console.error('Erreur géolocalisation :', err.message);
  });
});