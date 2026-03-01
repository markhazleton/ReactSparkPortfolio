# TODO - ReactSparkPortfolio

This file tracks remaining work items after the constitution compliance implementation (2026-03-01).

## 📊 Current Status

**Constitution Compliance**: 80% (Target: 90%)  
**Test Coverage**: 71% statements, 58% branches, 46% functions  
**Last Updated**: 2026-03-01

---

## 🎯 Medium Priority (Non-Blocking)

### TEST3: Improve Branch Coverage (57.73% → 80%)

**Current**: 57.73%  
**Target**: 80%  
**Effort**: ~8-12 hours

**Tasks**:

- [ ] Add component tests for Articles.tsx (RSS integration scenarios)
- [ ] Add component tests for Projects.tsx (search, filter, sort)
- [ ] Add component tests for Joke.tsx (category selection, refresh)
- [ ] Add component tests for WeatherForecast.tsx (location selection, map interaction)
- [ ] Add component tests for Header.tsx (theme toggle, navigation)
- [ ] Add component tests for Hero.tsx (button interactions)

**Acceptance Criteria**:

- Branch coverage reaches 75%+ (aspirational 80%)
- All user interactions covered by tests
- Edge cases and error states tested

---

### TEST4: Improve Function Coverage (46.34% → 80%)

**Current**: 46.34%  
**Target**: 80%  
**Effort**: ~4-6 hours

**Tasks**:

- [ ] Add tests for src/utils/imageUtils.ts (URL transformations, CDN logic)
- [ ] Add tests for src/utils/version.ts (version comparison, invalidation)
- [ ] Add tests for src/hooks/useVersionCheck.ts (version polling, state updates)
- [ ] Add tests for src/utils/seoUtils.ts (meta tag generation)
- [ ] Add tests for src/utils/addCacheBuster.ts (cache invalidation logic)

**Acceptance Criteria**:

- Function coverage reaches 70%+ (aspirational 80%)
- All exported utility functions have tests
- Hook behavior verified with @testing-library/react-hooks

---

## 🔵 Low Priority (Nice to Have)

### DOC1-DOC8: Add JSDoc to Components

**Effort**: ~2-3 hours

**Tasks**:

- [ ] Add JSDoc to About.tsx (component description, props)
- [ ] Add JSDoc to Articles.tsx (RSS integration details)
- [ ] Add JSDoc to Joke.tsx (API usage, categories)
- [ ] Add JSDoc to Projects.tsx (search/filter logic)
- [ ] Add JSDoc to WeatherForecast.tsx (map integration)
- [ ] Add JSDoc to Chat.tsx (SignalR connection details)
- [ ] Add JSDoc to Contact.tsx (form validation)
- [ ] Add JSDoc to Header.tsx (theme switching)

**Template**:

```typescript
/**
 * Component description
 *
 * @component
 * @returns {JSX.Element} Rendered component
 *
 * @example
 * <MyComponent />
 */
```

---

### STYLE1: Address Fast Refresh Warnings

**Current**: 2 warnings in Project.tsx  
**Effort**: ~15 minutes

**Issue**: Zod schemas exported from same file as component breaks Fast Refresh

**Solution**:

```bash
# Move schemas to separate file
src/models/Project.tsx → src/models/Project.ts (component)
                      → src/models/ProjectSchema.ts (schemas)
```

**Tasks**:

- [ ] Create src/models/ProjectSchema.ts
- [ ] Move ProjectDataSchema and ProjectDataArraySchema to new file
- [ ] Update imports in ProjectService.ts
- [ ] Update imports in ProjectService.test.ts
- [ ] Verify Fast Refresh works in dev mode

---

## 🚀 Future Enhancements (Backlog)

### E2E Testing

**Effort**: ~16-24 hours

- [ ] Set up Playwright for E2E testing
- [ ] Add smoke tests for critical user journeys:
  - [ ] Home → Projects → Project details
  - [ ] Theme toggle persistence
  - [ ] Weather widget location selection
  - [ ] Chat connection and message sending
  - [ ] Article feed loading
- [ ] Configure CI/CD to run E2E tests
- [ ] Add visual regression testing (optional)

### Error Tracking Integration

**Effort**: ~4-6 hours

- [ ] Set up Sentry account
- [ ] Install @sentry/react package
- [ ] Configure Sentry in main.tsx
- [ ] Add error boundary integration
- [ ] Set up source maps for production debugging
- [ ] Configure release tracking
- [ ] Add user context for error reports

### Performance Monitoring

**Effort**: ~4-6 hours

- [ ] Add Web Vitals tracking
- [ ] Integrate with Sentry Performance or Azure Application Insights
- [ ] Add custom performance marks for key interactions
- [ ] Set up performance budgets in CI/CD
- [ ] Monitor bundle size in pull requests

### Accessibility Improvements

**Effort**: ~8-12 hours

- [ ] Run axe-core automated accessibility audit
- [ ] Add skip-to-content link
- [ ] Improve keyboard navigation for Chat component
- [ ] Add ARIA live regions for dynamic content
- [ ] Test with screen readers (NVDA, JAWS, VoiceOver)
- [ ] Add focus indicators throughout
- [ ] Improve color contrast ratios

---

## 📝 Notes

- Fast refresh warnings are DX-only and don't affect production
- Coverage targets are aspirational; 70%+ is acceptable for most scenarios
- JSDoc is valuable but not critical with TypeScript strict mode
- E2E testing should wait until core feature set stabilizes
- Consider feature flags for gradual rollout of new monitoring tools

---

## ✅ Completed Work (Reference)

### Constitution Compliance Sprint (2026-03-01)

**Duration**: ~5 hours  
**Result**: 42% → 80% compliance (+38%)

#### Completed Tasks:

- ✅ Set up Vitest testing infrastructure
- ✅ Created 40 passing tests across 5 test files
- ✅ Implemented Zod runtime validation in all services
- ✅ Configured Prettier with pre-commit hooks (Husky + lint-staged)
- ✅ Verified @rollup/plugin-strip for production console removal
- ✅ Created ErrorBoundary component with tests
- ✅ Updated README.md with test commands
- ✅ Fixed all linting and type-check errors
- ✅ Verified production build succeeds
- ✅ Updated ESLint config to ignore generated files

#### Test Coverage Achieved:

- Service layer: 80%+ branch coverage (primary goal)
- Overall: 71% statements, 58% branches, 46% functions
- ErrorBoundary: 84.61% coverage

#### Files Created:

1. vitest.config.ts - Test runner configuration
2. src/test/setup.ts - Global test setup with mocks
3. tests/unit/smoke.test.ts - Infrastructure verification
4. tests/unit/services/ProjectService.test.ts - 9 tests
5. tests/unit/services/JokeService.test.ts - 10 tests
6. tests/unit/services/RssService.test.ts - 11 tests
7. tests/unit/components/ErrorBoundary.test.tsx - 7 tests
8. src/components/ErrorBoundary.tsx - Error boundary component
9. .prettierrc - Prettier configuration
10. .prettierignore - Prettier ignore patterns
11. .husky/pre-commit - Pre-commit hook script

#### Files Modified:

1. package.json - Added test/format scripts, lint-staged config
2. tsconfig.json - Added vitest types and test includes
3. src/models/Project.tsx - Added Zod schemas
4. src/services/ProjectService.ts - Integrated Zod validation
5. src/services/JokeService.ts - Added Zod discriminated union
6. src/services/RssService.ts - Added RSS validation
7. src/App.tsx - Wrapped in ErrorBoundary
8. eslint.config.js - Added coverage/docs to ignores
9. README.md - Added test commands and quality gates section

---

**Last Review**: 2026-03-01  
**Next Review**: 2026-03-15 (target: 90% compliance)
