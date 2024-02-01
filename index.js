const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function displayMenu() {
  console.log("exit:나가기");
}

rl.on("line", (input) => {
  if (input === "exit") {
    console.log("프로그램을 종료합니다.");
    rl.close();
  } else if (input === "날씨") {
  } else {
    console.log("올바른 선택지를 입력하세요.");
  }

  displayMenu();
});

console.log("Hello");
displayMenu();
