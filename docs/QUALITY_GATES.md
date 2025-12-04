# AIpick 품질 게이트 기준

## 코드 생성 시 필수 메타데이터

모든 기능 구현 시 다음 정보를 함께 제공해야 한다:

```typescript
interface CodeMetadata {
  purpose: string;           // 이 코드가 해결하려는 문제
  assumptions: string[];     // 전제 조건
  limitations: string[];     // 알려진 제한사항
  edgeCases: string[];       // 처리되지 않은 엣지 케이스
  securityConsiderations: string[];  // 고려한 보안 사항
  performanceNotes: string;  // 성능 관련 참고사항
  alternativeApproaches: string[];   // 대안
  testingStrategy: string;   // 권장 테스트 방법
  benchmarkReference?: string; // 벤치마킹 참고 서비스
}
```

---

## 1. 보안 체크리스트

### API 라우트 필수 검증
```markdown
□ 모든 입력에 Zod 스키마 검증 적용
□ SQL 인젝션 방지 (Prisma 파라미터화 쿼리 사용)
□ XSS 방지 (사용자 입력 이스케이프)
□ CSRF 토큰 검증 (상태 변경 API)
□ Rate Limiting 적용
□ 하드코딩된 비밀정보 없음
□ 민감한 정보 로깅 금지
```

### 인증/인가 검증
```markdown
□ 보호된 API에 세션 검증
□ 리소스 소유권 확인
□ 역할 기반 접근 제어 (해당 시)
□ 토큰 만료 처리
```

### 보안 헤더 설정
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; ..."
  }
];
```

---

## 2. 테스트 기준

### 커버리지 목표
| 테스트 유형 | 최소 | 목표 | 위험 영역 |
|------------|------|------|----------|
| 단위 테스트 | 60% | 80% | 유틸리티, 훅 |
| 통합 테스트 | 40% | 60% | API 라우트 |
| E2E 테스트 | - | 핵심 경로 100% | 결제, 인증 |

### 필수 테스트 케이스
```typescript
// 모든 함수/컴포넌트에 대해:
const requiredTests = {
  happyPath: "정상 동작 테스트",
  edgeCases: [
    "빈 입력",
    "null/undefined",
    "경계값",
    "최대 길이"
  ],
  errorCases: [
    "잘못된 입력 타입",
    "권한 없음",
    "네트워크 에러",
    "타임아웃"
  ],
  security: [
    "인젝션 시도",
    "권한 우회 시도"
  ]
};
```

---

## 3. 성능 기준

### Core Web Vitals
| 지표 | 좋음 | 개선 필요 | 나쁨 |
|------|------|----------|------|
| LCP | < 2.5s | 2.5-4s | > 4s |
| FID | < 100ms | 100-300ms | > 300ms |
| CLS | < 0.1 | 0.1-0.25 | > 0.25 |

### 추가 성능 기준
```yaml
lighthouse_scores:
  performance: ">= 90"
  accessibility: ">= 90"
  best_practices: ">= 90"
  seo: ">= 90"

bundle_size:
  initial_js: "< 150KB gzip"
  total_js: "< 400KB gzip"

api_response:
  p50: "< 100ms"
  p95: "< 500ms"
  p99: "< 1000ms"
```

---

## 4. 코드 품질 기준

### 복잡도 제한
```yaml
complexity:
  cyclomatic_per_function: "<= 10"
  cognitive_per_function: "<= 15"
  max_function_length: "50 lines"
  max_file_length: "300 lines"
  max_params: "4"
```

### 중복 제한
```yaml
duplication:
  max_percentage: "< 5%"
  min_tokens_for_duplicate: "100"
```

### 명명 규칙
```markdown
□ 컴포넌트: PascalCase
□ 훅: useCamelCase
□ 유틸리티: camelCase
□ 상수: UPPER_SNAKE_CASE
□ 타입/인터페이스: PascalCase
□ 파일명: kebab-case (컴포넌트 제외)
```

---

## 5. 문서화 기준

### 필수 문서
```markdown
□ README.md (프로젝트 개요, 설치, 실행)
□ API 문서 (OpenAPI/Swagger)
□ 컴포넌트 문서 (Storybook 또는 마크다운)
□ 환경 변수 문서 (.env.example)
□ 배포 가이드
```

### 코드 내 문서화
```typescript
/**
 * 도구 검색 API
 *
 * @description 키워드, 카테고리, 가격 필터로 도구를 검색합니다.
 *
 * @param query - 검색어 (최소 2자)
 * @param filters - 필터 옵션
 * @returns 검색 결과 및 페이지네이션 정보
 *
 * @example
 * ```typescript
 * const results = await searchTools({
 *   query: "이미지 생성",
 *   filters: { category: "image", pricing: "free" }
 * });
 * ```
 *
 * @throws {ValidationError} 검색어가 너무 짧은 경우
 * @throws {DatabaseError} DB 연결 실패 시
 *
 * @benchmark Algolia 검색 패턴 참고
 * @performance O(n) - 전체 도구 수에 비례
 */
```

---

## 6. 접근성 기준

### WCAG 2.1 AA 필수 항목
```markdown
□ 키보드만으로 모든 기능 사용 가능
□ 포커스 표시 명확
□ 색상 대비 4.5:1 이상 (일반 텍스트)
□ 색상 대비 3:1 이상 (큰 텍스트, UI)
□ 모든 이미지에 alt 텍스트
□ 폼 요소에 레이블
□ 에러 메시지 명확
□ 건너뛰기 링크 제공
```

---

## 7. Git 커밋 기준

### 커밋 메시지 형식
```
type(scope): subject

body (optional)

footer (optional)
```

### Type 종류
```markdown
feat: 새로운 기능
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅 (기능 변경 없음)
refactor: 리팩토링
test: 테스트 추가/수정
chore: 빌드, 설정 변경
perf: 성능 개선
security: 보안 관련 변경
```

### 커밋 전 체크리스트
```markdown
□ 린터 통과
□ 타입 체크 통과
□ 테스트 통과
□ 보안 검사 통과
□ 커밋 메시지 컨벤션 준수
```

---

## 8. PR 리뷰 기준

### 필수 확인 사항
```markdown
□ 요구사항 충족 여부
□ 테스트 포함 여부
□ 문서화 여부
□ 보안 고려사항
□ 성능 영향
□ 하위 호환성
□ 롤백 가능성
```

### AI 생성 코드 추가 확인
```markdown
□ 컨텍스트 적합성 (기존 아키텍처와 일치)
□ 에러 처리 완전성
□ 엣지 케이스 처리
□ 보안 취약점 없음
□ 중복 코드 없음
□ 테스트 가능성
```

---

## 자가 검증 체크리스트

코드 제출 전 스스로에게 물어봐야 할 질문:

```markdown
□ 이 코드는 6개월 후 다른 개발자가 이해할 수 있는가?
□ 엣지 케이스와 에러 상황이 적절히 처리되는가?
□ 기존 코드베이스의 패턴과 일관성이 있는가?
□ 보안 취약점은 없는가?
□ 성능 병목이 될 가능성은 없는가?
□ 테스트가 충분히 작성되었는가?
□ 더 간단한 해결책은 없는가?
□ 이 코드가 프로덕션에서 실패한다면 어떻게 디버깅할 것인가?
□ 벤치마킹한 서비스의 패턴을 적절히 적용했는가?
```
