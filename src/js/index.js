import "../css/style.scss";
import { Backend } from "./backend.js";
import imageUrl from "url:../images/icon-location.svg";

// HTML elements

const ipAddress = document.querySelector("#ip");
const city = document.querySelector("#city");
const country = document.querySelector("#country");
const postal = document.querySelector("#postal");
const timezone = document.querySelector("#timezone");
const isp = document.querySelector("#isp");

const form = document.querySelector("form");
const inputField = document.querySelector("input");

// map

let mymap;

// map marker

let myIcon;

if (window.innerWidth <= 826) {
  myIcon = L.icon({
    iconUrl: imageUrl,
    iconSize: [23, 28],
  });
} else {
  myIcon = L.icon({
    iconUrl: imageUrl,
  });
}

// Backend class instance

const API = new Backend();
API.setBaseUrl(
  `https://geo.ipify.org/api/v1?apiKey=${process.env.SECRETIPKEY}`
);

// function to get and display IP and map API info

function getData(endpoint) {
  try {
    API.get(endpoint).then((data) => {
      if (!data.ip) {
        inputField.value = "Incorrect IP address or domain";
        inputField.style.color = "red";
        setTimeout(() => {
          inputField.value = "";
          inputField.style.color = "black";
        }, 2500);
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
      if (mymap) {
        mymap.remove();
      }
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
  } catch (error) {
    console.log(error);
  }
}

// Call function for page load; this will display the info related to the user's IP address

getData("");

// Call the function with the user's input when submit button is pressed

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const input = inputField.value;
  getData(`&domain=${input}`);
});
