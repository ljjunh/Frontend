// 기본 스택 쌓임/제거 확인
function c() {
  console.trace(); // 현재 콜스택 출력
}

function b() {
  c();
}

function a() {
  b();
}

a();

// 블로킹 확인
document.getElementById("btn").addEventListener("click", () => {
  console.log("클릭");
});

document.getElementById("blocking-btn").addEventListener("click", () => {
  console.log("블로킹 시작");
  const start = Date.now();
  while (Date.now() - start < 3000) {}
  console.log("블로킹 끝");
});

// 스택 오버플로우
function overflow() {
  return overflow();
}

try {
  overflow();
} catch (error) {
  console.log(error);
}

// LIFO 확인
function first() {
  console.log("first 시작");
  second();
  console.log("first 끝");
}

function second() {
  console.log("second 시작");
  third();
  console.log("second 끝");
}

function third() {
  console.log("third 시작");
  console.log("third 끝");
}

first();
