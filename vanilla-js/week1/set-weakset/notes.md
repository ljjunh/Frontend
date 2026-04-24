# Set

ES6(ECMAScript 2015)에서 도입된 고유한 값(중복 없는 값)들의 컬렉션을 저장하는 자료형

### 기본 특징

1. 중복 불가: 모든 값은 유일해야 함
2. 순서 보장: 삽입 순서가 유지됨
3. 빠른 검색: 값 존재 여부를 빠르게 확인 가능
4. 크기 추적: size 프로퍼티로 요소 개수 확인 가능

### 기본 용법

```javascript
const set = new Set();

// 값 추가
set.add(1);
set.add("text");
set.add({ a: 1 });
set.add(1); // 중복 추가는 무시됨

// 값 존재 여부 확인
console.log(set.has(1)); // true
console.log(set.has(2)); // false

// 값 삭제
set.delete("text");

// 크기 확인
console.log(set.size); // 2

// 전체 초기화
set.clear();
```

주로 배열과 객체를 많이 사용해서 개발하지만 특정 상황에 대해
배열을 대체하는 방식으로 Set을 활욯하면 좋음

### 배열 vs Set 주요 차이점

| 특징              | Array                 | Set                |
| ----------------- | --------------------- | ------------------ |
| 중복허용          | O                     | X                  |
| 순서 보장         | O                     | O(삽입순서 유지)   |
| 값 존재 여부 확인 | indexOf/includes 사용 | has() 메서드 사용  |
| 크기 확인         | length 프로퍼티       | size 프로퍼티      |
| 요소 접근 방식    | 인덱스 사용           | 순회로만 접근 가능 |

### 가장 흔한 사용법: 중복 제거

```javascript
// 배열로 초기화
const set = new Set([1, 2, 3]);

// 중복 제거된 배열 생성
const arr = [1, 2, 2, 3, 3, 3];
const uniqueArr = [...new Set(arr)];
```

### 실전 예시: 태그 입력 인풋 컴포넌트

```tsx
"use client";
import { useState } from "react";

const TagInput = () => {
  const [tags, setTags] = useState < Set < string >> new Set();
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    // Set중복방지만 보면 체크가 불필요하지만, 입력창을 안비우는 용도
    if (inputValue && !tags.has(inputValue)) {
      setTags(new Set(tags).add(inputValue));
      setInputValue("");
    }
  };

  const removeTag = (tag: string) => {
    const newTags = new Set(tags);
    newTags.delete(tag);
    setTags(newTags);
  };

  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTag()}
      />
      <button onClick={addTag}>Add Tag</button>
      <div>
        {Array.from(tags).map((tag: string) => (
          <span key={tag} className="tag">
            {tag}
            <button onClick={() => removeTag(tag)}>x</button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
```

### 실전 예시: 쇼핑몰 장바구니 데이터

```tsx
const Cart = () => {
  const [cartItems, setCartItems] = useState(new Set());

  const addToCart = (productId: string) => {
    // 이미 존재하는 상품은 추가하지 않음
    setCartItems((prev) => new Set(prev).add(productId));
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => {
      const newCart = new Set(prev);
      newCart.delete(productId);
      return newCart;
    });
  };

  return (
    <div>
      <h2>장바구니 ({cartItems.size}개 상품)</h2>
      <ProductList onAddToCart={addToCart} />
      <ui>
        {Array.from(cartItems).map((id) => (
          <CartItem
            key={String(id)}
            productId={id as string}
            onRemove={removeFromCart}
          />
        ))}
      </ui>
    </div>
  );
};
```

### 실전 예시: 소셜 서비스(또는 커뮤니티 서비스)의 좋아요 캐싱

```tsx
import { useState } from "react";

const LikeButton = ({ postId }: { postId: string }) => {
  const [likePosts, setLikePosts] = useState(() => {
    //localStorage에서 초기 값 로드
    const saved = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    return new Set(saved);
  });

  const isLiked = likePosts.has(postId);

  const toggleLike = () => {
    setLikedPosts((prev) => {
      const newLikes = new Set(prev);
      if (newLikes.has(postId)) {
        newLikes.delete(postId);
      } else {
        newLikes.add(postId);
      }

      // localStorage에 저장
      localStorage.setItem("likedPosts", JSON.stringify([...newLikes]));
      return newLikes;
    });
  };

  return (
    <button onClick={toggleLike} style={{ color: isLiked ? "red" : "gray" }}>
      +{isLiked ? "Liked" : "Like"}
    </button>
  );
};
```

Set으로 캐싱된 좋아요 목록을 통해 빠른 존재 여부 확인(has), 직렬화 저장 용이

### 이것만큼은 무조건 외워야 하는 개념: Set은 집합 연산 문제 해결에 좋음

```javascript
// 합집합
const union = new Set([...setA, ...setB]);

// 교집합
const intersection = new Set([...setA].filter((x) => setB.has(x)));

// 차집합
const difference = new Set([...setA].filter((x) => !setB.has(x)));
```

### Set 사용 시 주의 사항

키에 객체 자체{ a:1 }를 넣은 경우 각각은 서로 다른 참조가 되어 has 연산으로 false를 반환하지만,
객체를 담은 변수를 추가한 경우엔 해당 참조가 동일하여 true를 반환함

```javascript
const set = new Set();
set.add({ a: 1 });
set.has({ a: 1 }); // false (다른 객체 참조)

const obj = { a: 1 };
set.add(obj);
set.has(obj); // true (같은 객체 참조)
```

### Set 자료형 선택 기준

1. 중복 데이터를 허용하지 않아야 할 때
2. 값의 존재 여부를 빈번히 확인해야 할 때
3. 컬렉션의 정확한 크기를 자주 확인해야 할 때
4. 삽입 순서가 중요하면서 중복을 배제해야 할 때
5. 집한 연산이 필요할 때

Set은 이러한 요구사항이 있을 때 일반 배열보다 더 나은 성능과 코드 가독성을 제공

# WeakSet

ES6(ECMAScript2015)에서 도입된 메모리 관리와 객체 전용 저장에 특화

### 기본 특징

1. 객체 전용 저장: 오직 객체만 값으로 저장 가능(원시값 불가)
2. 약한 참조(Weak Reference): 객체에 대한 참조가 WeakSet에만 존재할 경우 가비지 컬렉션 대상이 됨
3. 반복 불가능: 열거형 메서드(keys(), values(), entries()) 없음
4. 크기 확인 불가: size 프로퍼티 없음
5. 전체 내용 확인 불가: 저장된 요소들에 직접 접근할 방법 없음

```javascript
const weakSet = new WeakSet();

// 객체 생성 및 추가
const obj1 = { id: 1 };
const obj2 = { id: 2 };
weakSet.add(obj1);
weakSet.add(obj2);

// 존재 여부 확인
console.log(weakSet.has(obj1)); // true

// 객체 삭제
weakSet.delete(obj1);

// 존재하지 않는 객체 확인
console.log(weakSet.has(obj1)); // false
```

### WeakSet vs Set 주요 차이점

| 특징          | WeakSet                 | Set                   |
| ------------- | ----------------------- | --------------------- |
| 값 타입       | 객체만 가능             | 모든 타입 가능        |
| 참조 방식     | 약한 참조               | 강한 참조             |
| 가비지 컬렉션 | 참조가 없으면 자동 제거 | 명시적 삭제 필요      |
| 반복 가능성   | 불가능                  | 가능                  |
| 크기 확인     | 불가능(size 없음)       | 가능(size)프로퍼티    |
| 초기화 방법   | 객체 배열로만 초기화    | 모든 값 배열로 초기화 |

### Vanilla JS에서 사용 패턴

```javascript
const trackedElements = new WeakSet();

function trackElement(element) {
  trackedElements.add(element);
}

function isTracked(element) {
  return trackedElement.has(element);
}

// 사용 예
const button = document.getElementById("myButton");
trackElement(button);

// 나중에 확인
console.log(isTracked(button)); // true

// 요소가 DOM에서 제거되면 자동으로 추적 해제 (가비지 컬렉션)
```

### 객체의 추가 속성 방지 (불변성 강제)

```javascript
const immutableObjects = new WeakSet();

function makeImmutable(obj) {
  immutableObjects.add(obj);
  return new Proxy(obj, {
    set(target, prop, value) {
      if (immutableObjects.has(target)) {
        throw new Error("This object is immutable!");
      }
      return Reflect.set(...arguments);
    },
  });
}

// 사용 예
const user = { name: "Alice" };
const protectedUser = makeImmutable(user);

protectedUser.age = 30; // Error: This object is immutable!
```

Proxy를 사용해 set을 오버라이드 한 후에 추가 속성에 대해 에러를 표기하도록 강제

## 그런데 Proxy 객체는 뭔가요?

메타 프로그래밍을 가능하게 하는 강력한 Javascript 기능

### 예시: 속성 접근 제어

```javascript
const handler = {
  get(target, prop) {
    if (prop === "age") {
      return `${target[prop]}세`;
    }
    return target[prop] || "존재하지 않는 속성";
  },
  set(target, prop, value) {
    if (prop === "age" && typeof value !== "number") {
      throw new TypeError("나이는 숫자만 입력 가능합니다");
    }
    target[prop] = value;
    return true; // 성공적으로 설정되었음을 나타냄
  },
};

const proxy = new Proxy(target, handler);

console.log(proxy.name); // 'Alice'
console.log(proxy.age); // '30세'
console.log(proxy.hobby); // '존재하지 않는 속성'

proxy.age = 31; // 정상 작동
proxy.age = "31"; // TypeError: 나이는 숫자만 입력 가능합니다
```

### 예시: Reflect + Private 속성 보호

```javascript
const secureHandler = {
  get(target, prop, receiver) {
    if (prop.startsWith("_")) {
      throw new Error(`Private property "${prop}" cannot be accessed`);
    }
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    if (prop.startsWith("_")) {
      throw new Error(`Private property "${prop}" cannot be modified`);
    }
    return Reflect.set(target, prop, value, receiver);
    // 그냥 접근할 수 있지만 Proxy안에서 target에 직접 접근하면 Proxy 무한루프 날 수 있어서 Reflect쓰는게 안전
  },
};

const user = {
  _password: "secret123",
  username: "jsUser",
};

const secureUser = new Proxy(user, secureHandler);

console.log(secureUser.username); // 'jsUser'
// console.log(secureUser._password); // Error: Private property "_password" cannot be accessed
secureUser.username = "newUser"; // 성공
// secureUser._password = 'hacked'; // Error: Private property "_password" cannot be modified
```

클라이언트 사이드에서 서버로 전달하는 Payload 데이터 중 접근은 가능하지만, 사용자가 수정을 해서는 안되는
데이터에 대해 Override를 제한해야 하는 경우가 많음. 이러한 데이터는 Proxy를 사용해 Setter를 보호하여 값의 덮어쓰기를
제한하거나 또는 경우에 따라서는 권한을 늘려 Validation으로 사용하는 것도 유리함

### 함수 프록시 - 실행 시간 측정

```javascript
function heavyCalculation() {
  let result = 0;
  for (let i = 0; i < 10000000; i++) {
    result += Math.sqrt(i);
  }
  return result;
}

const timingProxy = new Proxy(heavyCalculation, {
  apply(target, thisArg, args) {
    console.time("함수 실행 시간");
    const result = Reflect.apply(target, thisArg, args);
    console.timeEnd("함수 실행 시간");
    return result;
  },
});

timingProxy();
```

### 상태 변경 감지

```javascript
function createObservableState(initialState) {
  const observers = new Set();

  const handler = {
    set(target, prop, value) {
      const success = Reflect.set(target, prop, value);
      if (success) {
        observers.forEach((observer) => observer());
      }
      return success;
    },
  };

  const proxy = new Proxy(initialState, handler);

  return {
    state: proxy,
    subscribe(callback) {
      observers.add(callback);
      return () => observers.delete(callback);
    },
  };
}

// 사용 예
const { state, subscribe } = createObservableState({ count: 0 });

subscribe(() => {
  console.log("상태 변경됨:", state.count);
});
```

### 프록시의 핵심 용법

- 데이터 검증 및 유효성 검사
- 속성 접근 제어 및 보안 강화
- 로깅 및 디버깅
- 캐싱 및 메모이제이션
- 동작 모니터링 및 측정
- API 래핑 및 인터페이스 단순화

## 그런데 메타 프로그래밍은 뭔가요?

"프로그램이 프로그램을 조작하는 프로그래밍 기법"

### 핵심 개념

1. 코드가 코드를 생성/변경: 프로그램이 자신이나 다른 프로그램을 생성/수정
2. 런타임 프로그램 조작: 실행 중인 프로그램의 구조나 동작을 변경
3. 추상화의 추상화: 프로그래밍 언어 자체를 다루는 또 다른 계층의 언어

### 메타프로그래밍의 주요 유형

1. 구조적 메타프로그래밍: 코드 생성/변형
   - 코드 템플릿
   - 매크로 시스템
   - AST(추상 구문 트리)조작
2. 행위적 메타프로그래밍: 프로그램 실행 행위 변경
   - Hooking
   - Reflection
   - Interception

### 장점과 단점

장점:

- 반복 코드 감소
- 도메인 특화 언어(DSL) 생성 가능
- 높은 수준의 추상화
- 유연한 시스템 구축
  단점:
- 디버깅 어려움
- 성능 오버헤드
- 가독성 저하
- 예측하기 어려운 동작

### 실제 적용 사례

1. 프레임워크/라이브러리: Vue의 반응형 시스템, ORM 도구
2. 테스팅 도구: Mock 객체 생성
3. 코드 생성기: Swagger -> API 클래스 자동 생성
4. 컴파일러: 바벨의 트랜스파일링

### 그런데 DSL이 뭔가요?

DSL은 특정 분야에 최적화된 목적으로 설계된 언어
일반적인 프로그래밍 언어와 달리, 특정 문제 영역에 집중

- 예: SQL, HTML, CSS

### DSL의 특징

1. 전문성: 특정 도메인에 특화된 문법과 기능
2. 간결성: 도메인 전문가가 이해하기 쉬운 표현
3. 제한성: 특정 목적 외에는 사용 불가

### 그럼 도메인 특화 언어 생성 가능성이란 무엇일까?

이미 리액트를 사용하는 사람들은 프록시를 통해 언어 안에서 DSL을 경험하고 있음

```tsx
// JSX는 이렇게 컴파일 됨
<Button color="blue">Click</Button>
// -> React.createElement(Button, {color: "blue"}, "Click")
```

표현식으로 작성된 JSX 코드에 대해 우리는 그 어떤 처리도 하지 않았지만 createElement
명령어를 실행시켜 작동된다. 언어 안에서 작은 언어, 즉 도메인 트고하 언어가 마치 구현된 것처럼
사용되도록 프록시 활용을 극대화 할 수 있음

### 그런데 Reflect는 무엇일까?

JavaScript의 메타프로그래밍을 더 안정적이고 표준화된 방식으로 수행하기 위해 도입된 내장 객체

**Proxy 핸들러와 일대일 대응**
Proxy 핸들러의 trap 메서드와 Reflect 메서드가 정확히 일치
(대상 객체의 기본 동작을 가로채서 재정의할 수 있는 메서드)

```javascript
const target = { message: "안녕" };
const handler = {
  // get 트랩 예시
  get(target, prop, receiver) {
    console.log(`'${prop}' 속성에 접근했어요!`);
    return Reflect.get(target, prop, receiver);
  },
};

const proxy = new Proxy(target, handler);
proxy.message; // 콘솔: "'message' 속성에 접근했어요!' -> "안녕" 반환
```

### 일관된 동작 보장

성공 여부를 언제나 Boolean으로 반환하며, 설정시에는 Reflect.set()을 언제나 사용

```javascript
// 기존 방식
try {
  Object.defineProperty(obj, prop, desc);
} catch (e) {
  // 실패 처리
}

// Reflect 방식
if (!Reflect.defineProperty(obj, prop, desc)) {
  // 실패 처리
}
```

### 함수/생성자 호출의 표준화

apply와 construct 작업이 명시적으로 분리
기존엔 함수호출/생성자호출 방식이 달랐는데, Reflect로 일관된 형태로 쓸 수 있음

```javascript
function Test(a) {
  this.a = a;
}

// 기존 혼란스러운 방식
Test.call({}, 1); // 일반 함수로
new Test(1); // 생성자로

// Reflect의 명확한 구분
Reflect.apply(Test, {}, [1]); // 함수 호출
Reflect.construct(Test, [1]); // 생성자 호출
```

### 리시버 정확한 전달

프로토타입 체인과 getter/setter에서 this 컨텍스트 보존

### 순환 참조 감지 (객체 관계 분석)

가비지 컬렉션에 방해되지 안흥면서 객체 그래프 분석

```javascript
function hasCircularReferences(obj) {
  const seenObjects = new WeakSet();

  function detect(obj) {
    if (typeof obj === "object" && obj !== null) {
      if (seenObjects.has(obj)) return true;
      seenObjects.add(obj);

      for (const key in obj) {
        if (detect(obj[key])) return true;
      }
    }
    return false;
  }
  return detect(obj);
}

// 사용 예
const objA = {};
const objB = { a: objA };
objA.b = objB; // 순환 참조 생성

console.log(hasCircularReferences(objA)); // true
```

### 프라이빗 멤버 에뮬레이션

```javascript
const privateMembers = new WeakSet();

class MyClass {
  #secret = 42;

  constructor() {
    privateMembers.add(this);
  }

  getSecret() {
    if (!privateMembers.has(this)) {
      throw new Error("Access denied!");
    }
    return this._secret;
  }
}

// 사용 예
const instance = new MyClass();
console.log(instance.getSecret()); // 42
```

### WeakSet의 적절한 사용 시나리오

1. 객체의 추가 정보를 저장하지 않고 단순히 존재 여부만 추적할 때
2. 메모리 누수 위험 없이 객체를 임시로 표시해야 할 때
3. 라이브러리/프레임워크 내부에서 임시 상태를 추적할 때
4. 보안상 이유로 외부에서 접근하지 못하게 할 때
