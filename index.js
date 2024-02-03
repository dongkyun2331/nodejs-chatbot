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
        softwareDesign2();
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

function softwareDesign2() {
  rl.question(
    "2. 메시지 지향 미들웨어(Message-Oriented Middleware, MOM)에 대한 설명으로 틀린 것은?\n 1: 느리고 안정적인 응답보다는 즉각적인 응답이 필요한 온라인 업무에 적합하다.\n 2: 독립적인 애플리케이션을 하나의 통합된 시스템으로 묶기 위한 역할을 한다.\n 3: 송신측과 수신측의 연결 시 메시지 큐를 활용하는 방법이 있다\n 4: 상이한 애플리케이션 간 통신을 비동기 방식으로 지원한다.\n",
    (input) => {
      if (input === "1") {
        console.log("정답");
      }
      if (input === "2") {
        console.log("오답");
      }
      if (input === "3") {
        console.log("오답");
      }
      if (input === "4") {
        console.log("오답");
      } else {
        softwareDesign2();
      }
      console.log(
        "MOM(Message Oriented Middleware)\n- 메시지 기반의 비동기형 메시지를 전달하는 방식의 미들웨어이다.\n- 온라인 업무보다는 이기종 분산 데이터 시스템의 데이터 동기를 위해 많이 사용한다.\n\nMoM(Message Oriented Middleware)은 즉각적인 응답을 원하는 경우가 아니라 다소 느리고 안정적인 응답을 필요로 하는 경우에 많이 사용됩니다."
      );
    }
  );
}

askQuestion();
