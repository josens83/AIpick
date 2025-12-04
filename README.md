# AIpick - AI 도구 추천 플랫폼

워크플로우에 맞는 최적의 AI 도구를 찾아주는 플랫폼입니다.

## 주요 기능

- **AI 기반 도구 추천**: 자연어로 작업을 설명하면 최적의 AI 도구를 추천
- **500+ AI 도구 데이터베이스**: 카테고리별 검색, 필터링, 정렬
- **도구 비교**: 최대 3개 도구를 나란히 비교
- **실시간 AI 뉴스**: 최신 AI 소식 및 업데이트
- **사용자 기능**: 즐겨찾기, 검색 히스토리, 맞춤 추천
- **프리미엄 구독**: Stripe 결제 연동

## 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: NextAuth.js (Google, GitHub OAuth)
- **Payments**: Stripe
- **Deployment**: Vercel

## 시작하기

### 사전 요구사항

- Node.js 18+
- PostgreSQL 데이터베이스 (Supabase 권장)
- Google/GitHub OAuth 앱 설정
- Stripe 계정

### 설치

```bash
# 저장소 클론
git clone https://github.com/josens83/AIpick.git
cd AIpick

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일 수정

# 데이터베이스 설정
npx prisma db push
npm run db:seed

# 개발 서버 실행
npm run dev
```

### 환경 변수

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_ID="..."
GITHUB_SECRET="..."

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_ENTERPRISE_PRICE_ID="price_..."
```

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── api/               # API Routes
│   ├── auth/              # 인증 페이지
│   ├── explore/           # 도구 탐색
│   ├── tool/[slug]/       # 도구 상세
│   ├── compare/           # 도구 비교
│   ├── news/              # AI 뉴스
│   ├── pricing/           # 가격 정책
│   └── ...
├── components/            # React 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   └── ...               # 기능별 컴포넌트
├── lib/                   # 유틸리티 및 설정
│   ├── auth.ts           # NextAuth 설정
│   ├── db.ts             # Prisma 클라이언트
│   ├── stripe.ts         # Stripe 설정
│   └── utils.ts          # 유틸리티 함수
└── types/                 # TypeScript 타입
```

## 배포

### Vercel 배포

1. Vercel에 프로젝트 연결
2. 환경 변수 설정
3. 자동 배포 활성화

```bash
vercel
```

### Stripe Webhook 설정

```bash
# 로컬 개발
stripe listen --forward-to localhost:3000/api/stripe/webhook

# 프로덕션
# Stripe 대시보드에서 Webhook 엔드포인트 추가
# URL: https://your-domain.com/api/stripe/webhook
```

## 라이선스

MIT License
