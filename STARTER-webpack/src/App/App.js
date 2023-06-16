import config from "../../app.config.json";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/style.css";

class App {
  elDivMap;
  map;
  form;

  start() {
    console.log("App démarrée...");
    this.loadDom();
    this.initMap();
    this.addForm();
    this.loadSavedReminders();
  }

  initMap() {
    mapboxgl.accessToken = config.apis.mapbox_gl.api_key;
    this.map = new mapboxgl.Map({
      container: this.elDivMap,
      style: config.apis.mapbox_gl.map_styles.streets,
      center: [2.79, 42.68],
      zoom: 12,
    });

    const nav = new mapboxgl.NavigationControl();
    this.map.addControl(nav, "top-left");
    this.map.on("click", this.handleMapClick.bind(this));
  }

  loadDom() {
    this.elDivMap = document.createElement("div");
    this.elDivMap.id = "map";
    this.elDivMap.classList.add("map-container");
    document.body.appendChild(this.elDivMap);
  }

  handleMapClick(event) {
    const latitude = event.lngLat.lat;
    const longitude = event.lngLat.lng;
    this.form.elLat.value = latitude;
    this.form.elLon.value = longitude;
  }

  addForm() {
    this.form = new Form();
    this.form.createDom();
    this.form.onSubmit(this.handleFormSubmit.bind(this));
  }

  handleFormSubmit(event) {
    const title = this.form.elTitle.value;
    const description = this.form.elDescription.value;
    const latitude = this.form.elLat.value;
    const longitude = this.form.elLon.value;
    const startDate = new Date(this.form.elDebut.value);
    const endDate = new Date(this.form.elFin.value);

    const currentDate = new Date();
    const timeDifference = startDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    let markerColor;
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

    this.addReminderToMap(reminder);
    this.form.saveReminder(reminder);
    this.form.reset();
    this.map.resize();
    event.preventDefault();
  }

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

  loadSavedReminders() {
    const savedReminders = this.form.getSavedReminders();
    savedReminders.forEach((reminder) => {
      this.addReminderToMap(reminder);
    });
  }
}

class Form {
  elTitle;
  elDescription;
  elDebut;
  elFin;
  elLat;
  elLon;
  elBtnAdd;
  elBtnSupprimer;

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

  reset() {
    this.elTitle.value = "";
    this.elDescription.value = "";
    this.elDebut.value = "";
    this.elFin.value = "";
    this.elLat.value = "";
    this.elLon.value = "";
  }

  onSubmit(callback) {
    this.elBtnAdd.addEventListener("click", callback);
  }

  saveReminder(reminder) {
    const savedReminders = this.getSavedReminders();
    savedReminders.push(reminder);
    localStorage.setItem("reminders", JSON.stringify(savedReminders));
  }

  getSavedReminders() {
    const reminders = localStorage.getItem("reminders");
    return reminders ? JSON.parse(reminders) : [];
  }

  toISOString(date) {
    return date.toISOString().slice(0, 10);
  }
}

const app = new App();
app.start();
