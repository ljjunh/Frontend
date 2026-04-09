self.onmessage = ({ data: { resA, resB } }) => {
  const resAArr = new Int32Array(resA);
  const resBArr = new Int32Array(resB);

  // 자원A 점유 (0 -> 1로 바꿈)
  Atomics.store(resAArr, 0, 1);
  self.postMessage("자원 A 점유 완료 (resA[0] = 1)");

  // 잠시 대기 (workerB가 자원B 점유할 시간 주기)
  const start = Date.now();
  while (Date.now() - start < 500) {}

  // 자원B 기다림
  // resB[0]이 0이 아닐 때까지 (workerB가 점유했으면 1임)
  self.postMessage("자원B 기다리는 중...");

  // workerB가 자원 B 절대 안놔줌 -> 영원히 대기
  while (Atomics.load(resBArr, 0) !== 0) {}

  self.postMessage("자원B 점유 완료"); // 영원히 안찍힘
};
