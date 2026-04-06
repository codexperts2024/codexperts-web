# codeXperts 클럽 웹사이트 - 프로젝트 지식 문서

## 팀 구성
- **Paul** – PM, UI/UX
- **Gary** – 데이터베이스 & Cloud Functions
- **Kai** – 프론트엔드, CSS
- **Dave** – 서버 아키텍처 & 배포
- **Andra** - 프론트엔드, CSS

---

## 기술 스택

| 영역 | 기술 | 비고 |
|---|---|---|
| 프론트엔드 | Next.js + React | Vercel 배포 |
| 백엔드 | FastAPI | Railway 배포 (무료 시작 → 필요시 $5/월) |
| 데이터베이스 | Supabase PostgreSQL | 무료 티어 |
| 인증 | Supabase Auth (Google SSO) | 구글만 |
| 코드 에디터 | Monaco Editor (`@monaco-editor/react`) | VSCode 기반 |
| 코드 실행 | Piston API | 무료, Python/Java/C++ 등 지원 |
| 호스팅 | Vercel (프론트) + Railway (백엔드) | |
| 도메인 | Vercel 무료 서브도메인 우선, 이후 Cloudflare 구매 (~$15 CAD/년) |

---

## 인증 & 권한

- **Google SSO 단독** (이메일 중복 방지 목적)
- 민감정보(비번 등) 저장 안 함 — 구글이 관리
- 구글에서 자동 수집: 이름, 이메일, 프로필사진
- 유저 직접 입력: 학교, LinkedIn URL, GitHub URL 회원가입시 만들게

### 권한 4단계 (Role)
| Role | 설명 |
|---|---|
| `member` | 일반 멤버 |
| `executive` | 운영진 |
| `admin` | 관리자 (role 변경 가능) |
| `pending` | 가입 후 승인 대기 |

---

## 데이터베이스 구조

```
profiles
- id
- email
- name
- avatar_url       ← 구글 자동
- school
- linkedin_url
- github_url
- cohort           ← 몇 기인지 (1, 2, 3...)
- role

problems
- id
- title
- description
- week
- due_date

submissions
- id
- user_id
- problem_id
- code
- language
- submitted_at

attendances
- id
- user_id
- session_id
- checked_at

sessions            ← QR 출석 세션
- id
- token
- created_at
- expires_at
- is_active
```

---

## 주요 기능

### 1. 코딩 문제 & 풀이 제출
- 매주 문제 게시 - 수동업로드
- Monaco Editor로 코드 작성 (VSCode 스타일)
- Piston API로 코드 실행 & 결과 확인
- 제출 저장 및 다른 멤버 풀이 공개

### 2. 잔디 심기 (GitHub 스타일)
- `submissions` + `attendances` 날짜 데이터 합산
- 제출 많이 하고 출석 많이 할수록 잔디 진해짐
- 멤버 프로필 페이지에 표시

### 3. QR 출석 체크
- QR 코드 한 장만 출력해서 교실에 고정
- 매주 모임 전 관리자가 앱에서 "세션 시작" 버튼 클릭 → 새 토큰 생성
- 멤버가 QR 스캔 → 현재 활성 세션으로 자동 출석 체크
- 세션 시간 제한 (예: 1시간) 또는 관리자가 수동 종료
- 중복 출석 방지 로직 포함

### 4. 멤버 디렉토리
- 프로필 카드: 사진, 이름, 학교, LinkedIn, GitHub
- 기수(cohort)별 필터

---

## 개발 단계 (MVP 우선)

1. **MVP** — 구글 로그인 + 멤버 프로필 + 문제 게시 + Monaco 에디터 + 코드 실행
2. **2단계** — 제출 저장, 풀이 공개, QR 출석
3. **3단계** — 잔디 시각화, 랭킹, 관리자 페이지

---

## 협업 툴
- GitHub Organization으로 레포 관리
- GitHub Issue로 Task 생성
- GitHub Projects로 태스크 분배
- Discord 개발 전용 채널 (이미만듬)
