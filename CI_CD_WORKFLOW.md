# CI/CD Workflow Guide

This document outlines the continuous integration and deployment workflow for the Disney Plus Clone portfolio project.

## Table of Contents

- [Overview](#overview)
- [CI Pipeline](#ci-pipeline)
- [CodeRabbit's Role](#coderabbit-role)
- [Branch Protection](#branch-protection)
- [Development Workflow](#development-workflow)
- [Standard Operating Procedures](#standard-operating-procedures)
- [Why This Approach](#why-this-approach)
- [Common Scenarios](#common-scenarios)
- [Quick Reference](#quick-reference)

---

## Overview

This project uses **Git Flow** with automated CI/CD to ensure code quality while maintaining fast development velocity. The workflow is designed to demonstrate professional development practices for portfolio purposes.

### Key Principles

1. ✅ **Tests must pass** before merging
2. ✅ **Fast iteration** - don't block on informational checks
3. ✅ **Quality through automation** - CI catches issues
4. 💬 **AI as assistant** - CodeRabbit informs, doesn't block
5. 🚀 **Small, focused commits** - easier to review and revert

---

## CI Pipeline

### What Runs Automatically

When you push code or create a PR to `develop` or `main`, GitHub Actions automatically runs:

```yaml
CI Pipeline (Required):
├── 1. Install dependencies (npm ci)
├── 2. Run linter (npm run lint:frontend)
├── 3. Run tests (npm run test:frontend)
└── 4. Build (npm run build:frontend)
```

**Duration**: ~1 minute
**Location**: `.github/workflows/ci.yml`

### Status Check Types

#### ✅ Required Checks (Block Merge)

These **must pass** before you can merge:

- **Frontend Tests** - All 27 tests passing
- **Linter** - Code style consistent
- **Build** - TypeScript compiles, no errors
- **Type Checking** - All types valid

#### 💬 Informational Checks (Don't Block)

These provide feedback but **don't prevent merging**:

- **CodeRabbit** - AI code review suggestions
- **Code Coverage** (future) - Shows test coverage %
- **Performance Metrics** (future) - Bundle size, etc.

---

## CodeRabbit's Role

### ❌ NOT Recommended: CodeRabbit as Required Check

**Why not:**

- CodeRabbit is **advisory/informational** - it's an AI assistant, not a quality gate
- Can have delays or get stuck (5-30+ minutes)
- Sometimes gives opinionated suggestions that may not fit your context
- Blocks merges for non-critical feedback
- Doesn't match real-world enterprise workflows

**Problems this creates:**

```
1. Push code → CI runs (1 min) ✅
2. Wait for CodeRabbit... ⏳ (5-30 min)
3. CodeRabbit suggests minor change 💬
4. Fix and push → CI + CodeRabbit again ⏳
5. Repeat until both pass...
6. Finally merge ✅ (hours later)
```

### ✅ Recommended: CodeRabbit as Informational Reviewer

**Better approach:**

- CodeRabbit **comments** on PRs but doesn't block
- You review its suggestions **after merge**
- Decide what's worth addressing based on value
- Create follow-up PRs for improvements

**How this works:**

```
1. Push code → CI runs (1 min) ✅
2. Merge when CI passes ✅
3. CodeRabbit comments later 💬 (async)
4. Review suggestions at your convenience
5. Create follow-up PR if valuable
6. Or note for future / ignore if not helpful
```

### Evaluating CodeRabbit Feedback

When CodeRabbit provides suggestions, categorize them:

| Category | Action | Example |
|----------|--------|---------|
| **Critical** | Fix immediately in new PR | Security vulnerabilities, breaking bugs |
| **Good suggestions** | Fix soon in follow-up PR | Performance improvements, better patterns |
| **Minor/opinionated** | Consider for future | Naming preferences, style choices |
| **Won't fix** | Acknowledge and document | Suggestions that don't fit your context |

---

## Branch Protection

### Recommended Setup

Configure branch protection for `main` (and optionally `develop`):

**Navigate to**: `Settings` → `Branches` → `Add classic branch protection rule`

#### Configuration

```yaml
Branch name pattern: main

✅ Require a pull request before merging
   ✅ Require approvals: 0 (for solo projects)

✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging

   Required status checks:
   ✅ Frontend Tests

   NOT required:
   ❌ CodeRabbit (leave unchecked)

✅ Do not allow bypassing the above settings

❌ Require signed commits (optional for portfolio)
❌ Require linear history (optional)
❌ Require deployments to succeed (not applicable)
```

#### Why These Settings

- **Require PR**: Prevents direct pushes to main, forces review workflow
- **Status checks**: Ensures tests/lint/build pass before merge
- **Up to date**: Prevents merge conflicts
- **No CodeRabbit requirement**: Keeps velocity high
- **No bypass**: Enforces rules even for repo owner (good practice)

---

## Development Workflow

### Step-by-Step Process

#### 1. Start New Feature

```bash
# Ensure you're on develop and up to date
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name
```

#### 2. Develop with Tests

Write your code following TDD (Test-Driven Development):

1. **Write test** first (or alongside feature)
2. **Implement** feature
3. **Run tests** locally: `npm run test:frontend`
4. **Run lint** locally: `npm run lint:frontend`
5. **Verify build**: `npm run build:frontend`

**All must pass before committing!**

#### 3. Commit Changes

```bash
# Add your changes
git add .

# Commit with conventional format
git commit -m "feat: your feature description"

# Or for bug fixes
git commit -m "fix: bug description"
```

**Conventional Commit Prefixes:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style (formatting, no logic change)
- `refactor:` - Code restructuring (no behavior change)
- `test:` - Adding/updating tests
- `chore:` - Maintenance (deps, config, etc.)

#### 4. Push and Create PR

```bash
# Push feature branch
git push origin feature/your-feature-name

# Create PR to develop
gh pr create --base develop \
  --title "Feature: Your feature title" \
  --body "Description of what this PR does"
```

#### 5. Wait for CI (Required)

**CI will automatically run:**

```
⏳ Installing dependencies...
⏳ Running linter...
⏳ Running tests...
⏳ Building application...
```

**Expected duration**: ~1 minute

#### 6. CI Passes - Merge! ✅

When you see all green checkmarks:

```
✅ Frontend Tests - SUCCESS
✅ Linter - PASSED
✅ Build - SUCCEEDED
```

**You can merge immediately!**

Don't wait for:
- ⏳ CodeRabbit (might take 5-30+ minutes)
- 📊 Other informational checks

#### 7. Review CodeRabbit (After Merge)

CodeRabbit will comment on your PR eventually:

**When it does:**

1. **Read suggestions** thoughtfully
2. **Categorize** (critical/good/minor/won't-fix)
3. **Create follow-up PR** for valuable changes
4. **Document** reasons for ignoring suggestions

**Example follow-up PR:**

```bash
git checkout develop
git pull origin develop
git checkout -b fix/coderabbit-suggestions

# Make improvements suggested by CodeRabbit
# ... edit files ...

git add .
git commit -m "refactor: apply CodeRabbit suggestions for performance"
git push origin fix/coderabbit-suggestions
gh pr create --base develop
```

---

## Standard Operating Procedures

### SOP 1: Merging PRs

**Question**: When can I merge my PR?

**Answer**: When **all required checks pass** (tests, lint, build)

**Don't wait for:**
- CodeRabbit comments
- Optional/informational checks
- Perfect code (iterate!)

**Process:**

```
1. ✅ CI passes → Merge immediately
2. 💬 CodeRabbit comments later → Review async
3. 🔧 Create follow-up PR if needed
4. 🚀 Keep moving forward
```

### SOP 2: Handling CodeRabbit Feedback

**Question**: CodeRabbit suggested changes after I merged. What do I do?

**Answer**: Create a follow-up PR for valuable suggestions

**Process:**

```
1. Read all CodeRabbit comments
2. Categorize by importance:
   - Critical → Fix ASAP
   - Good → Fix soon
   - Minor → Consider
   - Won't-fix → Document why

3. For critical/good suggestions:
   - Create new branch from develop
   - Implement changes
   - Create new PR
   - Merge when CI passes

4. For minor/won't-fix:
   - Reply to CodeRabbit comment explaining decision
   - Or simply ignore if not applicable
```

### SOP 3: CI Failures

**Question**: My CI is failing. What should I do?

**Answer**: Fix the issue before merging (never bypass)

**Process:**

```
1. Click on failed check to see details
2. Identify the error:
   - Test failure → Fix test or code
   - Lint error → Run `npm run lint:frontend -- --fix`
   - Build error → Fix TypeScript errors
   - Dependency issue → Run `npm ci` locally

3. Fix the issue locally
4. Verify fix: npm run test:frontend
5. Commit fix
6. Push again
7. CI will re-run automatically
```

### SOP 4: Stuck CodeRabbit Check

**Question**: CodeRabbit is "pending" for a long time. Can I merge?

**Answer**: YES! If CodeRabbit is not a required check.

**Check if it's required:**

1. Go to `Settings` → `Branches`
2. Check if there are protection rules for `main`
3. If "Required status checks" includes CodeRabbit → it's required
4. If no protection rules or CodeRabbit not listed → it's optional

**If optional (recommended):**
- ✅ Merge when CI passes
- 💬 CodeRabbit will comment eventually or timeout
- Either way, you're not blocked

**If required (not recommended):**
- Remove it from required checks (see [Branch Protection](#branch-protection))
- Then merge

### SOP 5: Breaking Changes on Main

**Question**: I merged something that broke main. What do I do?

**Answer**: Revert the merge immediately, then fix in new PR

**Process:**

```bash
# Revert the problematic merge
git checkout main
git pull origin main
git revert -m 1 <merge-commit-hash>
git push origin main

# Fix the issue in a new branch
git checkout develop
git checkout -b fix/critical-bug
# ... fix the issue ...
git add .
git commit -m "fix: resolve issue from previous PR"
git push origin fix/critical-bug

# Create PR and merge when CI passes
gh pr create --base develop
```

**Prevention:**
- Always run full CI locally before pushing
- Don't skip tests
- Review your own PRs before merging

---

## Why This Approach

### Benefits for Your Portfolio

#### 1. Demonstrates Professional Practices

**What employers see:**

✅ **Fast iteration cycles**
Shows you can ship quickly without sacrificing quality

✅ **Small, focused commits**
Easier to review, revert, and understand

✅ **Continuous integration**
Automated testing catches issues before production

✅ **Quality through automation**
Relies on tests, not just reviews

✅ **Pragmatic decision-making**
Uses AI as tool, not crutch

#### 2. Shows Technical Understanding

**You demonstrate knowledge of:**

- Git Flow branching strategy
- CI/CD pipeline configuration
- Branch protection rules
- Test-driven development
- Conventional commits
- Code review best practices

#### 3. Real-World Experience

**This matches workflows at:**

- Google (uses similar async review process)
- Amazon (automated gates + post-merge reviews)
- Meta (fast CI, optional additional checks)
- Startups (move fast, iterate)

**Not using CodeRabbit as a gate shows you understand:**

- When to use AI assistance (informational)
- When to enforce quality (automated tests)
- How to balance speed with quality

### What This Avoids

❌ **Slow development** (waiting for AI reviews)
❌ **False sense of quality** (AI approval doesn't mean code is perfect)
❌ **Analysis paralysis** (overthinking minor suggestions)
❌ **Blocked progress** (can't ship until AI responds)

### Industry Perspective

**Quote from Google's Engineering Practices:**

> "The primary purpose of code review is to make sure that the overall code health of Google's code base is improving over time... If a reviewer makes it very difficult for any change to go in, then developers are disincentivized to make improvements in the future."

**Translation for your workflow:**

- Tests ensure code works (automated gate)
- Reviews improve code over time (async feedback)
- Don't block progress on perfection

---

## Common Scenarios

### Scenario 1: First PR of the Day

**Situation**: Starting fresh, creating a new feature

**Process:**

```bash
# 1. Start from latest develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/add-movie-cards

# 3. Develop + test
# ... write code and tests ...
npm run test:frontend  # Verify locally

# 4. Commit and push
git add .
git commit -m "feat: add movie card component with hover effects"
git push origin feature/add-movie-cards

# 5. Create PR
gh pr create --base develop

# 6. Wait for CI (~1 min)
# 7. Merge when green ✅
# 8. Check CodeRabbit later 💬
```

**Timeline**: 1-2 minutes from push to merge

### Scenario 2: CodeRabbit Has Suggestions

**Situation**: You merged, CodeRabbit suggests improvements

**CodeRabbit says:**

```
💬 Consider using React.memo() to prevent unnecessary re-renders
💬 Extract this logic into a custom hook
💬 Add error boundary for better error handling
```

**Your response:**

```
1. Evaluate each suggestion:
   ✅ React.memo() - Good! Improves performance
   ✅ Custom hook - Good! Better code organization
   ⚠️  Error boundary - Maybe later (not critical)

2. Create follow-up PR:
   git checkout -b refactor/movie-card-optimizations
   # Implement React.memo and custom hook
   git commit -m "refactor: optimize MovieCard with memo and custom hook"
   git push

3. Reply to CodeRabbit:
   "Thanks! Implemented memo and custom hook in PR #X.
    Error boundary is good idea - created issue #Y for future."
```

**Timeline**: Address within 1-2 days (not blocking)

### Scenario 3: CI Failing on Lint Error

**Situation**: Pushed code, CI fails on linting

**Error message:**

```
npm run lint:frontend
❌ Error: Unexpected console.log statement
   src/components/MovieCard.tsx:42:5
```

**Fix:**

```bash
# 1. Remove console.log locally
# Edit src/components/MovieCard.tsx - remove line 42

# 2. Verify lint passes
npm run lint:frontend
# ✅ All good

# 3. Commit fix
git add .
git commit -m "fix: remove console.log from MovieCard"
git push origin feature/add-movie-cards

# 4. CI re-runs automatically
# 5. Merge when green ✅
```

**Timeline**: 2-3 minutes to fix and merge

### Scenario 4: Test Failing

**Situation**: CI shows test failure

**Error:**

```
FAIL __tests__/components/MovieCard.test.tsx
  ● MovieCard › renders movie title

  Expected: "Inception"
  Received: "Inceptio"
```

**Fix:**

```bash
# 1. Run test locally to reproduce
npm run test:frontend

# 2. Debug and fix
# Edit component to fix truncation bug

# 3. Verify test passes
npm run test:frontend
# ✅ All tests pass

# 4. Commit and push
git add .
git commit -m "fix: correct movie title truncation in MovieCard"
git push

# 5. CI re-runs, merge when green ✅
```

**Timeline**: 5-10 minutes (depending on complexity)

### Scenario 5: Multiple Features in Progress

**Situation**: Working on 3 features simultaneously

**Strategy:**

```bash
# Feature 1: Movie Cards
git checkout -b feature/movie-cards
# ... develop, commit, push, PR, merge ✅

# Feature 2: Search Filter
git checkout develop
git pull  # Get latest (includes feature 1)
git checkout -b feature/search-filter
# ... develop, commit, push, PR, merge ✅

# Feature 3: User Profile
git checkout develop
git pull  # Get latest (includes features 1+2)
git checkout -b feature/user-profile
# ... develop, commit, push, PR ...
# ... CI running ...
```

**Best practice:**

- ✅ Each feature in separate branch
- ✅ Merge to develop one at a time
- ✅ Always pull latest before new branch
- ❌ Don't create branches from other feature branches
- ❌ Don't wait to merge multiple features together

### Scenario 6: Merge Conflict

**Situation**: PR shows merge conflicts with develop

**GitHub says:**

```
❌ This branch has conflicts that must be resolved
```

**Fix:**

```bash
# 1. Pull latest develop
git checkout develop
git pull origin develop

# 2. Merge develop into your feature branch
git checkout feature/your-feature
git merge develop

# 3. Resolve conflicts
# Edit conflicted files, choose correct changes
# Look for <<<<<<< and >>>>>>> markers

# 4. Mark as resolved
git add .
git commit -m "merge: resolve conflicts with develop"

# 5. Push
git push origin feature/your-feature

# 6. CI re-runs, merge when green ✅
```

**Prevention:**

- Merge develop into your branch frequently
- Keep feature branches short-lived (1-2 days max)
- Communicate with team if multiple people work on same files

---

## Quick Reference

### Key Commands

```bash
# Start new feature
git checkout develop && git pull
git checkout -b feature/name

# Run checks locally (before pushing)
npm run lint:frontend
npm run test:frontend
npm run build:frontend

# Commit
git add .
git commit -m "feat: description"

# Push and create PR
git push origin feature/name
gh pr create --base develop

# Check CI status
gh run list --branch feature/name

# Merge PR (via GitHub UI or CLI)
gh pr merge --squash  # or --merge or --rebase

# Update develop
git checkout develop && git pull

# Clean up old branches
git branch -d feature/name
git push origin --delete feature/name
```

### Important Links

- **GitHub Actions**: https://github.com/kydogg/disney-plus/actions
- **Pull Requests**: https://github.com/kydogg/disney-plus/pulls
- **Branch Protection**: https://github.com/kydogg/disney-plus/settings/branches
- **CodeRabbit Settings**: https://github.com/apps/coderabbitai

### CI Configuration Files

```
.github/workflows/ci.yml         # CI pipeline definition
frontend/package.json            # Test/lint/build scripts
frontend/jest.config.js          # Test configuration
frontend/eslint.config.mjs       # Linting rules
frontend/tsconfig.json           # TypeScript config
```

### When to Merge

| Scenario | Can Merge? | Action |
|----------|-----------|--------|
| ✅ All CI checks pass | ✅ YES | Merge immediately |
| ⏳ CodeRabbit pending | ✅ YES | Merge, review comments later |
| ❌ Tests failing | ❌ NO | Fix tests first |
| ❌ Lint errors | ❌ NO | Fix lint errors first |
| ❌ Build failing | ❌ NO | Fix build errors first |
| ⚠️  Merge conflicts | ❌ NO | Resolve conflicts first |

### Troubleshooting

| Problem | Solution |
|---------|----------|
| CI stuck/timeout | Re-run workflow via GitHub Actions UI |
| CodeRabbit stuck | Ignore, it's optional (or remove from required checks) |
| Test passes locally, fails in CI | Check Node version, dependencies, env vars |
| Lint passes locally, fails in CI | Commit any auto-fixes, push again |
| Can't merge even though CI passes | Check branch protection rules |
| Accidentally pushed to main | Revert immediately, use PRs in future |

---

## Document Updates

**Last Updated**: October 31, 2025
**Author**: Kyle Baker (with Claude Code assistance)
**Version**: 1.0

### Change Log

- **v1.0** (Oct 31, 2025): Initial documentation
  - Defined CI/CD workflow
  - Documented CodeRabbit's informational role
  - Added branch protection recommendations
  - Created SOPs for common scenarios

### Related Documents

- `BRANCHING_STRATEGY.md` - Git Flow branching details
- `CLAUDE.md` - Overall project documentation
- `README.md` - Project overview and setup
- `.github/workflows/ci.yml` - CI pipeline configuration

---

**Remember**: The goal is to ship quality code quickly. Tests ensure it works. Reviews improve it over time. Don't let perfect be the enemy of good! 🚀
