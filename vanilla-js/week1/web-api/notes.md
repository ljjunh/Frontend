# Web API

웹 브라우저에서 제공되는 기본 기능들로 별도의 선언이나 참조 없이 전역에서 접근 가능

"왜 Fetch를 리액트에서 참조 없이 사용 가능할까?"

- Fetch가 Web API이기 때문

## 대표적인 Web API

### Fetch

- 용도: 서버와 HTTP통신 (REST API 호출)

```javascript
fetch("https://api.example.com/data")
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### LocalStorage/SessionStorage

- 용도: 클라이언트 측 데이터 저장

```javascript
localStorage.setItem("user", JSON.stringify(userData));
const user = JSON.parse(localStorage.getItem("user"));
```

### Intersection Observer API

- 용도: 요소 가시성 관찰(무한 스크롤, 레이지 로딩)
- 예: 구글 애드센스(광고가 실제로 사용자에게 보였는지 모니터링)

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      loadContent();
    }
  });
});
observer.observe(document.querySelector(".footer"));
```

### Web Workers

- 용도: 메인 스레드 블로킹 방지 (무거운 계산 작업)

```javascript
const worker = new Worker("worker.js");
worker.postMessage(data);
worker.onmessage = (e) => console.log(e.data);
```

### Geolocation API

- 용도: 사용자 위치 정보 획득

```javascript
navigator.geolocation.getCurrentPosition(
  (position) => console.log(position.coords),
  (error) => console.error(error),
);
```

### Canvas API

- 용도: 동적 그래픽 생성 및 조작

```javascript
const ctx = canvas.getContext("2d");
ctx.fillStyle = "red";
ctx.fillRect(10, 10, 100, 100);
```

### WebSocket API

- 용도: 실시간 양방향 통신

```javascript
const socket = new WebSocket("wss://echo.websocket.org");
socket.onmessage = (e) => console.log(e.data);
socket.send("Hello!");
```

### Clipboard API

- 용도: 클립보드 작업

```javascript
navigator.clipboard
  .writeText("복사할 테스트")
  .then(() => console.log("복사 성공"));
```

최신 기능으로는 클립보드에 이미지 복사도 가능

```javascript
// 이미지 복사 (최신 브라우저)
const blob = await fetch("image.png").then((r) => r.blob());
await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
```

## 중요: navigator 객체

navigator 객체는 웹 브라우저의 정보와 기능에 접근할 수 있는 Web API
사용자의 브라우저 종류, 운영체제, 네트워크 상태 등 환경 정보 제공
전역 객체로 존재하므로 별도의 선언 없이 바로 사용 가능
![alt text](image.png)

**기능 지원 여부 판단 예시**

```javascript
// 서비스 워커 지원 여부
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

// 웹 공유 기능 지원 여부
if (navigator.share) {
  navigator.share({ title: "공유 예제", url: "..." });
}
```

### 중요: navigator.share 기능

보통 웹 개발시에 링크 공유에는 Clipboard API를 이용해 클립보드에 복사하는 정도로 구현되지만
웹 공유 자체 기능을 사용하면 네이티브 친화적인 공유가 가능해짐
![alt text](image-1.png)
프론트 개발시에는 사용자의 기기에 주소를 복사하는 정도의 기능으로 제공되는 클립보드 복사와
콘텐츠를 직접적으로 공유할 수 있는 navigator.share를 병행하여 UI로 분리해서 제공해주는게 가장 좋음
![alt text](image-2.png)

### 배터리 상태 조회(스마트폰 환경)

```javascript
navigator.getBattery().then((battery) => {
  console.log(`배터리 레벨: ${battery.level * 100}%`);
  battery.addEventListener("levelchange", updateBatteryUI);
});
```

navigator 객체의 각 기능은 브라우저 실행 환경에 따라 사용 가능한 기능에 차이가
있음. 그러므로 사용 전에 기능이 존재하는지 판단 후 호출하는게 안전함
또한 기능이 없을 경우에는 예외 처리가 꼭 필요함

### navigator.mediaDevices 기능

```javascript
// 카메라 접근
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    videoElement.srcObject = stream;
  })
  .catch((err) => {
    console.error("미디어 장치 오류:", err);
  });
```
