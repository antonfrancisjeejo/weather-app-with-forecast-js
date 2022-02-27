const containerLeftElm = document.querySelector(".container__leftHistory");
const containerRightElm = document.querySelector(".container__right");
const cityInput = document.querySelector("input");
const searchButton = document.querySelector("#searchButton");
const apiKey = "7d9925376dfc79f48e562127c9794956";

async function searchData(city) {
  containerRightElm.innerHTML = "";
  const history = JSON.parse(localStorage.getItem("history")) || [];

  history.push(city);

  localStorage.setItem("history", JSON.stringify([...new Set(history)]));

  const response = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      apiKey
  );
  const {
    coord: { lat, lon },
  } = await response.json();
  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  const jsonData = await data.json();
  console.log(jsonData);

  const divCont = document.createElement("div");
  const topDiv = document.createElement("div");
  const img = document.createElement("img");
  img.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${jsonData.daily[0].weather[0].icon}@2x.png`
  );
  const h2 = document.createElement("h2");
  h2.innerHTML = `${city} ${new Date(
    jsonData.daily[0].dt * 1000
  ).toLocaleDateString()}`;
  topDiv.append(h2);
  topDiv.append(img);
  topDiv.classList.add("topDiv");
  const h4Te = document.createElement("h4");
  h4Te.innerText = `Temp: ${jsonData.daily[0].temp.day} °F `;
  const h4Wi = document.createElement("h4");
  h4Wi.innerText = `Wind: ${jsonData.daily[0].wind_gust} MPH`;
  const h4Hu = document.createElement("h4");
  h4Hu.innerText = `Humidity: ${jsonData.daily[0].humidity} %`;
  const uvi = document.createElement("h4");
  uvi.innerText = `UV Index: `;
  const uviValue = document.createElement("span");
  uviValue.innerText = jsonData.daily[0].uvi;
  uvi.append(uviValue);
  uvi.classList.add("uvi");
  divCont.append(topDiv);
  divCont.append(h4Te);
  divCont.append(h4Wi);
  divCont.append(h4Hu);
  divCont.append(uvi);
  divCont.classList.add("divCont");
  containerRightElm.append(divCont);

  const bottomTitle = document.createElement("h3");

  bottomTitle.innerText = "5-Day Forecast:";

  bottomTitle.classList.add("bottomTitle");

  containerRightElm.append(bottomTitle);

  const containerRightBottom = document.createElement("div");

  containerRightBottom.classList.add("containerRightBottom");

  jsonData.daily.forEach((weatherData, index) => {
    const div = document.createElement("div");
    if (index < 6 && index > 0) {
      const time = new Date(weatherData.dt * 1000).toLocaleDateString();
      const h3 = document.createElement("h3");
      h3.innerText = time;
      const img = document.createElement("img");
      img.setAttribute(
        "src",
        `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
      );
      const h4T = document.createElement("h4");
      h4T.innerText = `Temp: ${weatherData.temp.day} °F`;
      const h4W = document.createElement("h4");
      h4W.innerText = `Wind: ${weatherData.wind_gust} MPH`;
      const h4H = document.createElement("h4");
      h4H.innerText = `Humidity: ${weatherData.humidity} %`;
      div.append(h3);
      div.append(img);
      div.append(h4T);
      div.append(h4W);
      div.append(h4H);

      containerRightBottom.append(div);
    }
  });
  containerLeftElm.innerHTML = "";
  containerRightElm.append(containerRightBottom);
  render();
}

searchButton.addEventListener("click", () => {
  const query = cityInput.value;
  searchData(query);
});

function render() {
  const cities = JSON.parse(localStorage.getItem("history")) || [];
  cities.forEach((city) => {
    const button = document.createElement("button");
    button.innerText = city;
    button.addEventListener("click", () => searchData(city));
    containerLeftElm.append(button);
  });
}

render();
