self.onmessage = ({ data: { resA, resB } }) => {
  const resAArr = new Int32Array(resA);
  const resBArr = new Int32Array(resB);

  // 자원B 점유 (0 -> 1로 바꿈)
  Atomics.store(resBArr, 0, 1);
  self.postMessage("자원B 점유 완료 (resB[0] = 1");

  // 잠깐 대기 (workerA가 자원A 점유할 시간 주기)
  const start = Date.now();
  while (Date.now() - start < 500) {}

  // 자원A 기다림
  // resA[0]이 0이 아닐때까지 (workerA가 점유했으면 1임)
  self.postMessage("자원A 기다리는 중...");

  // workerA가 자원A 절대 안 놔줌 -> 영원히 대기
  while (Atomics.load(resAArr, 0) !== 0) {}

  self.postMessage("자원A 점유 완료"); // 영원히 안찍힘
};
