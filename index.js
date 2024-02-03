const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion() {
  rl.question("1: 정보처리기사 필기\n", (input) => {
    if (input === "1") {
      askYear();
    } else {
      askQuestion(); // 다시 묻기
    }
  });
}

function askYear() {
  rl.question("1: 220424\n", (input) => {
    if (input === "1") {
      askSubject();
    } else {
      askYear(); // 다시 묻기
    }
  });
}

function askSubject() {
  rl.question("1: 소프트웨어 설계\n", (input) => {
    if (input === "1") {
      softwareDesign();
    } else {
      askSubject();
    }
  });
}

function softwareDesign() {
  rl.question(
    "1. UML 다이어그램 중 순차 다이어그램에 대한 설명으로 틀린 것은?\n 1: 객체 간의 동적 상호작용을 시간 개념을 중심으로 모델링 하는 것이다.\n 2: 주로 시스템의 정적 측면을 모델링하기 위해 사용한다.\n 3: 일반적으로 다이어그램의 수직 방향이 시간의 흐름을 나타낸다.\n 4: 회귀 메시지(Self-Message), 제어블록(Statement block) 등으로 구성된다.\n",
    (input) => {
      if (input === "1") {
        console.log("오답");
      }
      if (input === "2") {
        console.log("정답");
      }
      if (input === "3") {
        console.log("오답");
      }
      if (input === "4") {
        console.log("오답");
      } else {
        softwareDesign();
      }
      console.log(
        "순차 다이어그래은 행위 다어어그램이므로 동적이고, 순차적인 표현을 위한 다이어그램이다,"
      );
    }
  );
}

askQuestion();
