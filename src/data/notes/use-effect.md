---
title: "useEffect 훅 이해하기"
pubDate: "2025-1-3"
summary: "React 공식 문서를 읽으며 useEffect 훅의 본질에 대해 생각해 보았습니다."
language: "Korean"
---

Angular로 2년 넘게 개발하다가 React로 넘어오면서 느낀 가장 큰 차이점 중 하나는 바로 컴포넌트 라이프사이클 메소드의 부재였다. Angular에서는 컴포넌트를 만들 때마다 마운트 시 호출되는 ngOnInit이나 언마운트 시 실행되는 ngOnDestroy를 자주 사용했었다. 습관적으로 사용했다기보다는, 컴포넌트 마운트 시 RxJS 스트림을 구독하거나, 언마운트 시 해당 스트림을 해지하는 등 실제로 매우 유용한 작업을 처리할 때 쓰였기 때문에, React에는 왜 이런 메소드가 없을까 궁금해졌다.

React를 공부하고, 다른 사람들이 쓴 코드를 많이 읽다 보니 React에서는 이런 상황에서 useEffect 훅을 자주 사용하는 것을 보게 되었고, 나도 자연스럽게 그렇게 사용하게 되었다.

그런데, 12월 초에 React 19가 릴리즈된 이후, React에 어떤 변화가 있었을까 싶어서 공식 문서를 다시 한번 읽어보게 되었고, 그 과정에서 내가 React의 useEffect 훅의 사용 목적에 대해 매우 잘못 이해하고 있었다는 것을 깨닫게 되었다. 사실, 나뿐만 아니라 많은 개발자들이 useEffect의 본래 목적에 대해 잘못 알고 있는 것 같았다. React 팀도 이를 인지했는지, 공식 문서 중 상당히 많은 곳에서 useEffect에 대해 설명하고 있었다. 이를 통해 내가 잘못 이해했던 부분을 바로잡고, 새롭게 알게 된 점들을 글로 정리해보려 한다.

## 순수 함수

useEffect에 대해 알아보기 전에 우선 순수 함수에 대해 짚고 넘어가야 한다. React는 컴포넌트를 순수 함수로 작성할 것을 권장한다. **순수 함수**란 외부 프로그램 상태에 의존하거나 영향을 끼치지 않으며, 동일한 입력이 주어졌을 때 매번 동일한 값을 반환하는 함수를 의미한다. 이를 React 함수형 컴포넌트에 대입해 생각해보면, 순수 함수로 작성된 React 컴포넌트는 주어진 Context, Props, State만을 활용하여 JSX 값을 계산하고 반환하는 컴포넌트를 의미한다. 이렇게 작성된 컴포넌트는 렌더링이 더 효율적이고 결과값을 예측할 수 있어 사전에 버그를 예방할 수 있다.

함수 내에서 외부 상태값에 의존하거나, 함수 외부의 상태나 주어진 입력값을 변경하는 행위를 **부수 효과**(side effect)라고 부른다. 부수 효과에는 DOM을 조작하거나, API를 호출하고 그 결과값을 사용하는 것, 외부 변수에 값을 할당하는 것 등이 포함된다. 부수 효과가 포함된 함수는 정확히 어떤 값을 반환할지 예측하기 어려울 뿐만 아니라, 함수 호출이 어떤 상태 변화를 일으킬지 알 수 없어서 예기치 않은 버그를 발생시킬 수 있다. React 컴포넌트 내부에 부수 효과가 포함되면, 반환되는 JSX 값도 예측하기 어려워지고, 프로그램의 동작을 예측하는 데 어려움이 생긴다.

그렇기 때문에 React는 컴포넌트 렌더링 과정에서 부수 효과를 제외할 것을 권장한다. 부수 효과가 없는 컴포넌트를 사용하면 프로그램에서 버그 발생을 줄이고, 더 효율적인 렌더링이 가능해진다. 그러나 정적인 콘텐츠를 제공하는 블로그 같은 웹사이트가 아니라면, 부수 효과가 전혀 없는 프로그램을 상상하기는 어렵다. 실제로 많은 경우, 프로그램 상태를 조작하거나 서버와 데이터를 주고받는 등의 부수 효과가 핵심적인 역할을 한다. 이러한 부수 효과를 다루기 위해 React에서는 부수 효과를 두 가지 카테고리로 나누어 각 카테고리 별로 처리 방법을 제안한다.

## 이벤트, Effects

React는 프로그램 실행 시 발생할 수 있는 부수 효과를 이벤트(Event)와 Effect로 분류한다.

이벤트는 사용자의 행위, 예를 들어 마우스 클릭이나 키보드 입력에 의해 발생하는 부수 효과를 의미한다. React에서는 이런 이벤트가 발생할 때마다 이벤트 핸들러(Event Handler)를 통해 부수 효과를 처리하도록 한다. 이벤트 핸들러는 이벤트가 발생할 때만 호출되며, 일회성이다. 예를 들어 사용자가 메시지를 입력한 후 보내기 버튼을 눌렀을 때, 클릭 이벤트가 발생하고, 이때 클릭 이벤트 핸들러가 호출되는 방식이다.

반면 Effect는 사용자의 행위와는 상관없이 특정 컴포넌트가 렌더링될 때 발생하는 부수 효과를 의미한다. Effect는 기본적으로 렌더링이 발생할 때마다 실행되며, 이는 컴포넌트가 실제로 웹 페이지에 나타난 이후, 즉 커밋 단계 이후에 발생한다. 주로 Effect는 React 외부의 시스템과 동기화를 위한 목적으로 사용된다. 예를 들어, API 호출이나 타이머 설정, 브라우저 이벤트 구독 등을 처리할 때 Effect가 사용된다. React에서 Effect를 선언하려면 **useEffect** 훅을 사용한다.

React에서는 이벤트와 Effect를 각각 이벤트 핸들러와 useEffect 훅에서 다룸으로서 렌더링 프로세스에서 부수 효과를 분리할 수 있다. 이를 통해 React는 컴포넌트 렌더링의 효율성과 예측 가능성을 높일 수 있다.

이런 설명을 읽고 나면 useEffect가 함수형 컴포넌트에서 사용하던 생애주기 메소드의 일종인가 하는 생각이 들 수 있다. 실제로 “useEffect, 생애주기 메소드”라는 키워드로 구글에 검색해 보면, useEffect를 생애주기 메소드와 동일시하는 글이 상당히 많다. React 공식 문서도 과거에는 useEffect를 componentDidMount, componentDidUpdate, componentWillUnmount 메소드가 결합된 것이라고 [설명](https://legacy.reactjs.org/docs/hooks-effect.html)했다.

하지만 2025년 1월 기준, React 공식 문서에서는 이러한 설명이 삭제되었으며, 이제는 useEffect를 컴포넌트 생애주기와 연관 짓는 것을 지양하라고 명시하고 있다.

그렇다면 Effect와 useEffect 훅은 컴포넌트 생애주기와 별개의 개념이라면, 어떻게 이해해야 할까?

## Reactive Effects

React 공식 문서는 Effect를 렌더링에 의해 발생하는 부수 효과라고 설명함과 동시에, **"reactive"한 값의 변화에 반응하는 코드**라고 정의하기도 한다. 여기서 **reactive**한 값이란, props, state, 그리고 컴포넌트 내부에서 선언된 값처럼 **렌더링 과정에서 변할 수 있고, 렌더링에 사용되는 값**을 의미한다. 반면, 컴포넌트 외부에 선언된 값이나, ref.current처럼 값이 변경되어도 렌더링을 유발하지 않고, 렌더링 과정에서 변하지 않는 것은 reactive한 값이 아니다.

아래 예제를 통해 reactive한 값과 그렇지 않은 값을 구분할 수 있다:

```javascript
const text = "I don't change due to a render!"; // non-reactive

export function SomeComponent({ firstName, lastName }) {
  // firstName, lastName props -> reactive
  const [greeting, setGreeting] = useState("hello"); // reactive
  const fullName = `${firstName} ${lastName}`; // reactive
  const ref = useRef("What do you think?"); // ref, ref.current -> non-reactive
  const three = 3; // non-reactive

  return (
    <div>
      <span>
        {fullName} says {greeting}!
      </span>
    </div>
  );
}
```

useEffect의 두 번째 인자인 **의존성 배열**은 이러한 reactive 값 중 Effect가 변화를 감지해야 하는 값을 나열한다. React는 렌더링이 발생할 때마다 의존성 배열에 담긴 값들을 이전 렌더링과 비교하고, 하나라도 변경되었다면 해당 Effect에 등록된 함수를 호출한다.

따라서 Effect는 단순히 렌더링에 의해 발생하는 것이 아니라, 특정 reactive 값의 변화에 의해 트리거되는 부수 효과로 이해해야 한다. 더 나아가 Effect를 컴포넌트 생애주기와 결부짓는 대신, Effect 자체의 생애주기의 관점에서 바라보는 것이 더 적합하다. Effect는 특정 reactive 값의 변화에 따라 실행되며, 이후 또 다른 부수 효과가 발생할 경우 이전 Effect는 정리(clean-up)되는 과정을 거쳐 "실행과 종료"의 자체적인 생애주기를 갖는다.

## 내 생각

useEffect 훅에 대해 공부하며 느낀 점은, 이 훅이 사용법은 간단해 보이지만 개념적으로 이해하기 쉽지 않다는 것이다. 문법적으로는 직관적이고 React로 개발 시 자주 사용하는 익숙한 훅이었지만, 본질적인 개념은 이제야 제대로 이해한 것 같다.

그동안 useEffect 훅을 사용할 때 Angular의 컴포넌트 생애주기와 연관지어 생각했던 것 같다. Angular에서는 컴포넌트의 생애주기 메서드가 명확하게 나누어져 있고, 각 시점에서 수행해야 할 작업을 명시할 수 있었는데, 습관적으로 useEffect 훅을 그런 방식으로 사용하려 했던 것이다. 특히, Angular에서도 주로 쓰는 메소드는 컴포넌트 마운트, 업데이트, 언마운트 시점에 호출되는 것들인데 React에서 useEffect가 유사한 역할을 수행할 수 있다는 점에서 더더욱 Angular 방식으로 접근하게 되었던 것 같다.

하지만 이번 React 공식문서를 정독하며 useEffect의 본질적인 역할에 대해 알게 되었고, 더 나아가 React가 지향하는 선언적 프로그래밍 철학을 더 깊게 이해할 수 있었다. Angular는 명령형 프로그래밍 스타일에 기반해 컴포넌트의 생애주기를 명확히 정의하고 시점마다 작업을 지정하도록 요구한다. 반면 React는 useEffect 훅을 활용해 개발자가 원하는 "목적"만 명시하고, 이를 React가 적절한 시점에 알아서 실행하도록 설계되어 있다. 이런 방식으로 코드를 작성해보니 코드를 간결하게 유지하면서도, 여러 곳에서 쉽게 활용할 수 있어 유지보수성이 크게 향상되는 것을 체감했다.

물론, 이런 간결함과 유연성은 개발자가 프레임워크의 동작 원리를 제대로 이해했을 때 비로소 빛을 발한다. React가 아무리 선언적 코드를 알아서 실행해준다 해도, 내가 작성한 코드가 React가 기대하는 방향과 일치하지 않는다면, 불안정하거나 예측하기 어려운 결과가 나올 수 있다. 결국 핵심은 사용하는 프레임워크의 철학과 동작 방식을 제대로 이해하는 것이다.

이 경험을 통해 앞으로는 React뿐만 아니라 다양한 프로그래밍 스타일과 철학을 가진 프레임워크를 접하며, 각 상황에 맞는 최적의 코드를 작성할 수 있는 개발자가 되고 싶다.

## 참고자료

- Abramov, Dan. [A Complete Guide to useEffect][1]

- Dodds, Kent. [Why you shouldn't put refs in a dependency array][2]

- React. [Keeping Components Pure][3]

- React. [Lifecycle of Reactive Effects][4]

- React. [Synchronizing with Effects][5]

[1]: https://overreacted.io/a-complete-guide-to-useeffect/
[2]: https://www.epicreact.dev/why-you-shouldnt-put-refs-in-a-dependency-array
[3]: https://react.dev/learn/keeping-components-pure
[4]: https://react.dev/learn/lifecycle-of-reactive-effects
[5]: https://react.dev/learn/synchronizing-with-effects
