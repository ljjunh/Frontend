// 문제 1
// console.log("A");
// setTimeout(() => console.log("B"), 0);
// console.log("C");

// 정답 : A -> C -> B
// 1. 'A' 출력
// 2. setTimeout 콜백을 매크로테스크 큐에 등록
// 3. 'C' 출력
// 4. 콜스택이 비어있어서 마이크로테스크 큐 확인 -> 비어있음
// 5. 매크로테스크 큐 확인 -> 'B' 출력

// 문제 2
// console.log("A");
// setTimeout(() => console.log("B"), 0);
// Promise.resolve().then(() => console.log("C"));
// console.log("D");

// 정답 : A -> D -> C -> B
// 1. 'A' 출력
// 2. setTimeout 콜백을 매크로테스크 큐에 등록
// 3. Promise.then 콜백을 마이크로테스크 큐에 등록
// 4. 'D' 출력
// 5. 콜스택이 비니까 마이크로 테스크 큐 확인 -> 'C' 출력
// 6. 매크로 테스크 큐 확인 -> 'B' 출력

// 문제 3
// console.log("A");
// setTimeout(() => console.log("B"), 0);
// Promise.resolve()
//   .then(() => {
//     console.log("C");
//     return Promise.resolve();
//   })
//   .then(() => console.log("D"));
// Promise.resolve().then(() => console.log("E"));
// console.log("F");

// 정답 : A -> F -> C -> E -> D -> B
// 1. 'A' 출력
// 2. setTimeout 콜백을 매크로테스크 큐에 등록[B]
// 3. Promise.then 콜백을 마이크로테스크 큐에 등록 [C]
// 4. Promise.then 콜백을 마이크로테스크 큐에 등록 [C, E]
// 5. 'F' 출력
// 6. 콜스택이 비니까 마이크로 테스큐 확인 -> 'C' 출력, 콜백을 마이크로테스크 큐에 등록 [E, D]
// 7. 마이크로 테스크 큐의 'E' 출력 [D]
// 8. 마이크로 테스크 큐의 'D' 출력 []
// 9. 매크로 테스크 큐의 'B' 출력 []

// 문제 4
console.log("A");
setTimeout(() => {
  console.log("B");
  Promise.resolve().then(() => console.log("C"));
}, 0);
Promise.resolve()
  .then(() => console.log("D"))
  .then(() => console.log("E"));
setTimeout(() => console.log("F"), 0);
console.log("G");

// 정답 : A -> G -> D -> E -> B -> C -> F
// 1. 'A' 출력
// 2. setTimeout 콜백을 매크로테스크 큐에 등록 [B]
// 3. Promise.then 콜백을 마이크로테스크 큐에 등록 [D]
// 4. setTimeout 콜백을 매크로테스크 큐에 등록 [B, F]
// 5. 'G' 출력
// 6. 콜스택이 비어있고, 마이크로테스크 큐 먼저 실행 'D' 출력, 콜백을 마이크로 테스크큐에 등록 [E]
// 7. 마이크로 테스크큐에서 'E' 출력 []
// 8. 매크로 테스크큐 실행 'B' 출력 [F], 마이크로테스크큐에 등록 [C]
// 9. 매크로테스크 다음으로 넘어가기 전에 마이크로테스크 먼저 처리 'C' 출력
// 10. 매크로 테스크큐 실행 ['F']
