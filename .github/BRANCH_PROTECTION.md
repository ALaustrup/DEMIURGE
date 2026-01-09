# Branch Protection & Workflow Guide

## 🌿 Branch Strategy

### Main Branches
- **`main`** - Production-ready code. Always deployable.
- **`develop`** - Integration branch for features. Merged to `main` for releases.

### Feature Branches
- **`feature/*`** - New features (e.g., `feature/qor-wallet`)
- **`fix/*`** - Bug fixes (e.g., `fix/video-loading`)
- **`refactor/*`** - Code refactoring (e.g., `refactor/auth-system`)
- **`docs/*`** - Documentation updates (e.g., `docs/api-update`)

### Release Branches
- **`release/*`** - Preparing a release (e.g., `release/v1.0.0`)

### Hotfix Branches
- **`hotfix/*`** - Critical production fixes (e.g., `hotfix/security-patch`)

## 🔒 Branch Protection Rules

### `main` Branch
**Required:**
- ✅ Require pull request reviews (1 approval minimum)
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Do not allow force pushes
- ✅ Do not allow deletions

**Status Checks Required:**
- `CI / guardian`
- `CI / rust`
- `CI / portal-web`
- `Build & Test / build-web`
- `Build & Test / build-rust`

### `develop` Branch
**Required:**
- ✅ Require pull request reviews (1 approval minimum)
- ✅ Require status checks to pass before merging
- ✅ Do not allow force pushes

## 📋 Pull Request Workflow

### Creating a PR
1. Create a feature branch from `develop` (or `main` for hotfixes)
2. Make your changes
3. Ensure all tests pass locally
4. Push to GitHub
5. Create a PR with a clear title and description
6. Link related issues
7. Request review from code owners

### PR Title Format
Use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat: Add QOR wallet integration`
- `fix: Resolve video loading issue`
- `docs: Update API documentation`
- `refactor: Simplify auth flow`
- `chore: Update dependencies`

### PR Review Checklist
- [ ] Code follows project style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or migration path documented)
- [ ] Security considerations addressed

## 🚀 Deployment Workflow

### Automatic Deployment
- **Vercel:** Deploy `portal-web` when `[deploy]` is in commit message
- **Server:** Deploy to `51.210.209.112` when `[deploy-server]` is in commit message

### Manual Deployment
Use GitHub Actions workflow dispatch:
1. Go to Actions → Deploy
2. Click "Run workflow"
3. Select branch and confirm

## 🏷️ Release Process

1. **Create Release Branch**
   ```bash
   git checkout -b release/v1.0.0 develop
   ```

2. **Update Version Numbers**
   - Update `package.json` versions
   - Update `Cargo.toml` versions
   - Update documentation

3. **Merge to Main**
   ```bash
   git checkout main
   git merge --no-ff release/v1.0.0
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin main --tags
   ```

4. **Merge Back to Develop**
   ```bash
   git checkout develop
   git merge --no-ff release/v1.0.0
   git push origin develop
   ```

5. **GitHub Release**
   - GitHub Actions will automatically create a release
   - Installers will be built and attached

## 🔐 Security

- Never commit secrets or API keys
- Use GitHub Secrets for sensitive data
- Report security issues privately (use Security issue template)
- Review dependencies regularly (Dependabot enabled)

## 📝 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(launcher): Add video intro support

Implemented MediaPlayer integration for intro video playback.
Video loads from assets/intro.mp4 with fallback to videos/intro.mp4.

Closes #123
```

```
fix(portal): Resolve video loading issue

Fixed path resolution for intro video in LauncherWindow.qml.
Added fallback mechanism for video file location.

Fixes #456
```

## 🎯 Code Review Guidelines

### For Authors
- Keep PRs focused and small
- Write clear commit messages
- Respond to feedback promptly
- Update PR description as needed

### For Reviewers
- Be constructive and respectful
- Focus on code quality and correctness
- Approve when satisfied
- Request changes with clear explanations

## 📚 Resources

- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
