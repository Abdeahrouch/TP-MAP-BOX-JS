// export default App;

// const app = new App();

// app.start();

// Importer la config de mapbox

import config from "../../app.config.json";

// Importer la librairie de mapbox

import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Importer le fichier CSS

import "../assets/style.css";

class App {
  // Propriétés

  elDivMap; // container de la map
  map; // instance de la map
  form;

  start() {
    console.log("App démarrée...");

    this.loadDom();

    this.initMap();

    this.addFormulaire(); // Appel de la méthode pour ajouter le formulaire
  }

  // Méthode pour initialiser la carte

  initMap() {
    // Utilise l'API Mapbox GL pour accéder à une clé d'accès (API key) dans un fichier de configuration,

    // qui est ensuite utilisée pour autoriser et authentifier l'utilisation de Mapbox GL dans l'application.

    mapboxgl.accessToken = config.apis.mapbox_gl.api_key;

    this.map = new mapboxgl.Map({
      container: this.elDivMap, // l'ID du container

      style: config.apis.mapbox_gl.map_styles.streets, // le lien URL du style

      center: [2.79, 42.68], // Les coordonnées [long, lat] de la position de départ

      zoom: 12, // Initialisation du zoom
    });

    const nav = new mapboxgl.NavigationControl();

    this.map.addControl(nav, "top-right");

    // On écoute sur la map

    this.map.on("click", this.handleClickMap.bind(this));
  }

  loadDom() {
    // --- MAP ---

    this.elDivMap = document.createElement("div");
    this.elDivMap.id = "map";
    this.elDivMap.classList.add("map-container"); // Ajout de la classe pour la hauteur de la carte
    document.body.appendChild(this.elDivMap);
  }

  // Méthode qui capture le clic sur la map

  handleClickMap(evt) {
    console.log(evt);

    // Pour avoir la latitude et la longitude

    const latitude = evt.lngLat.lat;
    const longitude = evt.lngLat.lng;

    console.log(evt.lngLat.lat);
    console.log(evt.lngLat.lng);

    // Assigner les valeurs aux champs de latitude et de longitude du formulaire

    this.form.elLat.value = latitude;
    this.form.elLon.value = longitude;
  }

  // Ajout du formulaire dans la map

  addFormulaire() {
    this.form = new Form();
    this.form.createDom();
    this.form.onSubmit(this.handleFormSubmit.bind(this));
  }

  // Gérer la soumission du formulaire

  handleFormSubmit(event) {
    event.preventDefault();

    // Récupérer les valeurs du formulaire
    const title = this.form.elTitle.value;
    const description = this.form.elDescription.value;
    const latitude = this.form.elLat.value;
    const longitude = this.form.elLon.value;

    // Créer un nouveau marqueur

    const marker = new mapboxgl.Marker()

      .setLngLat([longitude, latitude])

      .setPopup(
        new mapboxgl.Popup().setHTML(`<h3>${title}</h3><p>${description}</p>`)
      );

    // Ajouter le marqueur à la carte

    marker.addTo(this.map);

    // Réinitialiser les valeurs du formulaire

    this.form.reset();

    // Forcer la carte à se redimensionner
    // this.map.resize();
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

    formDiv.classList.add("form-container"); // Ajout de la classe pour la marge du formulaire

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
    this.elDebut.type = "datetime-local";
    form.appendChild(startDateLabel);
    form.appendChild(this.elDebut);

    // Création du champ de date de fin

    const endDateLabel = document.createElement("label");
    endDateLabel.textContent = "Date de fin :";
    this.elFin = document.createElement("input");
    this.elFin.type = "datetime-local";
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

    // Ajout de bouton Ajouter

    this.elBtnAdd = document.createElement("button");
    this.elBtnAdd.textContent = "Ajouter";
    this.elBtnAdd.classList.add("btn", "btn-success");
    form.appendChild(this.elBtnAdd);

    // Ajout de  bouton Supprimer

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

const app = new App();
export default app;
