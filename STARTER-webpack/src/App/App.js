import config from "../../app.config.json";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/style.css";

// Classe principale de l'application
class App {
  // Propriétés
  elDivMap; // Élément div qui contient la carte
  map; // Objet MapboxGL pour la carte
  form; // Instance de la classe Form pour gérer le formulaire

  // Méthode pour démarrer l'application
  start() {
    console.log("App démarrée...");
    this.loadDom(); // Chargement des éléments DOM
    this.initMap(); // Initialisation de la carte
    this.addForm(); // Ajout du formulaire
    this.loadSavedReminders(); // Chargement des rappels sauvegardés
  }

  // Méthode pour initialiser la carte
  initMap() {
    mapboxgl.accessToken = config.apis.mapbox_gl.api_key; // Clé d'accès à l'API Mapbox GL récupérée à partir de la configuration
    this.map = new mapboxgl.Map({
      container: this.elDivMap,
      style: config.apis.mapbox_gl.map_styles.streets, // Style de la carte récupéré à partir de la configuration
      center: [2.79, 42.68], // Centre initial de la carte
      zoom: 12, // Niveau de zoom initial de la carte
    });

    const nav = new mapboxgl.NavigationControl();
    this.map.addControl(nav, "top-left");

    // Écouteur d'événement pour détecter les clics sur la carte
    this.map.on("click", this.handleMapClick.bind(this));
  }

  // Méthode pour charger les éléments DOM
  loadDom() {
    this.elDivMap = document.createElement("div");
    this.elDivMap.id = "map";
    this.elDivMap.classList.add("map-container");
    document.body.appendChild(this.elDivMap);
  }

  // Méthode pour gérer les clics sur la carte
  handleMapClick(event) {
    const latitude = event.lngLat.lat;
    const longitude = event.lngLat.lng;
    this.form.elLat.value = latitude;
    this.form.elLon.value = longitude;
  }

  // Méthode pour ajouter le formulaire au DOM
  addForm() {
    this.form = new Form();
    this.form.createDom();
    this.form.onSubmit(this.handleFormSubmit.bind(this));
  }

  // Méthode pour gérer la soumission du formulaire
  handleFormSubmit(event) {
    const title = this.form.elTitle.value;
    const description = this.form.elDescription.value;
    const latitude = this.form.elLat.value;
    const longitude = this.form.elLon.value;
    const startDate = new Date(this.form.elDebut.value);
    const endDate = new Date(this.form.elFin.value);

    // Calcul de la différence de jours entre la date de début et la date actuelle
    const currentDate = new Date();
    const timeDifference = startDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    let markerColor = "#008000"; // Couleur par défaut

    if (daysDifference > 3) {
      markerColor = "#008000"; // Vert
    } else if (daysDifference <= 3 && daysDifference > 0) {
      markerColor = "#FFA500"; // Orange
    } else {
      markerColor = "#FF0000"; // Rouge
    }

    const reminder = {
      title,
      description,
      latitude,
      longitude,
      startDate: this.form.toISOString(startDate),
      endDate: this.form.toISOString(endDate),
      markerColor,
    };

    this.addReminderToMap(reminder); // Ajout du rappel à la carte
    this.form.saveReminder(reminder); // Sauvegarde du rappel
    this.form.reset(); // Réinitialisation du formulaire
    this.map.resize(); // Redimensionnement de la carte
    event.preventDefault(); // Empêche le comportement par défaut de la soumission du formulaire
  }

  // Méthode pour ajouter un rappel à la carte
  addReminderToMap(reminder) {
    const {
      title,
      description,
      latitude,
      longitude,
      startDate,
      endDate,
      markerColor,
    } = reminder;
    const marker = new mapboxgl.Marker({ color: markerColor })
      .setLngLat([longitude, latitude])
      .setPopup(
        new mapboxgl.Popup().setHTML(
          `<h3>${title}</h3><p>${description}</p><p>De ${startDate} à ${endDate}</p>`
        )
      );
    marker.addTo(this.map);
  }

  // Méthode pour charger les rappels sauvegardés
  loadSavedReminders() {
    const savedReminders = this.form.getSavedReminders();
    savedReminders.forEach((reminder) => {
      this.addReminderToMap(reminder);
    });
  }
}

// Classe pour gérer le formulaire
class Form {
  // Éléments DOM
  elTitle;
  elDescription;
  elDebut;
  elFin;
  elLat;
  elLon;
  elBtnAdd;
  elBtnSupprimer;

  // Méthode pour créer les éléments DOM du formulaire
  createDom() {
    const formDiv = document.createElement("div");
    formDiv.classList.add("form-container");

    const form = document.createElement("form");

    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Titre de l'événement :";
    this.elTitle = document.createElement("input");
    form.appendChild(titleLabel);
    form.appendChild(this.elTitle);

    const descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "Description de l'événement :";
    this.elDescription = document.createElement("textarea");
    form.appendChild(descriptionLabel);
    form.appendChild(this.elDescription);

    const startDateLabel = document.createElement("label");
    startDateLabel.textContent = "Date de début :";
    this.elDebut = document.createElement("input");
    this.elDebut.type = "date";
    form.appendChild(startDateLabel);
    form.appendChild(this.elDebut);

    const endDateLabel = document.createElement("label");
    endDateLabel.textContent = "Date de fin :";
    this.elFin = document.createElement("input");
    this.elFin.type = "date";
    form.appendChild(endDateLabel);
    form.appendChild(this.elFin);

    const latitudeLabel = document.createElement("label");
    latitudeLabel.textContent = "Latitude :";
    this.elLat = document.createElement("input");
    this.elLat.type = "number";
    form.appendChild(latitudeLabel);
    form.appendChild(this.elLat);

    const longitudeLabel = document.createElement("label");
    longitudeLabel.textContent = "Longitude :";
    this.elLon = document.createElement("input");
    this.elLon.type = "number";
    form.appendChild(longitudeLabel);
    form.appendChild(this.elLon);

    this.elBtnAdd = document.createElement("button");
    this.elBtnAdd.textContent = "Ajouter";
    this.elBtnAdd.classList.add("btn", "btn-success");
    form.appendChild(this.elBtnAdd);

    this.elBtnSupprimer = document.createElement("button");
    this.elBtnSupprimer.textContent = "Supprimer";
    this.elBtnSupprimer.classList.add("btn", "btn-danger");
    form.appendChild(this.elBtnSupprimer);

    formDiv.appendChild(form);
    document.body.appendChild(formDiv);
  }

  // Méthode pour réinitialiser les valeurs des champs du formulaire
  reset() {
    this.elTitle.value = "";
    this.elDescription.value = "";
    this.elDebut.value = "";
    this.elFin.value = "";
    this.elLat.value = "";
    this.elLon.value = "";
  }

  // Méthode pour ajouter un écouteur d'événement à la soumission du formulaire
  onSubmit(callback) {
    this.elBtnAdd.addEventListener("click", callback);
  }

  // Méthode pour sauvegarder un rappel dans le localStorage
  saveReminder(reminder) {
    const savedReminders = this.getSavedReminders();
    savedReminders.push(reminder);
    localStorage.setItem("reminders", JSON.stringify(savedReminders));
  }

  // Méthode pour récupérer les rappels sauvegardés depuis le localStorage
  getSavedReminders() {
    const reminders = localStorage.getItem("reminders");
    return reminders ? JSON.parse(reminders) : [];
  }

  // Méthode pour convertir une date en format ISO (AAAA-MM-JJ)
  toISOString(date) {
    return date.toISOString().slice(0, 10);
  }
}

const app = new App();
app.start();
