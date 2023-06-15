// Importer la configuration depuis le fichier app.config.json
import config from "../../app.config.json";

// Importer la bibliothèque mapbox
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/style.css";

// Définir la classe App
class App {
  // Propriétés

  elDivMap; // Conteneur de la carte
  map; // Instance de la carte
  form;

  // Démarrer l'application
  start() {
    console.log("App démarrée...");

    this.loadDom(); // Charger les éléments du DOM
    this.initMap(); // Initialiser la carte
    this.addFormulaire(); // Ajouter le formulaire
  }

  // Méthode pour initialiser la carte
  initMap() {
    // Utiliser la clé d'accès de l'API Mapbox GL à partir du fichier de configuration
    mapboxgl.accessToken = config.apis.mapbox_gl.api_key;

    this.map = new mapboxgl.Map({
      container: this.elDivMap, // ID du conteneur de la carte
      style: config.apis.mapbox_gl.map_styles.streets, // URL du style de la carte
      center: [2.79, 42.68], // Coordonnées initiales [long, lat]
      zoom: 12, // Niveau de zoom initial
    });

    const nav = new mapboxgl.NavigationControl();
    this.map.addControl(nav, "top-left");

    // Écouter les événements de clic sur la carte
    this.map.on("click", this.handleClickMap.bind(this));
  }

  // Charger les éléments du DOM
  loadDom() {
    // --- MAP ---

    this.elDivMap = document.createElement("div");
    this.elDivMap.id = "map";
    this.elDivMap.classList.add("map-container"); // Ajouter la classe pour la hauteur de la carte
    document.body.appendChild(this.elDivMap);
  }

  // Méthode qui gère les clics sur la carte
  handleClickMap(evt) {
    console.log(evt);

    // Obtenir la latitude et la longitude du clic
    const latitude = evt.lngLat.lat;
    const longitude = evt.lngLat.lng;

    console.log(evt.lngLat.lat);
    console.log(evt.lngLat.lng);

    // Assigner les valeurs aux champs de latitude et longitude du formulaire
    this.form.elLat.value = latitude;
    this.form.elLon.value = longitude;
  }

  // Ajouter le formulaire à la carte
  addFormulaire() {
    this.form = new Form();
    this.form.createDom();
    this.form.onSubmit(this.handleFormSubmit.bind(this));
  }

  // Gérer la soumission du formulaire
  handleFormSubmit(event) {
    // Récupérer les valeurs du formulaire
    const title = this.form.elTitle.value;
    const description = this.form.elDescription.value;
    const latitude = this.form.elLat.value;
    const longitude = this.form.elLon.value;
    const startDate = new Date(this.form.elDebut.value);
    const endDate = new Date(this.form.elFin.value);

    // Calculer la couleur de la punaise en fonction de la date

    const currentDate = new Date(); // Obtenir la date et l'heure actuelles
    const timeDifference = startDate.getTime() - currentDate.getTime(); // Différence de temps en millisecondes

    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    // Différence en jours en arrondissant à l'entier supérieur

    let markerColor;

    if (daysDifference > 3) {
      // Événement dans plus de 3 jours (vert)
      markerColor = "#008000"; // Vert
    } else if (daysDifference <= 3 && daysDifference > 0) {
      // Événement dans 3 jours ou moins (orange)
      markerColor = "#FFA500"; // Orange
    } else {
      // Événement dépassé (rouge)
      markerColor = "#FF0000"; // Rouge
    }

    // Créer un nouveau marqueur
    const marker = new mapboxgl.Marker({ color: markerColor })
      .setLngLat([longitude, latitude])
      .setPopup(
        new mapboxgl.Popup().setHTML(
          `<h3>${title}</h3><p>${description}</p><p>De ${startDate} à ${endDate}</p>`
        )
      );

    // Ajouter le marqueur à la carte
    marker.addTo(this.map);

    // Réinitialiser les valeurs du formulaire
    this.form.reset();

    // Forcer le redimensionnement de la carte
    this.map.resize();

    // Empêcher le comportement par défaut du formulaire
    event.preventDefault();
  }
}

class Form {
  // Propriétés des éléments du DOM

  elTitle;
  elDescription;
  elDebut;
  elFin;
  elLat;
  elLon;
  elBtnAdd;
  elBtnSupprimer;

  // Méthode qui crée le formulaire
  createDom() {
    // Création de la div contenant le formulaire
    const formDiv = document.createElement("div");
    formDiv.classList.add("form-container"); // Ajouter la classe pour la marge du formulaire

    // Création du formulaire
    const form = document.createElement("form");

    // Création du titre
    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Titre de l'événement :";
    this.elTitle = document.createElement("input");
    form.appendChild(titleLabel);
    form.appendChild(this.elTitle);

    // Création de la description
    const descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "Description de l'événement :";
    this.elDescription = document.createElement("textarea");
    form.appendChild(descriptionLabel);
    form.appendChild(this.elDescription);

    // Création du champ de date de début
    const startDateLabel = document.createElement("label");
    startDateLabel.textContent = "Date de début :";
    this.elDebut = document.createElement("input");
    this.elDebut.type = "date";
    form.appendChild(startDateLabel);
    form.appendChild(this.elDebut);

    // Création du champ de date de fin
    const endDateLabel = document.createElement("label");
    endDateLabel.textContent = "Date de fin :";
    this.elFin = document.createElement("input");
    this.elFin.type = "date";
    form.appendChild(endDateLabel);
    form.appendChild(this.elFin);

    // Création du champ de latitude
    const latitudeLabel = document.createElement("label");
    latitudeLabel.textContent = "Latitude :";
    this.elLat = document.createElement("input");
    this.elLat.type = "number";
    form.appendChild(latitudeLabel);
    form.appendChild(this.elLat);

    // Création du champ de longitude
    const longitudeLabel = document.createElement("label");
    longitudeLabel.textContent = "Longitude :";
    this.elLon = document.createElement("input");
    this.elLon.type = "number";
    form.appendChild(longitudeLabel);
    form.appendChild(this.elLon);

    // Ajout du bouton Ajouter
    this.elBtnAdd = document.createElement("button");
    this.elBtnAdd.textContent = "Ajouter";
    this.elBtnAdd.classList.add("btn", "btn-success");
    form.appendChild(this.elBtnAdd);

    // Ajout du bouton Supprimer
    this.elBtnSupprimer = document.createElement("button");
    this.elBtnSupprimer.textContent = "Supprimer";
    this.elBtnSupprimer.classList.add("btn", "btn-danger");
    form.appendChild(this.elBtnSupprimer);

    // Ajout du formulaire à la div
    formDiv.appendChild(form);

    // Ajout du formulaire au DOM
    document.body.appendChild(formDiv);
  }

  // Méthode pour réinitialiser les valeurs du formulaire
  reset() {
    this.elTitle.value = "";
    this.elDescription.value = "";
    this.elDebut.value = "";
    this.elFin.value = "";
    this.elLat.value = "";
    this.elLon.value = "";
  }

  // Méthode pour écouter la soumission du formulaire
  onSubmit(callback) {
    this.elBtnAdd.addEventListener("click", callback);
  }
}

// Créer une instance de l'application et l'exporter
const app = new App();
export default app;
