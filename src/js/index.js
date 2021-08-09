import "../css/style.scss";
import { Backend } from "./backend.js";
import imageUrl from "url:../images/icon-location.svg";

// console.log(process.env.SECRETMAPKEY);

const ipAddress = document.querySelector("#ip");
const city = document.querySelector("#city");
const country = document.querySelector("#country");
const postal = document.querySelector("#postal");
const timezone = document.querySelector("#timezone");
const isp = document.querySelector("#isp");

const form = document.querySelector("form");
const inputField = document.querySelector("input");

let mymap;

let myIcon = L.icon({
  iconUrl: imageUrl,
});

const API = new Backend();
API.setBaseUrl(
  `https://geo.ipify.org/api/v1?apiKey=${process.env.SECRETIPKEY}`
);

API.get("").then((data) => {
  ipAddress.textContent = data.ip;
  city.textContent = data.location.city + ", ";
  country.textContent = data.location.country;
  postal.textContent = data.location.postalCode;
  timezone.textContent = data.location.timezone;
  isp.textContent = data.isp;
  const lat = data.location.lat;
  const long = data.location.lng;
  //   zoomControl set to false takes the zoom buttons away
  mymap = L.map("mapid", { zoomControl: false }).setView([lat, long], 13);
  L.tileLayer(
    `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.SECRETMAPKEY}`,
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: process.env.SECRETMAPKEY,
    }
  ).addTo(mymap);
  let marker = L.marker([lat, long], { icon: myIcon }).addTo(mymap);
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const input = inputField.value;
  API.get(`&domain=${input}`).then((data) => {
    if (!data.ip) {
      return;
    }
    ipAddress.textContent = data.ip;
    city.textContent = data.location.city + ", ";
    country.textContent = data.location.country;
    postal.textContent = data.location.postalCode;
    timezone.textContent = data.location.timezone;
    isp.textContent = data.isp;
    const lat = data.location.lat;
    const long = data.location.lng;
    mymap.remove();
    mymap = L.map("mapid", { zoomControl: false }).setView([lat, long], 13);
    L.tileLayer(
      `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.SECRETMAPKEY}`,
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: process.env.SECRETMAPKEY,
      }
    ).addTo(mymap);
    let marker = L.marker([lat, long], { icon: myIcon }).addTo(mymap);
  });
});
