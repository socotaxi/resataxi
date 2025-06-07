// Dark mode based on user preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark');
}

flatpickr('#heure', {
  enableTime: true,
  noCalendar: true,
  dateFormat: 'H:i',
  time_24hr: true
});

const firebaseConfig = {
  apiKey: "AIzaSyDeKlTzZtAU_vSW7sbX7P9DVGD3LuCvajI",
  authDomain: "reservation-taxi-2.firebaseapp.com",
  projectId: "reservation-taxi-2",
  storageBucket: "reservation-taxi-2.appspot.com",
  messagingSenderId: "916656717121",
  appId: "1:916656717121:web:aeccb95dd97a31a226f5c0"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const loginPage = document.getElementById('loginPage');
const registerPage = document.getElementById('registerPage');
const reservationPage = document.getElementById('reservationPage');
const welcomeMessage = document.getElementById('welcomeMessage');
const errorContainer = document.getElementById('errorContainer');
let timerInterval = null;

function showError(message) {
  errorContainer.textContent = message;
  setTimeout(() => errorContainer.textContent = '', 5000);
}

function showLogin() {
  loginPage.classList.remove('hidden');
  registerPage.classList.add('hidden');
  reservationPage.classList.add('hidden');
}

function showRegister() {
  registerPage.classList.remove('hidden');
  loginPage.classList.add('hidden');
  reservationPage.classList.add('hidden');
}

auth.onAuthStateChanged(user => {
  if (user) {
    db.collection('users').doc(user.uid).get().then(doc => {
      if (doc.exists && doc.data().name) {
        afficherReservationPage(doc.data().name);
      } else {
        showError('Données utilisateur manquantes.');
        logout();
      }
    });
  } else {
    showLogin();
  }
});

function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!email || !password) {
    showError('Remplir les champs.');
    return;
  }
  auth.signInWithEmailAndPassword(email, password)
    .then(cred => db.collection('users').doc(cred.user.uid).get())
    .then(doc => {
      if (doc.exists && doc.data().name) {
        afficherReservationPage(doc.data().name);
      } else {
        showError('Données utilisateur manquantes.');
        logout();
      }
    })
    .catch(e => showError(e.message));
}

function register() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  if (!name || !email || !password) {
    showError('Remplir tous les champs.');
    return;
  }
  if (password.length < 6) {
    showError('Le mot de passe doit contenir au moins 6 caractères.');
    return;
  }
  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => db.collection('users').doc(cred.user.uid).set({ name }))
    .then(() => {
      showError('Inscription réussie.');
      showLogin();
    })
    .catch(e => showError(e.message));
}

function logout() {
  auth.signOut().then(() => location.reload());
}

function envoyerReservation() {
  const depart = document.getElementById('depart').value.trim();
  const arrivee = document.getElementById('arrivee').value.trim();
  const heure = document.getElementById('heure').value;
  const commentaires = document.getElementById('commentaires').value.trim();
  const nom = document.getElementById('nom').value;
  if (!depart || !arrivee || !heure) {
    showError('Remplir les champs obligatoires.');
    return;
  }

  if (!confirm('Envoyer la réservation ?')) return;

  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude.toFixed(6);
    const lon = pos.coords.longitude.toFixed(6);
    const telSociete = '242050787624';
    const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    const message = `Réservation Taxi:\n- Nom: ${nom}\n- Départ: ${depart}\n- Arrivée: ${arrivee}\n- Heure: ${heure}\n- Commentaires: ${commentaires}\n- Itinéraire Google Maps: ${googleMapsLink}`;
    const url = `https://wa.me/${telSociete}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
    db.collection('reservations').add({ nom, depart, arrivee, heure, commentaires, latitude: lat, longitude: lon, date: new Date() });
    lancerTimer();
  }, err => {
    showError('Erreur GPS : ' + err.message);
  });
}

function lancerTimer() {
  clearInterval(timerInterval);
  let sec = 0;
  const timer = document.getElementById('timer');
  timer.classList.remove('hidden');
  timer.textContent = '⏳ 0s';
  timerInterval = setInterval(() => {
    sec++;
    timer.textContent = `⏳ ${sec}s`;
  }, 1000);
}

function afficherReservationPage(name) {
  document.getElementById('nom').value = name;
  welcomeMessage.textContent = `Bienvenue, ${name} !`;
  reservationPage.classList.remove('hidden');
  loginPage.classList.add('hidden');
  registerPage.classList.add('hidden');

  const map = L.map('map').setView([0, 0], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    map.setView([lat, lon], 15);
    L.marker([lat, lon]).addTo(map).bindPopup('Votre position').openPopup();
  }, err => {
    showError('Erreur GPS : ' + err.message);
  });
}

function updateAutocomplete(id, listId) {
  const query = document.getElementById(id).value.trim();
  if (query.length < 3) return;
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`)
    .then(r => r.json())
    .then(results => {
      const list = document.getElementById(listId);
      list.innerHTML = '';
      results.forEach(r => {
        const option = document.createElement('option');
        option.value = r.display_name;
        list.appendChild(option);
      });
    });
}

document.getElementById('depart').addEventListener('keyup', () => updateAutocomplete('depart', 'departList'));
document.getElementById('arrivee').addEventListener('keyup', () => updateAutocomplete('arrivee', 'arriveeList'));

// PWA installation
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/resataxi/service-worker.js')
    .then(() => console.log('Service Worker enregistré'))
    .catch(err => console.log('Erreur SW', err));
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installButton').classList.remove('hidden');
});

document.getElementById('installButton').addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choiceResult => {
      deferredPrompt = null;
      document.getElementById('installButton').classList.add('hidden');
      console.log(choiceResult.outcome === 'accepted' ? 'Installation acceptée' : 'Installation refusée');
    });
  }
});