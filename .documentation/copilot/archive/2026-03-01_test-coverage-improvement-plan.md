# Test Coverage Improvement Plan

## Current Status
- **Statements**: 71.25% ✅ (target: 70%)
- **Lines**: 72.69% ✅ (target: 70%)  
- **Branches**: 57.73% ❌ (target: 80% - gap: 22.27%)
- **Functions**: 46.34% ❌ (target: 80% - gap: 33.66%)

## Priority: Focus on Achievable Wins

### Phase 1: Utility Function Tests (Quick Wins - This Sprint)

**Target Files** (High impact, low complexity):

1. **`src/utils/imageUtils.ts`** (Currently ~5% coverage)
   - ✅ Small, well-defined functions
   - ✅ Pure functions = easy to test
   - Functions to test:
     - `getCacheBustingImageUrl()` - cache busting logic
     - `getImageMetadata()` - image metadata extraction
     - `clearImageCache()` - cache clearing (mock localStorage)

2. **`src/utils/version.ts`** (Currently untested)
   - ✅ Version comparison logic
   - ✅ No external dependencies
   - Functions to test:
     - `compareVersions()` - semantic version comparison
     - `checkForUpdates()` - update detection logic

3. **`src/models/Project.tsx`** (Currently 0% coverage)
   - ✅ Data transformation methods
   - ✅ Straightforward to test
   - Methods to test:
     - `getTitle()`, `getDescription()`, `getImageUrl()`
     - Static transformation methods

**Expected Impact**:
- Function coverage: 46% → ~60% (+14%)
- Branch coverage: 58% → ~65% (+7%)

---

### Phase 2: Edge Case Testing (This Sprint)

**Focus**: Add edge cases to existing well-tested services

1. **ErrorBoundary.test.tsx** (Currently 84%)
   - ✅ Already good coverage
   - Add tests for:
     - Custom fallback prop
     - Development vs production error display
     - Error info details

2. **Service Layer Edge Cases**
   - **ProjectService**: Test cache expiration edge cases
   - **JokeService**: Test API error responses, malformed data
   - **RssService**: Test XML parsing errors, empty feeds

**Expected Impact**:
- Branch coverage: ~65% → ~72% (+7%)

---

### Phase 3: Component Interaction Tests (Next Sprint - If Time)

**Target**: Simple component tests for coverage boost

1. **About.tsx** - Test article loading states
2. **Projects.tsx** - Test search/filter/sort interactions  
3. **Contact.tsx** - Test form validation

**Note**: Component tests are lower priority since service coverage is strong.

---

## Implementation Strategy

### Test File Structure
```typescript
// tests/unit/utils/imageUtils.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCacheBustingImageUrl, clearImageCache } from '@/utils/imageUtils';

describe('imageUtils', () => {
  describe('getCacheBustingImageUrl', () => {
    it('should append cache buster to image URL', () => {
      const url = getCacheBustingImageUrl('/img/test.png');
      expect(url).toMatch(/\/img\/test\.png\?v=\d+/);
    });

    it('should handle URLs with existing query params', () => {
      const url = getCacheBustingImageUrl('/img/test.png?size=large');
      expect(url).toMatch(/\?size=large&v=\d+/);
    });

    it('should handle absolute URLs', () => {
      const url = getCacheBustingImageUrl('https://example.com/img.png');
      expect(url).toContain('https://example.com/img.png?');
    });
  });

  describe('clearImageCache', () => {
    beforeEach(() => {
      localStorage.clear();
      vi.clearAllMocks();
    });

    it('should clear image cache from localStorage', () => {
      localStorage.setItem('imageCache', 'test');
      clearImageCache();
      expect(localStorage.getItem('imageCache')).toBeNull();
    });

    it('should warn in production mode', () => {
      const consoleSpy = vi.spyOn(console, 'warn');
      // Set production mode
      clearImageCache();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
```

---

## Realistic Timeline

### This Week (Achievable)
- ✅ Day 1: Create test files for `imageUtils.ts` (5-7 tests)
- ✅ Day 2: Create test files for `version.ts` (4-6 tests)
- ✅ Day 3: Create test files for `Project.tsx` model (6-8 tests)
- ✅ Day 4: Add edge cases to existing service tests (8-10 tests)
- ✅ Day 5: Run coverage, verify improvements

**Expected Outcome**: 
- Function coverage: 46% → 58-62%
- Branch coverage: 58% → 68-72%

### Next Week (If Time)
- Add simple component mount tests
- Test error boundaries with different scenarios
- Test custom hooks

**Expected Outcome**:
- Function coverage: 62% → 70%+
- Branch coverage: 72% → 76%+

---

## Note on 80% Target

**Reality Check**: Reaching 80% branch and function coverage for a React app with complex UI interactions is a **substantial undertaking**. 

**Recommendation**: 
1. Focus on **utility and model functions first** (high ROI)
2. Ensure **service layer edge cases** are covered (medium ROI)
3. Add **component tests gradually** (lower ROI, higher effort)

**Adjusted Target for This Sprint**:
- Function coverage: 46% → 60-65% ✅ (Realistic)
- Branch coverage: 58% → 70-75% ✅ (Realistic)

**Path to 80%** (if required):
- Would need ~30-40 additional tests
- Estimated 2-3 additional weeks
- Requires dedicated testing sprint

---

## Commands

```bash
# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test

# Run specific test file
npm run test imageUtils.test.ts

# View coverage report
Start-Process ./coverage/index.html
```

---

## Success Criteria

✅ **Minimum Acceptable**:
- Function coverage ≥ 60%
- Branch coverage ≥ 70%
- All utility functions tested
- All model methods tested

🎯 **Ideal** (if time permits):
- Function coverage ≥ 70%
- Branch coverage ≥ 75%
- Component mount tests added
- Edge case coverage complete

---

*This plan balances constitution compliance with realistic development timelines.*
