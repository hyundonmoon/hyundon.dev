---
title: "Critical Rendering Path 이해하기"
pubDate: "2022-03-28"
summary: "브라우저는 어떻게 HTML, CSS, JavaScript를 웹사이트로 변환할까?"
language: "Korean"
---

“브라우저에 URL을 입력하고 요청한 페이지를 볼 때까지 어떤 일이 일어나는가?”는 프론트엔드 개발자 면접에 자주 등장하는 질문 중 하나다. 브라우저에 URL을 입력하고 엔터키를 누르면, 브라우저는 해당 URL의 IP 주소를 찾아 이 주소를 갖는 서버로 HTTP 요청을 보내게 된다. 서버는 해당 경로에 존재하는 리소스를 돌려주고, 브라우저는 돌려받은 리소스를 사용자가 볼 수 있도록 구현해준다. 대다수의 경우 브라우저가 서버로부터 돌려받는 리소스는 웹사이트를 구성하는 HTML, CSS, JavaScript이다. 그런데 브라우저는 어떻게 HTML, CSS, JavaScript를 종합해 사용자가 볼 수 있고 상호작용할 수 있는 웹사이트를 구현하는 걸까?

## Critical Rendering Path

브라우저가 HTML, CSS, JavaScript를 활용해 웹사이트를 가시적으로 구현하기 위해 필요한 일련의 단계들을 **Critical Rendering Path**라 부른다. 이 과정은 다음 단계들로 이루어진다.

- Document Object Model (DOM) 생성
- CSS Object Model (CSSOM) 생성
- JavaScript 실행
- Render Tree 생성
- 레이아웃
- 페인트

### Document Object Model (DOM) 생성

브라우저가 서버에 HTML 파일에 대한 요청을 보내면, 서버는 바이트(이진수)로 이루어진 HTML 문서를 돌려준다. 이 상태로는 브라우저가 문서를 곧바로 활용할 수 없으므로, 문서를 브라우저가 활용할 수 있는 자료구조로 가공하는 과정(파싱)이 필요하다.

우선 브라우저는 바이트 형태로 작성된 HTML 문서를 문자열로 변환한다. 이때 변환은 HTML 파일에 작성된 meta 태그의 charset 속성에 지정된 인코딩 방식을 기준으로 이루어지는데, 이 정보는 HTTP 응답 헤더에서 담겨있다.

HTML 문서가 바이트에서 문자열로 변환됐지만, 이 또한 브라우저가 웹 사이트를 구현하는 데 활용할 수 있는 구조가 아니다. 따라서 브라우저는 문자열을 문법적 의미를 갖는 최소한의 단위로 분석, 분해한다. 이 단위는 토큰(Token)이라 부르며, 토큰은 인간의 언어에서 자립적으로 쓸 수 있는 최소 단위인 단어에 해당한다. 문자열을 토큰으로 변환하는 이 과정을 토크나이징(Tokenizing)이라 부른다.

다음, 브라우저는 각 토큰을 노드(Node)라는 단위로 변환한다. 토큰은 특정 HTML 요소에 관한 정보를 담고 있는데, 노드는 이 정보를 객체화해서 저장한다. 노드는 이후 생성될 Document Object Model의 기본 단위이기도 하다.

마지막으로, 생성된 노드들은 HTML 문서 내 HTML 요소들 사이에 존재하는 중첩 관계에 따라 연결되어 트리 자료구조 형태의
**Document Object Model** (**DOM**)을 이루게 된다. DOM이 HTML 파싱의 최종 결과물이 되는 셈이다.

DOM은 HTML 문서 내 존재하는 모든 정보와 노드 간 관계를 객체화해 담아낸다. 이후 브라우저가 웹사이트를 구현할 때, 모든 작업은 DOM을 기반으로 이루어지게 된다. 이때 유의할 점은, 이 과정이 한꺼번에 이루어지지 않는다는 점이다. HTML 문서 파싱을 시작함과 동시에 DOM 최상위에 있을 루트 노드인 문서 노드(document node)가 생성된다. 그 이후 HTML 문서 내 존재하는 요소들은 차례대로 파싱 되어 토큰, 노드로 변환되고 DOM 트리 구조에 추가된다.

### CSS Object Model (CSSOM) 생성

브라우저가 HTML 문서를 파싱하는 과정에서 외부 CSS stylesheet를 불러오는 link 태그나 CSS 스타일 정보를 표기하는 style 태그를 만날 수 있다. 이때, 브라우저는 DOM 생성을 일시적으로 멈춘 후, CSS를 파싱한다.

이때, CSS를 파싱하는 과정은 브라우저가 HTML을 파싱해 DOM 트리를 만드는 과정과 동일하다. 외부 stylesheet를 불러오는 경우, 우선 link 태그의 href 속성에 명시된 주소로 요청을 보낸다. HTML과 마찬가지로 서버로부터 돌려받는 CSS 파일은 바이트 형태로 되어있다. 이를 브라우저가 활용할 수 있는 자료 구조로 가공하기 위해 바이트를 문자열로 변환하고, 토크나이징을 거쳐서 노드를 만든 후 노드를 연결해 CSS 파일을 트리 구조의 자료 구조로 변환한다. CSS 파싱의 최종 결과물은 CSS 정보를 객체화한 **CSS Object Model** (**CSSOM**)이다.

CSSOM이 트리 구조 형태를 갖는 이유는, CSS의 이름에서 힌트를 얻을 수 있다. CSS 스타일은 부모 노드에서 자식노드로 폭포수(Cascade)처럼 상속된다. 물론, 부모 노드에서 상속받은 스타일보다 우선순위가 높은 스타일이 있다면, 자식 노드는 그 스타일대로 구현된다. 브라우저가 최종적으로 특정 노드에 적용되는 스타일을 계산할 때, 상단에 위치한 보편적인 스타일부터 시작해, 재귀적으로 해당 노드에 적용될 더 자세한 스타일을 추가해 나간다. 위에서 아래로, “폭포수"처럼 상속되는 CSS 스타일의 특징 때문에 CSSOM이 트리 구조의 형태를 갖는다.

앞서, 브라우저가 link 태그나 인라인 CSS 태그를 찾으면 DOM 생성을 멈춘다고 언급했다. _모던 자바스크립트 Deep Dive_ 에는 CSS 파일을 서버로부터 받아 파싱한 후, HTML 파싱이 중단된 지점부터 DOM 생성이 재개된다고 적혀있다(pg. 667). 하지만 엄밀히 말하면 이 부분은 올바른 설명이 아닌듯하다. 정확히 말하면, 추가적인 설명이 필요하다고 본다.

다른 자료의 파싱을 막는 리소스는 **파서 차단 리소스** (parser blocking resource)라고 부른다. 이와 달리 브라우저가 웹 사이트를 렌더링하는 것을 일시적으로 막는 리소스는 **렌더링 차단 리소스** (render blocking resource)라 부른다. 모던 자바스크립트 Deep Dive의 설명대로라면 CSS는 파서 차단 리소스겠지만, [실제로 CSS는 렌더링 차단 리소스에 해당한다](https://developers.google.com/web/fundamentals/performance/critical-rendering-path). HTML 파싱 과정에서 브라우저가 외부 stylesheet를 요청하는 link 태그를 찾게 될 경우, href에 명시된 주소로 요청을 보내 CSS 파일을 받고, 그것을 CSSOM으로 파싱한다. 하지만, 이 과정에서 HTML 파싱은 중단되지 않는다. CSS 파일에 대한 요청을 보낸 후 HTML 파싱이 중단되는 것이 아니라 그대로 진행된다.

다만, CSS가 전부 파싱이 되어 CSSOM이 완전히 생성되기 전까지 브라우저는 페이지를 렌더링할 수 없다. 렌더 트리 (render tree)를 구현하기 위해서는 DOM과 CSSOM 모두 필요하기 때문이다. 이런 특성 때문에 CSS를 렌더링 차단 리소스라고 부른다. 그렇다면 왜 여러 자료들이 CSS가 HTML 파싱을 막는다고 설명할까?

저자들의 의도를 완벽하게 예측할 수는 없겠지만, 아마도 CSSOM 생성과 JavaScript의 실행 사이 관계 때문인 것 같다. 뒤에 다시 보겠지만, HTML 파싱 과정에서 외부 JavaScript 파일을 불러오는 script 태그를 찾으면 DOM 생성을 일시 중단한다. 이때, 제어권은 브라우저의 렌더링 엔진에서 JavaScript 엔진으로 넘어간다. 이 과정에서 HTML 파싱이 중단되기 때문에 JavaScript는 파서 차단 리소스에 해당한다. 그런데, 만약 CSSOM 생성이 끝나지 않은 상태에서 브라우저가 script 태그를 만나면 어떻게 될까?

JavaScript 코드를 통해 페이지 구현에 활용될 CSS를 바꿀 수 있다. CSSOM이 완성되지 않은 상태에서 JavaScript가 스타일을 읽거나 수정하려 하면 에러가 발생할 수 있다. 그렇기 때문에 [브라우저는 CSS 파일을 서버로부터 받는 도중에는 JavaScript 코드를 실행하지 않는다](https://csswizardry.com/2018/11/css-and-network-performance/). 그런데 JavaScript는 HTML 파싱을 일시적으로 차단하는 리소스에 해당한다. 그렇기에 CSS 파일을 서버로부터 받는 중 브라우저가 JavaScript를 실행하려 하면, 마치 CSS 파싱이 HTML 파싱을 차단한 모양새가 된다. 이런 특성 때문에 여러 자료에서 CSS가 파서 차단 리소스라고 설명하는 게 아닐까 싶다.

### JavaScript 실행

JavaScript 실행은 기본적으로 HTML 문서 내 script 태그가 위치한 지점에서 이뤄진다. HTML 파싱이 진행되는 도중 브라우저가 script 태그를 발견하면, DOM 생성을 중단하고, 제어권을 브라우저에 내장된 JavaScript 엔진에 넘긴다. 앞서 본 CSS와 달리, JavaScript는 HTML 파싱을 중단시키기 때문에 파서 차단 리소스에 해당한다. script 태그 사이에 작성된 JavaScript 코드나 외부에서 불러오는 JavaScript 코드 모두 이에 해당한다. JavaScript 파싱과 코드 실행이 끝난 후, 제어권이 JavaScript 엔진에서 렌더링 엔진으로 다시 넘어가게 되고, 브라우저는 HTML 파싱이 중단되었던 지점으로부터 파싱을 재개한다.

HTML 문서에서 **script 태그의 위치**는 렌더링 과정에서 중요한 의미가 있다. script 태그를 body 태그 끝에 두는 경우가 많은데, 이런 관습도 JavaScript가 DOM 생성을 중단시키는 것과 관련되어 있다. DOM 생성이 완료되기 전에 실행된 JavaScript가 DOM API를 통해 DOM을 조작하려 하면 아직 아직 생성되지 못한 노드에 접근을 시도하는 등 에러가 발생할 수 있다. 그렇기에 body 태그 내 존재하는 모든 요소가 파싱된 이후에 script를 실행함으로써 이런 에러를 방지할 수 있다. 앞서 보았듯이 DOM과 달리 CSSOM의 경우, CSSOM 생성이 진행 중일 때 JavaScript의 실행은 중단되어서 이런 에러를 원천 차단한다.

script 태그를 body 태그 끝에 두는 것은 외부에서 JavaScript를 불러올 때는 효율적이지 못할 수 있다. JavaScript 파일을 외부에서 불러올 경우, 서버에 요청을 보내고 응답받을 때까지 브라우저는 대기해야만 하는데, JavaScript 파일의 용량이 클 경우, 대기 시간이 길어져 페이지 렌더링이 지연될 수 있다. 이 문제는 script 태그에 **async** 또는 **defer** 속성을 추가해 해결할 수 있다. 이 키워드들은 브라우저가 JavaScript 코드를 비동기적으로 불러올 수 있게 해준다. async 속성의 경우, JavaScript 파일 로딩이 완료된 시점에 JavaScript 코드가 시행되며 defer를 활용할 때는 DOM 생성이 완료된 이후에 JavaScript 코드가 실행된다.

### Render Tree 생성

DOM과 CSSOM은 개별적인 객체로서 웹사이트에 관련해서 각기 다른 정보를 담고 있다. DOM의 경우 페이지에 구현되어야 할 내용을 내포하고, CSSOM은 HTML 요소들이 어떤 스타일로 구현되어야 하는지를 담고 있다. 페이지가 렌더링되기 위해서는 DOM과 CSSOM이 담고 있는 정보가 하나의 자료구조로 합쳐져야 한다.

DOM과 CSSOM 생성이 끝난 후, 브라우저는 DOM과 CSSOM을 결합해 **렌더 트리** (**render tree**)를 생성한다. 렌더 트리는 웹사이트에서 실제로 구현되는 모든 DOM의 노드들과 그 노드들에 적용될 CSSOM 스타일 정보를 저장한다. 렌더 트리를 구현하기 위해 브라우저는 DOM 트리 구조의 최상단인 루트 노드에서 시작해 모든 노드를 순회한다. 페이지에 구현될 노드를 찾을 때마다 브라우저는 CSSOM에서 그 노드에 적용될 스타일을 찾아 추가한다. 그 후 각 노드를 렌더 트리에 추가한다. 최종 결과물인 렌더 트리는 DOM 노드에 스타일이 추가된 노드들로 이뤄지며, 이후 실제로 페이지를 구현하는 단계에서 활용된다.

이때 유의할 점은, 렌더 트리가 브라우저 화면에 **실제로 렌더링 되는 노드**만으로 구성된다는 점이다. head 태그 안에 있는 meta 태그나 script 태그, 또는 CSS에 의해 “없어진" 노드 (display: none)들은 렌더 트리에 포함되지 않는다.

또한, DOM 트리 구조와 렌더 트리는 비슷한 구조를 갖지만, 같을 수 없다. 구현되지 않는 노드를 포함하지 않기 때문에 다를 수밖에 없고, “position: absolute” 등 CSS 프로퍼티를 활용해 HTML 문서의 일반적인 flow에서 벗어난 노드들은 렌더 트리에서 다른 부분에 있게 된다.

### 레이아웃

**레이아웃** (layout) 단계에서 브라우저는 각 노드의 구체적인 크기 및 위치를 계산한다. 현재 렌더 트리에 담긴 정보로 우리는 어떤 노드가 페이지에 구현되어야 할지, 그리고 어떤 스타일을 따라야 할지 알 수 있다. 하지만 이것만으로는 각 노드가 페이지 어디에 구현될지, 얼마나 크게 구현될지 등을 알 수 없다.

이런 정보는 레이아웃 단계에서 도출된다. 레이아웃 단계는 리플로우(reflow)라고 부르기도 한다.

레이아웃 과정을 거치며 CSS 박스 모델을 토대로 각 노드의 크기 및 화면상 위치가 도출된다. 또한, rem이나 em 같은 상대 단위들도 레이아웃 과정에서 절대 단위값으로 변환된다.

레이아웃 과정은 뷰포트(viewport)의 크기를 기준으로 이뤄진다. 뷰포트의 크기는 HTML 문서의 viewport meta 태그에 지정된 값으로 결정되며, 해당 태그가 없는 경우 브라우저가 제공하는 기본 뷰포트 크기를 활용한다.

가시적으로 구현해야 할 노드의 수가 많을수록, 레이아웃 과정은 오래 걸린다. 브라우저 렌더링은 한 번만 일어나는 것이 아니라 렌더 트리가 변경될 때(노드 추가, 텍스트 변경 등), 뷰포트 크기 변화가 일어날 때(브라우저 크기 조정), 또는 HTML 요소의 위치나 크기가 변경될 때(width, height, position 등) 반복해서 일어난다.

### 페인트

브라우저는 생성된 렌더 트리와 레이아웃 단계에서 계산된 노드별 위치와 크기를 토대로 각 노드를 스크린의 픽셀로 변환한다. 이 단계는 **페인트**라고 부르며, 이름에서 알 수 있듯 브라우저가 최종 생성된 노드별 정보를 스크린에 그려 넣는 단계다.

페인트 단계에서 브라우저는 렌더 트리를 순회하며 모든 노드를 화면에 구현한다. 그 이후 다시 페인트 단계를 거쳐야 할 경우, 현대 브라우저는 최소한의 노드만을 업데이트하도록 최적화되어 있다. 따라서 페인트 단계를 다시 거칠 필요가 없는 노드는 제외하고 변경 사항이 있는 노드만 업데이트된다.

앞선 레이아웃과 페인트 단계는 웹 사이트가 렌더링 될 때마다 반복될 수 있다. 한 가지 유의할 점은, 레이아웃과 페인트 단계가 CSS 스타일의 복잡도와 구현해야 할 노드의 수에 따라 렌더링 성능에 큰 영향을 끼칠 수 있다는 것이다. 따라서 불필요하게 렌더링을 반복하는 것을 지양할 필요가 있다.

### 정리

브라우저가 HTML, CSS, JavaScript를 시각적으로 구현하는 과정을 Critical Rendering Path라 한다. 브라우저는 서버로부터 HTML 파일을 전달 받은 이후, DOM과 CSSOM 생성, 렌더 트리 생성, JavaScript 실행, 레이아웃 및 페인트 등 여러 단계를 거쳐 웹 사이트를 구현한다. 프론트엔드 개발자에게 Critical Rendering Path에 대한 이해가 중요한 이유는 바로 이 과정이 매끄럽고 효율적인 웹 사이트를 만드는 데 있어 중추적인 역할을 하기 때문이다. HTML, CSS, JavaScript가 어떻게 처리되는 지 이해하면 성능에 악영향을 끼치는 요인을 분석할 수 있고, 개발 초기부터 효율적인 웹 사이트를 만들 수 있다.

---

### Works Cited

- Aderinokun, Ire. “Understanding the Critical Rendering Path.” Bitsofcode, 17 Jan. 2017, [bitsofco.de/understanding-the-critical-rendering-path/](https://bitsofco.de/understanding-the-critical-rendering-path/).

- “Critical Rendering Path.” MDN, [developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path](https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path).

- Grigorik, Ilya. “Critical Rendering Path.” Web Fundamentals, Google, [developers.google.com/web/fundamentals/performance/critical-rendering-path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path).

- Kadlec, Tim. “When CSS Blocks.” When CSS Blocks - Web Performance Consulting | TimKadlec.com, 13 Feb. 2020, [timkadlec.com/remembers/2020-02-13-when-css-blocks/](https://timkadlec.com/remembers/2020-02-13-when-css-blocks/).

- Roberts, Harry. “CSS and Network Performance.” CSS Wizardry, 9 Nov. 2018, [csswizardry.com/2018/11/css-and-network-performance/](https://csswizardry.com/2018/11/css-and-network-performance/).

- 이웅모 . “브라우저의 렌더링 과정.” 모던 자바스크립트 Deep Dive, 위키북스.
