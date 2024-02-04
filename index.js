const readline = require("readline");
const axios = require("axios");
require("dotenv").config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion() {
  rl.question("1: 날씨\n2: 이번주 날씨\n", (input) => {
    if (input === "1") {
      askCityForWeather();
    } else if (input === "2") {
      // 이번주 날씨 조회 함수 호출
      askCityForWeeklyWeather();
    } else {
      askQuestion(); // 다시 묻기
    }
  });
}

const cityNameMap = {
  // ... (기존 도시 매핑 정보)
};

function askCityForWeather() {
  rl.question("날씨를 확인할 city를 입력하세요:", (cityName) => {
    getWeather(cityName);
  });
}

function askCityForWeeklyWeather() {
  rl.question("이번주 날씨를 확인할 city를 입력하세요:", (cityName) => {
    getWeeklyWeather(cityName);
  });
}

function getWeather(cityName) {
  const city = cityNameMap[cityName] || cityName;
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=en`;

  axios
    .get(apiUrl)
    .then((response) => {
      const { weather, main } = response.data;
      const description = weather[0].description;
      const temp = main.temp;
      console.log(`${cityName} ${description}, ${temp}도`);
      askQuestion();
    })
    .catch((error) => {
      console.error("날씨 데이터를 가져오는 중 오류 발생:", error.message);
      askQuestion();
    });
}

function getWeeklyWeather(cityName) {
  const city = cityNameMap[cityName] || cityName;
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=en`;

  axios
    .get(apiUrl)
    .then((response) => {
      const { list } = response.data;
      console.log(`${cityName} 이번주 날씨:`);

      // 각 예보에 대한 정보를 출력하는 부분
      list.forEach((forecast) => {
        const dateTime = forecast.dt_txt;
        const temperature = forecast.main.temp;
        const description = forecast.weather[0].description;

        console.log(`날짜 및 시간: ${dateTime}`);
        console.log(`온도: ${temperature}도`);
        console.log(`날씨 상태: ${description}`);
        console.log("--------------------");
      });

      askQuestion();
    })
    .catch((error) => {
      console.error(
        "이번주 날씨 데이터를 가져오는 중 오류 발생:",
        error.message
      );
      askQuestion();
    });
}

askQuestion();
