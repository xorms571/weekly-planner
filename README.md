# 🗓️ Weekly Planner App

웹 링크: https://weekly-planner-two-rho.vercel.app/

주간 일정과 할 일을 손쉽게 관리할 수 있는 Next.js 기반 플래너 웹앱입니다.  
TailwindCSS와 shadcn/ui를 활용해 깔끔하고 커스터마이징 가능한 UI를 제공합니다.

## 📦 기술 스택

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Styling**: Tailwind Merge, tailwindcss-animate, clsx, class-variance-authority
- **UI Library**: **shadcn/ui**, Radix UI, lucide-react
- **Auth**: bcrypt, jsonwebtoken, cookie
- **Database**: MongoDB

## 🛠 프로젝트 개발 중 겪은 이슈 및 해결 과정

### 🎨 디자인 관련

#### 문제점
- 초기 개발 단계에서는 기본 템플릿을 참고하여 구현함.
- 기능 구현과 기술 습득에 집중한 나머지 디자인 요소에 많은 신경을 쓰지 못함.
- 그 결과, 전체적인 UI/UX가 미흡하고 시각적으로 완성도가 떨어지는 문제가 발생함.

#### 해결 방법
- **UI 라이브러리(shadcn/ui, Radix UI, lucide-react 등)**를 도입하여 기본적인 디자인 요소를 갖추도록 개선함.
- 스타일링에 많은 시간을 들이지 않고도 일정 수준 이상의 시각적 완성도를 확보할 수 있었음.
- 이를 통해 사용자에게 보다 보기 좋은 화면을 제공할 수 있었고, 기술 구현에 집중할 수 있는 환경을 유지함.

### 🔐 사용자 인증 관련

#### 문제점
- 본 프로젝트는 기술 학습 목적의 미니 프로젝트로, 초기에는 사용자 인증 기능이 없었음.
- 개발 도중 로그인/회원가입 기능이 추가되며 인증 로직 설계 및 구현에 어려움을 겪음.
- 초기에는 **토큰을 로컬스토리지에 저장**하는 방식을 사용함.  
  - 장점: 구현이 간단하고 빠르게 테스트 가능  
  - 단점: 보안 취약 (XSS 공격 등)
- 이후 보안을 고려하여 **쿠키를 통한 토큰 저장 방식**으로 전환하려 했으나,  
  - 쿠키 설정 (`httpOnly`, `secure`)  
  - 요청 시 쿠키 자동 전송 (`withCredentials`)  
  - CORS 설정 등에서 여러 시행착오를 겪음.

#### 해결 방법
- 교육 과정에서 학습한 내용을 기반으로 인증 흐름 전반을 리팩토링함.
- 로그인, 회원가입, 로그아웃 기능을 RESTful하게 구성하고, 프론트엔드와 백엔드 간의 인증 흐름을 명확히 함.
- **쿠키 기반 인증 방식** 구현 시에는:
  - 관련 블로그 자료 및 공식 문서를 참고하고,
  - 팀 프로젝트에서 팀원이 실제 적용했던 방식들을 참고하여 실용적인 구조를 도입함.
- 결과적으로, 보다 안전하고 유지보수 가능한 인증 구조를 구축할 수 있었음.
