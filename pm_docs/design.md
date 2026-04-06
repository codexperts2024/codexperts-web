# codeXperts — Design System

> 와이어프레임 & 개발 참고용. Kai / 전체 팀 공유.

---

## 1. 핵심 원칙

- **다크 고정** — 라이트모드 토글 없음. VS Code 감성 일관성 유지
- **미니멀** — Vercel / Linear 스타일. 정보 밀도보다 여백 우선
- **코딩 클럽 정체성** — 에디터, 터미널, 코드 감성을 UI에 자연스럽게 녹임
- **액센트는 하나** — `#C0392B` 레드만 CTA/강조로 사용. 남발 금지

---

## 2. 색상 토큰

### 🔴 메인 액센트 — `#C0392B`

```
--color-accent:        #C0392B   ← 버튼, X 로고, 활성 탭, 강조 텍스트, border highlight
--color-accent-light:  #E87A6E   ← hover 상태, 태그 텍스트 (다크 배경 위)
--color-accent-bg:     #2D1B1B   ← 태그/배지 배경 (accent 계열 연한 배경)
```

> ⚠️ 액센트는 반드시 **행동 유도(CTA)** 또는 **브랜드 강조**에만 사용.
> 일반 텍스트, 아이콘, 구분선에는 절대 사용하지 않음.

---

### 배경 레이어

```
--color-bg-base:       #1E1E1E   ← 페이지 전체 배경 (VS Code 기본)
--color-bg-surface:    #252526   ← 카드, 사이드바, 네비게이션
--color-bg-elevated:   #2D2D2D   ← 탭바, 헤더, 드롭다운, 모달
--color-bg-input:      #3C3C3C   ← 인풋 필드, 텍스트에리어
```

### 텍스트

```
--color-text-primary:  #D4D4D4   ← 본문, 라벨 (VS Code 기본 텍스트)
--color-text-secondary:#888888   ← 부제목, 메타 정보, placeholder
--color-text-hint:     #555555   ← 라인 넘버, 비활성 메뉴
```

### 테두리

```
--color-border:        #333333   ← 기본 구분선
--color-border-strong: #444444   ← 카드 테두리, 인풋 포커스
```

### 시맨틱 (기능별)

```
--color-success:       #4EC9B0   ← 출석 완료, 제출 성공, 잔디 색상 (터미널 OK 색)
--color-link:          #4FC1FF   ← 링크, 인터랙티브 요소 (VS Code variable 색)
--color-string:        #CE9178   ← 언어 태그, 배지 (VS Code string 색)
--color-comment:       #6A9955   ← 힌트 텍스트, 보조 정보 (VS Code comment 색)
--color-warning:       #DCDCAA   ← 경고, due soon 표시 (VS Code function 색)
```

---

## 3. 타이포그래피

| 용도 | 폰트 | 굵기 | 크기 |
|---|---|---|---|
| 로고 / 네비 브랜드 | Montserrat | 700 | 가변 |
| 헤딩 (H1–H3) | Montserrat | 600–700 | 32 / 24 / 18px |
| 본문 | Inter | 400 | 16px |
| 라벨 / 메타 | Inter | 400 | 13–14px |
| 코드 / 에디터 | JetBrains Mono | 400 | 14px |
| 터미널 / hex 값 | JetBrains Mono | 400 | 12px |

> 줄간격(line-height): 본문 1.7 / 헤딩 1.2 / 코드 1.6

---

## 4. 컴포넌트 스펙

### 버튼

```
Primary (CTA)
  background: #C0392B
  color: #FFFFFF
  border-radius: 6px
  padding: 8px 20px
  font: Inter 500 14px
  hover: background #A93226 (10% 어둡게)

Secondary (Outline)
  background: transparent
  color: #888888
  border: 0.5px solid #444444
  hover: border-color #888, color #D4D4D4
```

### 카드

```
background: #252526
border: 0.5px solid #333333
border-radius: 8px
padding: 16px 20px
```

### 인풋

```
background: #3C3C3C
border: 0.5px solid #444444
border-radius: 6px
padding: 8px 12px
color: #D4D4D4
font: Inter 14px
focus → border-color: #C0392B
```

### 태그 / 배지

```
언어 태그 (Python, Java 등)
  background: #2D1B1B
  color: #E87A6E
  font-size: 11px
  padding: 2px 8px
  border-radius: 4px

역할 배지 (admin, executive)
  background: #1B2D2B
  color: #4EC9B0
  동일 스펙
```

### 네비게이션

```
background: #252526
border-bottom: 0.5px solid #333
활성 탭: color #C0392B, border-top 2px solid #C0392B
비활성: color #888
```

---

## 5. 페이지별 레이아웃 메모 (와이어프레임용)

### `/` 홈

```
[Navbar] CODEXPERTS  |  Home · Members · Problems · Attendance  |  [Login]

[Hero]
  큰 헤딩: "Code. Learn. Grow."
  서브: "매주 코딩 문제를 풀고, 출석하고, 성장하는 공간"
  CTA: [Get started →]  [View problems]

[이번 주 문제 카드]
  제목, 언어 태그, 마감일

[멤버 활동 스냅샷 - 로그인 시]
  잔디 그래프 미리보기
```

### `/problems` 문제 목록

```
[헤더] 이번 주 문제 / 지난 문제
[카드 리스트]
  - 제목
  - 언어 태그, 난이도 태그
  - 제출 여부 (✓ 초록 / 미제출 회색)
  - 마감일
[카드 클릭 → /problems/:id]
```

### `/problems/:id` 문제 상세

```
[좌] 문제 설명 (마크다운 렌더링)
[우] Monaco Editor
     언어 선택 드롭다운
     [Run] [Submit] 버튼 (#C0392B)
[하단] 실행 결과 (터미널 스타일, #1E1E1E 배경)
```

### `/members` 멤버 디렉토리

```
[필터] 기수(cohort) 선택
[그리드] 프로필 카드
  - 아바타 (구글 프로필)
  - 이름, 학교
  - GitHub, LinkedIn 아이콘
  - 잔디 미니 그래프
```

### `/profile/:id` 프로필

```
[상단] 아바타, 이름, 역할 배지, 기수
[중단] 잔디 그래프 (GitHub 스타일, --color-success 계열)
[하단] 제출 목록, 출석 기록
```

### `/admin` 관리자 (admin 전용)

```
[세션 시작] → QR 토큰 생성 버튼 (#C0392B)
[멤버 목록] 역할 변경 드롭다운
[pending 승인] 대기 멤버 리스트
```

---

## 6. 간격 & 반응형

```
기본 간격 단위: 4px 배수 (8, 12, 16, 24, 32, 48)
최대 컨텐츠 너비: 1200px (max-width)
모바일 브레이크포인트: 768px
카드 그리드: repeat(auto-fit, minmax(280px, 1fr))
```

---

## 7. Monaco 에디터 설정

```javascript
theme: "vs-dark"          // 배경 #1E1E1E — 페이지와 완벽 일치
fontFamily: "JetBrains Mono"
fontSize: 14
lineHeight: 1.6
minimap: { enabled: false }  // 미니맵 끔 (모바일 대응)
```

---

## 8. 잔디 그래프 색상 스케일

```
0회  → #2D2D2D  (비어있음)
1–2회 → #1B3A2E
3–4회 → #1D6B4A
5–6회 → #2A9D6F
7회+  → #4EC9B0  (--color-success 풀 강도)
```

submissions + attendances 날짜 합산으로 계산.

---

_최종 업데이트: 2026-04-04 | 담당: Paul_
