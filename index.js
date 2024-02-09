const readline = require("readline");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion() {
  rl.question(
    "1: 날씨 2: 이번주 날씨 3: 최신 뉴스 4: 키워드 뉴스 5: coingecko 6: pixabay 7: deleteDownloadedImages\n",
    (input) => {
      if (input === "1") {
        askCityForWeather();
      }
      if (input === "2") {
        // 이번주 날씨 조회 함수 호출
        askCityForWeeklyWeather();
      }
      if (input === "3") {
        getNews();
      }
      if (input === "4") {
        askNews();
      }
      if (input === "5") {
        askTop();
      }
      if (input === "6") {
        askPixabay();
      }
      if (input === "7") {
        deleteDownloadedImages();
      } else {
        askQuestion(); // 다시 묻기
      }
    }
  );
}

const deleteDownloadedImages = () => {
  const directory = "./downloaded_images";

  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error("디렉토리를 읽어오는 중 오류가 발생했습니다:", err);
      return;
    }

    for (const file of files) {
      fs.unlink(`${directory}/${file}`, (err) => {
        if (err) {
          console.error(`파일을 삭제하는 중 오류가 발생했습니다: ${file}`, err);
          return;
        }
        console.log(`파일 삭제 완료: ${file}`);
      });
    }
  });
};

function askPixabay() {
  rl.question("검색어를 입력하세요:", (searchTerm) => {
    rl.question("다운로드할 이미지 수를 입력하세요:", (numberOfImages) => {
      getPixabay(searchTerm, numberOfImages);
    });
  });
}

async function getPixabay(searchTerm, numberOfImages) {
  const API_KEY = process.env.YOUR_PIXABAY_API_KEY;

  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${API_KEY}&q=${searchTerm}&per_page=${numberOfImages}`
    );

    const imageData = response.data.hits.map((hit) => hit.largeImageURL);
    if (imageData.length === 0) {
      console.log("검색된 이미지가 없습니다.");
      askQuestion();
      return;
    }

    // 이미지 다운로드
    for (let i = 0; i < imageData.length; i++) {
      await downloadImage(imageData[i], i + 1);
    }
  } catch (error) {
    console.error("Pixabay API를 호출하는 동안 오류가 발생했습니다:", error);
    askQuestion();
  }
}

async function downloadImage(imageUrl, index) {
  try {
    const response = await axios.get(imageUrl, { responseType: "stream" });
    response.data.pipe(
      fs.createWriteStream(`./downloaded_images/image_${index}.jpg`)
    );
    console.log(`이미지 ${index} 다운로드 완료`);
  } catch (error) {
    console.error(
      `이미지 ${index}를 다운로드하는 동안 오류가 발생했습니다:`,
      error
    );
    askQuestion();
  }
}

function formatMarketCap(marketCap) {
  const trillion = 1e12;
  const billion = 1e8; // 억 단위로 변경
  const million = 1e4; // 만 단위로 변경

  if (marketCap >= trillion) {
    return (marketCap / trillion).toFixed(2) + " 조";
  } else if (marketCap >= billion) {
    return (marketCap / billion).toFixed(2) + " 억";
  } else if (marketCap >= million) {
    return (marketCap / million).toFixed(2) + " 만";
  } else {
    return formatNumber(marketCap);
  }
}

function getTop(top) {
  const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${top}&page=1&sparkline=true&price_change_percentage=24h`;

  axios
    .get(apiUrl)
    .then((response) => {
      const coinData = response.data;
      coinData.forEach((coin, index) => {
        console.log(
          `${index + 1}. ${coin.name}: ${coin.current_price} (${
            coin.price_change_percentage_24h
          }%) 시가총액: $ ${formatMarketCap(coin.market_cap)}`
        );
      });
      askQuestion();
    })
    .catch((error) => {
      console.error(
        "코인 시가총액 데이터를 가져오는 중 오류 발생:",
        error.message
      );
      askQuestion();
    });
}

function askTop() {
  rl.question("시가총액 몇 위까지?:", (top) => {
    getTop(top);
  });
}

function askNews() {
  rl.question("키워드를 입력하세요:", (keyword) => {
    getKeywordNews(keyword);
  });
}

function getKeywordNews(keyword) {
  const apiKey = process.env.NEWS_API_KEY; // Replace with your cryptocurrency news API key
  const apiUrl = `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${apiKey}`;

  axios
    .get(apiUrl)
    .then((response) => {
      const articles = response.data.articles;
      console.log(`📰 최신 ${keyword} 소식입니다:`);

      articles.forEach((article) => {
        console.log(`🔹 ${article.title}`);
        console.log(`${article.url}\n`);
      });

      askQuestion();
    })
    .catch((error) => {
      console.error(
        "키워드 뉴스 데이터를 가져오는 중 오류 발생:",
        error.message
      );
      askQuestion();
    });
}

function getNews() {
  const apiKey = process.env.NEWS_API_KEY;
  const apiUrl = `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${apiKey}`;

  axios
    .get(apiUrl)
    .then((response) => {
      const articles = response.data.articles;
      console.log("📰 최신 뉴스 기사입니다:");

      articles.forEach((article) => {
        console.log(`🔹 ${article.title}`);
        console.log(`${article.url}\n`);
      });

      askQuestion();
    })
    .catch((error) => {
      console.error("뉴스 데이터를 가져오는 중 오류 발생:", error.message);
      askQuestion();
    });
}

const cityNameMap = {
  부산: "Busan",
  서울: "Seoul",
  대구: "Daegu",
  인천: "Incheon",
  광주: "Gwangju",
  대전: "Daejeon",
  울산: "Ulsan",
  세종: "Sejong",
  경기도: "Gyeonggi-do",
  강원도: "Gangwon-do",
  충청북도: "Chungcheongbuk-do",
  충청남도: "Chungcheongnam-do",
  전라북도: "Jeollabuk-do",
  전라남도: "Jeollanam-do",
  경상북도: "Gyeongsangbuk-do",
  경상남도: "Gyeongsangnam-do",
  제주도: "Jeju-do",
  // 지원하는 도시들에 대해서 추가로 매핑 정보를 입력해주세요.
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
