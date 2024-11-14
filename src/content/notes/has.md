---
title: ":has() 가상 클래스 사용하기"
pubDate: "2023-07-02"
updatedDate: "2024-11-14"
summary: ":has() 가상 클래스에 대해 알아보고, 실무에서 적용했던 사례를 소개합니다."
language: "Korean"
---

## :has() 가상 클래스

CSS에서 제공하는 4개의 함수형 가상 클래스 중 하나인 `:has()`를 사용하면 자식 또는 뒤따르는 형제 요소에 따라 선행하는 부모 또는 형제 요소에 스타일을 적용할 수 있다.

:has()가 도입되기 이전에는 CSS만을 활용해 후행하는 요소에 따라 선택적으로 선행하는 요소의 스타일을 변경하는 것이 불가능했다. 예를 들어, \<h1> 요소 뒤에 \<h2> 요소가 바로 붙어있을 경우에 \<h2> 요소의 존재 유무에 따라 \<h1> 요소에 스타일을 적용하는 것이 자바스크립트를 사용하지 않고 CSS만으로는 불가능했다.

이런 어려움 때문에 지난 20년간 CSS Working Group에서는 일명 "부모 선택자(parent selector)"를 만들어내고자 노력했다. 다만, syntax는 쉽게 만들 수 있어도 CSS 엔진의 성능적 한계로 인해 물거품이 되곤 했다. 2018년에 CSS Selectors에 포함된 :has()는 2022년에 들어서야 3월 Safari, 8월 Chrome에서 지원을 시작했다.

## 사용법

`target:has(<relative-selector-list>) { ... }`

:has() 가상 클래스를 사용할 때, 함수를 호출하듯 인자로 선택자 리스트를 넘길 수 있다. 기존에는 이 리스트 중 브라우저가 인식하지 못하는 선택자가 있어도 그 부분만 무시되고 나머지 선택자들이 적용되었다. 하지만 지속적인 에러 발생으로 인해 주어진 선택자 중 하나라도 브라우저가 이해하지 못하는 경우에는 모두 무시되는 방식으로 바뀌었다.

:has()는 여러 선택자를 인자로 받을 뿐만 아니라, 체이닝하는 것도 가능해 논리연산을 가능하게 한다. 예를 들어, 선택자 리스트를 넘겼을 경우에는 그 선택자들 중 하나라도 매칭되면 스타일이 적용되는 OR (||) 연산이 가능하고, _:has():has()..._ 식으로 체이닝을 해 사용할 경우에는 각 :has()에 주어진 선택자가 매칭되어야 스타일이 적용되기 때문에 AND (&&) 연산이 가능하다.

이때 유의할 점은 :has() 안에서 \* 셀렉터를 쓸 수 있는데, 여기서 사용된 \*는 우리가 흔히 알고 있는 전체 선택자와는 다르다는 것이다. :has() 뿐만 아니라 다른 :is(), :where() 등 다른 함수형 가상 클래스에서 \*를 사용할 경우, 해당 가상 클래스가 가리키고 있는 요소를 지칭한다.

## :has()를 사용해볼 법한 상황들

```css
// figcaption 자식 element가 있는 figure에 스타일 적용
figure:has(> figcaption) { ... }
```

```css
// 바로 뒤따르는 input sibling이 있는 label에 스타일 적용
label:has(+ input) { ... }
```

```css
// 호버된 아이템이 있는 그리드에서 호버되지 않은 아이템에 스타일 적용
.grid:has(.grid__item:hover) .grid__item:not(:hover) { ... }
```

```css
// Invalid 필드가 있는 form에 스타일 적용
form:has(:invalid) {
}
```

## 장점

기존에 자바스크립트에 의존해야 했던 부분들을 CSS만으로도 구현할 수 있게 되었다. 스타일 구현에서 자바스크립트 로직을 제거함으로써 자바스크립트와 CSS가 각자 담당하는 영역에 충실할 수 있게 되어 Separation of Concerns 원칙에 더욱 부합하게 된다. 또한, 기존에는 요소들간의 관계를 설명하기 위해 매번 클래스를 추가해야 했는데 (ex: item\_\_has-img), :has()를 사용하면 이런 클래스들을 굳이 억지로 추가하지 않아도 된다.

## 단점

CSS 엔진의 성능과 관련 문제로 :has()의 도입이 늦어졌을 만큼, :has()를 잘못 사용할 경우 CSS 엔진의 성능을 하락시킬 수 있다. 이러한 이유로 브라우저에서는 :has()를 CSS 엔진의 성능에 문제를 발생시킬 수 있는 방식으로 사용하는 것을 제한하고 있다.

### CSS 엔진의 성능 하락을 유발할 수 있어 제한된 케이스들

```css
// :has() 안에 또 다른 :has()를 사용하는 것
:has(.a:has(.b)) { ... }
```

```css
// selector 리스트에 pseudo-element 사용하는 것
:has(::before) { ... }
p::first-letter:has(.img) { ... }
```

추가로, 아직 브라우저 지원이 미흡하다. 2023년 5월 21일 현재 크롬과 사파리는 지원하지만, 파이어폭스가 해당 기능을 지원하지 않는다. 따라서 해당 기능을 지원하지 않는 브라우저를 위한 코드를 추가로 작성해야 하는 번거로움이 있을 수 있다. (Update: 2024년 11월 14일 기준으로 파이어폭스를 포함한 모든 메이저 브라우저에서 :has() 가상 클래스를 지원한다.)

## 실무에서 적용했던 사례

회사에서 오토메이션 기능을 개발할 때, 오토메이션 실행 로그 테이블에서 성공, 실패 등 실행 성공 여부에 따라 리스트를 필터링하는 기능이 만들었다. 해당 필터는 셀렉트박스 컴포넌트로 구현되었는데, 선택된 아이템이 먼저 나오도록 sorting하고, 선택된 아이템 중 가장 마지막 아이템에는 "border-bottom" 스타일이 적용되어야 했다. 이때, 모든 옵션이 선택되면 마지막 선택된 아이템에 border-bottom 스타일을 적용하지 않는다.

각 옵션에는 `status-select-option` 클래스가 적용되고, 선택된 아이템만 `selected` 클래스가 적용된다. 이 두 클래스와 :has(), :not() 함수형 pseudo-class를 적절히 활용한 다음과 같은 코드를 통해 이 컴포넌트를 구현했다.

```css
// .selected > selected 클래스가 적용된 element 중,
// :not(:has(+ .selected)) > 뒤따르는 selected 클래스가 적용된 sibling element가 없는 경우이며,
// :has(+ .status-select-option) > 뒤에 또 다른 옵션이 있는 경우에만 스타일 적용

.selected:not(:has(+ .selected)):has(+ .status-select-option) {
  border-bottom: 1px solid var(--color-grey-200);
}
```

## 결론

앞서 서술한 바와 같이 :has() 가상 클래스를 실무에서 적용을 했고 문제없이 잘 작동하긴 했지만, 이런 식으로 복잡하게 사용하면 가독성이 너무 떨어지는 문제가 있어 사용을 신중하게 해야할 것 같다는 생각이다. CSS 스타일의 가독성이 너무 떨어져서 유지보수가 어려울 수준이 되면 차라리 자바스크립트를 활용하는 것이 나을 것 같다. 다만, 체이닝을 쓰지 않고, :has()에 간단한 선택자 리스트를 넘길 경우에는 자바스크립트를 쓰지 않고 빠르게 스타일을 구현할 수 있어 편리할 것 같다. 역시 다른 모든 것과 마찬가지로 :has() 가상 클래스는 상황에 따라 적절히 사용하는 것이 좋을 것 같다.

## 참고 자료

- :has(). MDN. <https://developer.mozilla.org/en-US/docs/Web/CSS/:has>
- Bece, A. (2021, June 9). Meet :has, a native CSS parent selector (and more). Smashing Magazine. <https://www.smashingmagazine.com/2021/06/has-native-css-parent-selector/#css-has-pseudo-class-specification>
- Simmons, J. (2022, October 6). Using :has() as a CSS parent selector and much more. WebKit. <https://webkit.org/blog/13096/css-has-pseudo-class>
- Tompkins, J. :has(): The family selector. :has(): the family selector. <https://developer.chrome.com/blog/has-m105/#performance-and-limitations>
