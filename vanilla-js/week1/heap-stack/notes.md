# Heap

"힙은 거대한 창고다."
객체, 배열 등 참조 타입의 데이터가 저장되는 메모리 영역
동적 메모리 할당을 위해 관리되는 메모리 영역
-> 스택과 함께 프로그램의 메모리 레이아웃을 구성하는 주요 요소

js에서 개발자가 직접 힙을 다루지는 않음
객체/배열을 만들면 JS 엔진이 자동으로 힙에 저장
해제도 가비지 컬렉터가 자동으로 처리

**객체/배열은 왜 힙에 저장될까?"**

- 크기를 미리 알 수 없기 때문
- 스택은 컴파일 시점에 크기를 미리 계산해서 공간을 잡는데, 객체/배열은 크기가 유동적임
- 실행 전에 크기를 알 수 없으니 스택에 미리 공간을 잡을 수 없고 런타임 중에 유연하게 크기 조절이 가능한 힙에 저장
- 스택에는 변수 이름과 힙 주소(참조)만 저장되고 실제 객체 데이터는 힙에 저장

**힙 vs 스택 비교 **
| 비교항목 | 힙 | 스택 |
|-------|-------|-------|
| 할당 박식 | 동적(런타임 중 결정) | 정적(컴파일 시 결정) |
| 관리 주체 | 개발자/가비지 컬렉터 | 시스템(자동 관리)|
| 접근 속도 | 상대적으로 느림 | 빠름 |
| 메모리 크기 | 큰 공간, 유연한 확장 | 제한적, 고정 크기|
| 사용 사례 | 객체, 배열, 동적 자료구조 | 지역 변수, 함수 호출 |

```javascript
// 객체는 힙에 할당됨
const user = { name: "Alice", age: 25 }; // 힙 메모리 사용

// 배열도 힙에 저장
const numbers = [1, 2, 3]; // 힙 할당
```

**힙 메모리 관련 주의사항**
메모리 누수

- 할당 후 해제하지 않으면 메모리가 계속 유지
- 예: JavaScript에서 불필요한 전역 변수 사용

```javascript
function createLeak() {
  globalVar = new Array(1000000); // 전역 변수로 누수 발생
}
```

단편화(Fragmentation)

- 빈번한 할당/해제로 메모리가 조각나 효율성이 떨어질 수 있음
  성능 오버헤드
- 스택보다 할당/해제 속도가 느림

그럼 어떻게 메모리 누수를 분석할까?
프론트엔드에서는 Chrome DevTools와 라이브러리를 활용해
효과적으로 감지할 수 있고 코드 레벨에서 메모리 누수를 관리할수도
있음(WeakSet, WeakMap, 클로저 등)

### 힙의 핵심 특징

1. 동적 할당(Dynamic Allocation)

- 런타임 중에 메모리 크기가 결정(예: new, malloc(), 객체, 배열 등)
- 스택과 달리 사용자가 직접 관리(할당/해제)

2. 생명 주기(Lifetime)

- 명시적으로 해제되기 전까지 유지
- 예: JavaScript에서는 가비지 컬렉터(GC)가 더 이상 참조되지 않는 객체를 자동으로 정리

3. 크기 유연성

- 필요에 따라 메모리를 확장하거나 축소 가능

4. 전역 접근 가능

- 힙에 할당된 데이터는 프로그램의 어디서나 접근 가능

### 힙 메모리 누수의 주요 원인

1. 불필요한 전역 변수

```javascript
window.leakyData = new Array(1000000); // 전역 변수는 GC되지 않음
```

2. 분리된 DOM 요소

```javascript
const element = document.createElement("div");
document.body.appendChild(element);
document.body.removeChild(element); // DOM에서 제거됨
// element 변수가 여전히 참조 중 -> 메모리 누수
```

3. 클로저에 갇힌 큰 데이터

```javascript
function createLeak() {
  const hugeData = new Array(100000); // 클로저에 갇혀 GC되지 않음
  return () => console.log("Leak!");
}
const leakyFunc = createLeak(); // hugeData가 계속 메모리네 남음
```

4. 미해제된 이벤트 리스너 / 타이머

```javascript
// 이벤트 리스너 누수
element.addEventListener("scroll", heavyFunction);
// 인터벌 누수
const timer = setInterval(() => {}, 1000); // clearInterval 안 함
```
