# Git Branching Strategy

Git Flow workflow for the Disney Plus Clone project with CodeRabbit AI review.

## Branches

### `main`
- **Production code** - Only tested, stable releases
- **Protected branch** - Requires PR approval
- Merge via PR from `develop`
- Tagged releases (`v1.0.0`, `v1.1.0`, etc.)
- Never commit directly to main

### `develop`
- **Active development** - Integration branch
- **Default branch** for all feature branches
- Protected branch - Requires PR approval
- CodeRabbit reviews all PRs to develop
- All features merge here first before going to main

### `feature/*`
- For new features and enhancements
- Format: `feature/<scope>/<feature-name>`
  - `feature/frontend/video-player`
  - `feature/backend/authentication`
  - `feature/shared/analytics`
- Create from `develop`
- PR to `develop` for CodeRabbit review
- Delete after merge

### `bugfix/*`
- For non-urgent bug fixes
- Format: `bugfix/<scope>/<bug-name>`
  - `bugfix/frontend/navigation-issue`
  - `bugfix/backend/cors-error`
- Create from `develop`
- PR to `develop` for CodeRabbit review
- Delete after merge

### `hotfix/*`
- **Urgent fixes** for production issues
- Format: `hotfix/<issue-description>`
  - `hotfix/critical-login-bug`
- Create from `main`
- PR to **both** `main` AND `develop`
- Delete after merge

## Workflow Diagrams

### Feature Development Flow
```
develop
  └─> feature/frontend/video-player
        ├─ commit: initial setup
        ├─ commit: add tests
        ├─ commit: implement feature
        └─> PR to develop (CodeRabbit reviews)
              └─> merge to develop (after approval)
```

### Release Flow
```
develop (accumulated features)
  └─> PR to main (title: "Release v1.1.0")
        └─> CodeRabbit reviews
              └─> merge to main
                    └─> tag: v1.1.0
```

### Hotfix Flow
```
main (v1.0.0)
  └─> hotfix/critical-bug
        ├─ commit: fix critical bug
        ├─ commit: add tests
        ├─> PR to main (emergency fix)
        │     └─> merge to main
        │           └─> tag: v1.0.1
        └─> PR to develop (sync hotfix)
              └─> merge to develop
```

## Daily Workflow

### Starting a New Feature
```bash
# Ensure develop is up to date
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/frontend/video-player

# Make changes, write tests, commit
git add .
git commit -m "feat(frontend): add video player component"
git commit -m "test(frontend): add video player tests"

# Push branch
git push origin feature/frontend/video-player

# Create PR (triggers CodeRabbit review)
gh pr create --base develop --title "feat(frontend): Add video player component" --body "Implements video playback with controls"
```

### After CodeRabbit Review
```bash
# Address feedback, make changes
git add .
git commit -m "refactor(frontend): address CodeRabbit feedback"
git push

# CodeRabbit automatically reviews new commits
# Merge when approved (via GitHub UI or CLI)
gh pr merge --squash

# Delete local branch
git checkout develop
git pull
git branch -d feature/frontend/video-player
```

### Creating a Release
```bash
# Ensure develop is stable and tested
git checkout develop
git pull

# Create release PR
gh pr create \
  --base main \
  --head develop \
  --title "Release v1.1.0" \
  --body "## Release v1.1.0

### New Features
- Video player component
- User authentication
- Search functionality

### Bug Fixes
- Fixed navigation issue
- Resolved CORS error

### Testing
- All tests passing
- Manual QA completed
"

# After merge, tag the release
git checkout main
git pull
git tag v1.1.0
git push --tags
```

### Hotfix for Production
```bash
# Create from main
git checkout main
git pull
git checkout -b hotfix/critical-login-bug

# Fix the bug and add tests
git add .
git commit -m "fix(frontend): resolve critical login bug"
git commit -m "test(frontend): add regression test for login bug"

# Push and create PR to main
git push origin hotfix/critical-login-bug
gh pr create --base main --title "hotfix: Critical login bug" --label "hotfix"

# After merge to main, create PR to develop
gh pr create --base develop --title "chore: Sync hotfix to develop"

# Tag the hotfix release
git checkout main
git pull
git tag v1.0.1
git push --tags

# Clean up
git checkout develop
git pull
git branch -d hotfix/critical-login-bug
```

## Commit Format

We use **Conventional Commits** for clear, semantic commit history.

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, no logic change)
- `refactor` - Code refactoring (no feature or bug fix)
- `test` - Adding or updating tests
- `chore` - Maintenance tasks, dependencies, configs
- `perf` - Performance improvements
- `ci` - CI/CD changes

### Scopes
- `frontend` - Frontend workspace
- `backend` - Backend workspace
- `shared` - Shared code/configs
- `root` - Root-level configs

### Examples
```bash
# Good commits
git commit -m "feat(frontend): add video player with play/pause controls"
git commit -m "fix(backend): resolve CORS issue for production origin"
git commit -m "test(frontend): add comprehensive tests for video player"
git commit -m "chore(root): update dependencies to latest versions"
git commit -m "docs(frontend): add JSDoc comments to video player component"

# Bad commits (avoid these)
git commit -m "update stuff"
git commit -m "fix bug"
git commit -m "WIP"
```

## Pull Request Guidelines

### PR Title
Use conventional commit format:
```
feat(frontend): Add video player component
fix(backend): Resolve authentication timeout
chore(root): Update CI workflow
```

### PR Description Template
```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] All tests passing
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project conventions
- [ ] TypeScript types are correct
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Commit messages follow conventional commits

## Screenshots (if applicable)
[Add screenshots here]
```

## CodeRabbit Integration

### How CodeRabbit Works
1. **Automatic Trigger**: Opens PR to `develop` or `main`
2. **AI Review**: CodeRabbit analyzes code within minutes
3. **Feedback**: Provides inline comments and suggestions
4. **Re-review**: Automatically reviews new commits
5. **Approval**: Marks as approved when issues addressed

### CodeRabbit Checks
- ✅ Code quality and best practices
- ✅ Potential bugs and edge cases
- ✅ Security vulnerabilities
- ✅ Test coverage
- ✅ TypeScript type safety
- ✅ Performance issues
- ✅ Documentation completeness

### Best Practices for CodeRabbit
1. **Open PRs early** - Even as draft PRs for early feedback
2. **Keep PRs focused** - One feature/fix per PR
3. **Respond to feedback** - Address or discuss each suggestion
4. **Learn from reviews** - CodeRabbit teaches best practices
5. **Don't ignore warnings** - Security and performance issues are critical

### When CodeRabbit Flags Issues
```bash
# CodeRabbit found issues - fix them
git add .
git commit -m "refactor(frontend): address CodeRabbit feedback on error handling"
git push

# CodeRabbit will re-review automatically
# Repeat until approved
```

## Branch Protection Rules

### `main` branch
- Requires PR approval
- Requires CodeRabbit approval
- Requires status checks to pass
- No force pushes
- No deletions

### `develop` branch
- Requires PR approval (can be self-approved for solo dev)
- Requires CodeRabbit approval
- Requires status checks to pass
- No force pushes
- No deletions

## When to Use Each Branch Type

### ✅ Use `feature/*` for:
- New components or pages
- New API endpoints
- New features (large or small)
- Refactoring existing code
- Dependency updates
- Performance improvements

### ✅ Use `bugfix/*` for:
- Non-critical bugs
- UI/UX fixes
- Logic errors
- Test fixes

### ✅ Use `hotfix/*` for:
- Critical production bugs
- Security vulnerabilities
- Data loss prevention
- Service outages

### ❌ Direct commits to `develop`:
- Never (always use feature branches)

### ❌ Direct commits to `main`:
- Never (only via PR from develop or hotfix)

## Quick Reference

### Branch Naming
```bash
feature/frontend/video-player
feature/backend/authentication
bugfix/frontend/navbar-z-index
bugfix/backend/api-timeout
hotfix/critical-data-loss
```

### Common Commands
```bash
# Start new feature
git checkout develop && git pull
git checkout -b feature/scope/name

# Create PR (triggers CodeRabbit)
gh pr create --base develop

# Update from develop
git checkout develop && git pull
git checkout feature/scope/name
git rebase develop

# Merge PR (after approval)
gh pr merge --squash

# Tag release
git tag v1.0.0 && git push --tags
```

## Summary

This Git Flow strategy with CodeRabbit ensures:
- 🤖 **Automated code review** on every PR
- 🔒 **Stable main branch** with only tested code
- 🚀 **Fast development** on develop branch
- 🐛 **Quick hotfixes** when needed
- 📚 **Clear history** with conventional commits
- 🎯 **High code quality** via AI review

**Remember**: Always create a feature branch and PR for CodeRabbit review. This is your opportunity to get instant, expert feedback on your code!
