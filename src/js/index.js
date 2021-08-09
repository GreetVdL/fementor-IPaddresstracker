import "../css/style.scss";
import { Backend } from "./backend.js";

// console.log(process.env.SECRET);

// IP address info

const ipAddress = document.querySelector("#ip");
const city = document.querySelector("#city");
const country = document.querySelector("#country");
const postal = document.querySelector("#postal");
const timezone = document.querySelector("#timezone");
const isp = document.querySelector("#isp");

const form = document.querySelector("form");
const inputField = document.querySelector("input");

const API = new Backend();
API.setBaseUrl(
  `https://geo.ipify.org/api/v1?apiKey=${process.env.SECRETIPKEY}`
);

API.get("").then((data) => {
  console.log(data);
  ipAddress.textContent = data.ip;
  city.textContent = data.location.city + ", ";
  country.textContent = data.location.country;
  postal.textContent = data.location.postalCode;
  timezone.textContent = data.location.timezone;
  isp.textContent = data.isp;
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const input = inputField.value;
  API.get(`&domain=${input}`).then((data) => {
    console.log(data);
    ipAddress.textContent = data.ip;
    city.textContent = data.location.city + ", ";
    country.textContent = data.location.country;
    postal.textContent = data.location.postalCode;
    timezone.textContent = data.location.timezone;
    isp.textContent = data.isp;
  });
});
