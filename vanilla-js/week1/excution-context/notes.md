# 실행 컨텍스트

실행 컨텍스트는 실행 가능한 코드에 제공할 환경 정보를 모아놓은 객체
변수 객체(VO), 스코프 체인, this의 정보를 담게 됨

하나의 함수가 실행될 때 참조해야 하는 값들의 집합이라고 생각할 수 있음
참조값을 모두 찾고(environmentRecord), 값이 존재하지 않을 때
Lexical 환경의 외부 환경 참조(outerEnvironmentReference)를 한다.
자바스크립트 코드의 환경과 순서를 보장하기 위함이다.

1. 필요한 환경 정보를 모아 객체(VO)를 구성
2. 이를 콜 스택에 누적(push)
3. 가장 위에 쌓여있는 컨텍스트와 관련 있는 코드를 실행(pop)
4. 실행 컨텍스트가 활성화되는 시점에 선언된 변수를 hoisting
5. 외부 환경 정보 구성
6. this 값 설정

**environmentRecord:**
현재 컨텍스트와 관련된 코드의 식별자 정보(매개변수 식별자, 함수 자체, 함수 내부 식별자) 저장

**outerEnvironmentReference:**
현재 호출된 함수가 선언될 당시의 LexicalEnvironment를 참조. 스코프, 스코프 체인 형성

## 렉시컬 스코프(어휘 범위)

함수가 정의(선언)되는 위치(코드 상의 물리적 위치)에 따라 결정되는 스코프(변수의 유효 범위).
JavaScript의 렉시컬 스코프는 "함수가 태어난 곳(정의된 위치)"을 기준으로 변수의 접근 범위를
정하는 규칙(-> "정적 스코프(Static Scope)"라고도 함)

특징:

1. "정적(Static)" 스코프: 함수가 정의된 위치에서 스코프가 결정
2. 스코프 체인: 변수를 찾을 때 자신의 스코프 -> 상위 스코프 -> 전역 순으로 탐색
3. 클로저 기반: 함수가 자신이 정의된 환경을 기억
   자바스크립트의 동작 원리 중 가장 기초이며 핵심이기에 코드 예측성 측면에서 매우
   중요하며, 이를 활용해 클로저를 구현해 함수 생성 시점의 환경을 보존할 수 있음.
   대표적인 예시가 아래의 예시로, 클로저를 통해 private 변수를 모사하여 사용할 수 있게 됨.

**기본 예시: 함수의 중첩과 스코프 체인**

```javascript
const outer = () => {
  const name = "Alice"; // outer 함수의 스코프

  const inner = () => {
    console.log(name); // inner는 자신의 스코프 -> outer 스코프 -> 전역 순으로 탐색
  };
  inner();
};
outer(); // 'Alice' 출력
```

** 클로저와 렉시컬 스코프**

```javascript
const createCounter = () => {
  let count = 0; // createCounter의 스코프

  return () => {
    count++; // 클로저로 count 변수에 계속 접근 가능
    console.log(count);
  };
};

const counter = createCounter();
counter(); // 1
counter(); // 2 (렉시컬 스코프로 인해 count 상태 유지)
```

반환된 함수는 createCounter의 스코프를 "기억"하기 때문에, count 변수에 접근하게 됨

**렉시컬 vs 동적 스코프**

```javascript
const name = "Global Alice";

const sayName = () => {
  console.log(name);
};

const outer = () => {
  const name = "Outer Alice";
  sayName(); // 렉시컬 스코프에서는 "Global Alice" 출력
};

outer();
```

1. 렉시컬 스코프: sayName은 정의될 때의 스코프(전역)를 따릅니다.
2. 동적 스코프라면?: 호출 위치(outer)의 스코프를 따라 "Outer Alice"가 출력될 것입니다. (하지만 JS는 렉시컬 스코프를 사용)

**화살표 함수와 this의 렉시컬 바인딩**

```javascript
const person = {
  name: "Bob",
  greet: function () {
    setTimeout(() => {
      console.log(`Hello, ${this.name}!`); // 화살표 함수는 렉시컬 this 사용
    }, 1000);
  },
};

person.greet(); // "Hello, Bob!" (일반 함수였다면 `this.name`은 undefined 나옴. window에서 name 찾음)
```

### this는 뭔가요?

현재 실행 컨텍스트(실행되는 환경)를 참조하는 특별한 키워드
다른 언어와 달리 JS의 this는 호출 방식에 따라 동적으로 결정

실생활로 비유하면 "나"와 같다

```javascript
const person = {
  name: "민수",
  sayHi() {
    console.log(`안녕, 나는 ${this.name}`);
  },
};

person.sayHi(); // 안녕, 나는 민수
```

실제 생활에서 "나"라는 말은 누구나 쓸 수 있지만, 호출한 사람에 따라 "나"라는 존재가 달라지는 것처럼 this도 호출된 곳에 따라 달라진다.

## this의 5가지 주요 바인딩 규칙

### 1. 기본 바인딩 (단독/일반 함수 호출)

```javascript
function showThis() {
  console.log(this); //브라우저: window, Node.js: global
}
showThis(); // 엄격 모드에서는 undefined (명시적으로 지정된 this가 없으면 undefined)
```

### 2. 암시적 바인딩 (객체 메서드 호출)

```javascript
const obj = {
  name: "Alice",
  greet() {
    console.log(`Hello, ${this.name}!`);
  },
};
obj.greet(); // "Hello, Alice!" (this는 obj)
```

### 3. 명시적 바인딩 (call, apply, bind)

```javascript
function introduce() {
  console.log(`I'm ${this.name}`);
}

const person = { name: "Bob" };
introduce.call(person); // "I',m Bob"
introduce.apply(person); // "I',m Bob"

const boundFunc = introduce.bind(person);
boundFunc(); // "I'm, Bob"
```

**call, apply, bind는 뭔가요?**
JavaScript에서 함수의 this를 명시적으로 설정할 때 사용하는 메서드
**공통점**

- 모두 Function.prototype에 정의된 메서드
- 모두 첫 번째 인자로 this로 사용할 값을 받음
- 모두 원래 함수의 this를 변경해서 실행하거나 새 함수로 반환

**차이점**

- call, apply는 즉시 실행하고 함수 실행결과를 반환함
- call, apply의 차이점은 call은 인자를 개별로 나열, apply는 인자를 배열로 전달
- bind는 즉시 실행하지 않고 this가 바인딩 된 새로운 함수를 반환. 인자는 개별로 나열

**언제 사용할까?**

- call / apply : 즉시 this를 바꿔서 함수 실행할 때
- bind : 이벤트 핸들러나 콜백 등 나중에 실행될 함수에서 this를 미리 고정하고 싶을 때

### 4. new 바인딩 (생성자 함수)

```javascript
function Person(name) {
  this.name = name;
}

const charlie = new Person("Charlie");
// JS엔진이 빈 객체 생성 this = {}
// 프로토타입 연결 {}.__proto__ = Person.prototype
// 함수 실행 this.name = name;
console.log(charlie.name); // "Charlie"
```

### 5. 화살표 함수의 this

```javascript
const outerThis = this;

const arrowFunc = () => {
  console.log(this === outerThis); // true (렉시컬 this)
};

const obj = {
  method: arrowFunc,
};
obj.method(); // true (호출 방식에 영향받지 않음)
```

**function(){}과 화살표 함수(()=>{})의 차이점**

1. function(){}의 함수선언은 자체적으로 this를 할당
2. 화살표 함수는 자체적으로 this가 없기에 부모 스코프의 this를 참조(정적 컨텍스트)
   정적 컨텍스트는 소스코드가 작성된 그 문맥의 실행 컨텍스트나 호출 컨텍스트에 의해 결정된다.
   즉 함수가 실행된 위치가 아닌, 정의된 위치에서의 컨텍스트를 참조

- 화살표 함수 : 콜백, 클로저, this 고정이 필요할 때.
- 일반 함수 : 메서드, 생성자 함수, 동적 this가 필요할 때.

- 일반 함수 : 생성자 함수로 사용 가능

```javascript
function Person(name) {
  this.name = name;
}
const alice = new Person("Alice"); // 정상 동작
```

- 화살표 함수 : new 연산자 불가

```javascript
const Person = (name) => {
  this.name = name; // TypeError: Person is not a constructor
};
const bob = new Person("Bob"); // 에러
```

new 키워드가 동작하려면 빈객체 생성 후 프로토타입을 연결해줘야하는데, 화살표함수는 프로토타입이 없으니까
Person is not a constructor
추가로 this 바인딩도 불가능

- 일반 함수 : 객체 메서드로 적합

```javascript
const obj = {
  value: 10,
  increment: function () {
    this.value++;
  },
};
obj.increment();
console.log(obj.value); // 11
```

- 화살표 함수: this가 객체를 가리키지 않음

```javascript
const obj = {
  value: 10,
  increment: () => {
    this.value++; // this는 전역 객체
  },
};
obj.increment();
console.log(obj.value); // 10 변화 없음
```

- 일반 함수 : prototype 존재

```javascript
function Car() {}
console.log(Car.prototype); // {} (생성자 함수용)
```

- 화살표 함수 : prototype 없음

```javascript
const Car = () => {};
console.log(Car.prototype); // undefined
```

- 일반 함수 : 호출 시점에 this 결정 (동적)

```javascript
const person = {
  name: "Alice",
  greet: function () {
    console.log(`Hello, ${this.name}!`);
  },
};
person.greet(); // "Hello, Alice!" (정상 동작)
setTimeout(person.greet, 100); // "Hello, undefined!" (this가 전역 객체로 바인딩)
// person.greet를 인자로 넘기는 순간 person과 연결이 끊김
// const fn = person.greet로 함수만 뽑아낸 것과 같음
// 100ms 후에 setTimeout이 fn()으로 단독 호출
// 옆에 아무것도 없는 호출 -> this = window
// window.name = undefined -> Hello, undefined!
```

- 화살표 함수 : 정의된 스코프의 this 사용(정적)

```javascript
const person = {
  name: "Bob",
  greet: () => {
    console.log(`Hello, ${this.name}!`); // this는 전역 객체 (렉시컬 스코프)
  },
};
person.greet(); // "Hello, undefined!" (화살표 함수의 this는 person이 아님)
```

### 변수 객체란 뭔가요?

정의:

- 현재 실행 컨텍스트에서 선언된 변수, 함수, 매개변수 등을 저장하는 객체
- 엔진이 코드를 해석할 때 참조하는 "데이터 저장소" 역할

특징:

- 전역 컨텍스트에서 VO는 전역 객체(브라우저의 window, Node.js의 global)와 동일
- 함수 컨텍스트에서 VO는 활성 객체(Activation Object, AO)로 불리며, 함수의 지역 변수, arguments 객체 등을 포함
- 변수/함수 선언은 호이스팅(Hoisting)되어 VO에 미리 등록

```javascript
console.log(a); // undefined(호이스팅)
var a = 10;
```

### 스코프 체인이란 뭔가요?

정의:

- 현재 실행 컨텍스트의 변수 객체와 외부 렉시컬 환경(Outer Lexical Environment)을 연결한 리스트
- 변수를 참조할 때 스코프 체인을 따라 상위 스코프로 탐색

특징:

- 렉시컬 스코핑에 기반 (함수가 정의된 위치에 따라 스코프가 결정됨)
- 체인의 최상위는 항상 전역 객체
- [[OuterEnv]](또는 [[Scope]]) 프로퍼티로 외부 환경을 참조

```javascript
function outer() {
  var x = 10;
  function inner() {
    console.log(x); // 10 (스코프 체인으로 outer의 x 탐색)
  }
  inner();
}
```
