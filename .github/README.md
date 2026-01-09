# GitHub Development Workflow

This directory contains all GitHub-specific configuration for the DEMIURGE project.

## 📁 Structure

```
.github/
├── workflows/          # GitHub Actions workflows
│   ├── ci.yml         # Continuous Integration
│   ├── build.yml      # Build & Test
│   ├── deploy.yml     # Deployment automation
│   └── release.yml     # Release automation
├── ISSUE_TEMPLATE/     # Issue templates
│   ├── bug_report.md
│   ├── feature_request.md
│   └── security.md
├── CODEOWNERS          # Code ownership rules
├── dependabot.yml      # Dependency updates
├── PULL_REQUEST_TEMPLATE.md
├── BRANCH_PROTECTION.md
├── SECURITY.md
└── README.md (this file)
```

## 🚀 Quick Start

### For Contributors
1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/my-feature`
3. **Make your changes**
4. **Commit:** Use [Conventional Commits](https://www.conventionalcommits.org/)
5. **Push:** `git push origin feature/my-feature`
6. **Create a Pull Request**

### For Maintainers
1. **Review PRs** - Check code quality and tests
2. **Merge to `develop`** - After approval
3. **Release** - Create a tag to trigger release workflow

## 🔄 Workflows

### CI (Continuous Integration)
- **Triggers:** Push to `main`/`develop`, PRs
- **Runs:** Guardian Protocol, Runtime Integrity, Schema checks, Rust builds, Web builds
- **Status:** Required for merging to `main`

### Build & Test
- **Triggers:** Push to `main`/`develop`, PRs
- **Runs:** Builds all web apps, Rust components, Windows launcher
- **Artifacts:** Build outputs stored for 7-30 days

### Deploy
- **Triggers:** Push to `main` with `[deploy]` or `[deploy-server]` in commit message
- **Actions:** Deploys to Vercel or production server
- **Manual:** Can be triggered via workflow dispatch

### Release
- **Triggers:** Tag push (`v*.*.*`) or manual dispatch
- **Actions:** Creates GitHub release, builds installers
- **Output:** Release notes, installers for all platforms

## 📋 Issue Templates

### Bug Report
Use for reporting bugs. Includes:
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots/logs

### Feature Request
Use for suggesting new features. Includes:
- Feature description
- Motivation
- Proposed solution
- Acceptance criteria

### Security
Use for reporting security vulnerabilities. **DO NOT make public.**

## 🔒 Security

- **Reporting:** Use Security issue template or email security@demiurge.cloud
- **Policy:** See [SECURITY.md](SECURITY.md)
- **Dependencies:** Dependabot automatically checks for vulnerabilities

## 🤖 Automation

### Dependabot
- **Frequency:** Weekly (Monday 9:00 AM)
- **Ecosystems:** npm, Cargo, GitHub Actions
- **Limits:** 5 open PRs per ecosystem
- **Reviewers:** @Alaustrup

### Branch Protection
- **`main`:** Requires PR review, status checks, up-to-date branch
- **`develop`:** Requires PR review, status checks
- **Details:** See [BRANCH_PROTECTION.md](BRANCH_PROTECTION.md)

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
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```
feat(launcher): Add video intro support
fix(portal): Resolve video loading issue
docs(api): Update RPC documentation
```

## 🏷️ Releases

### Creating a Release
1. Update version numbers
2. Create release branch: `release/v1.0.0`
3. Merge to `main`
4. Create tag: `git tag -a v1.0.0 -m "Release v1.0.0"`
5. Push tag: `git push origin v1.0.0`
6. GitHub Actions will automatically:
   - Create GitHub release
   - Build installers
   - Upload artifacts

## 🔗 Resources

- [Branch Protection Guide](BRANCH_PROTECTION.md)
- [Security Policy](SECURITY.md)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

## ⚙️ Configuration

### Required Secrets
For deployment workflows, configure these secrets in GitHub Settings:

**Vercel:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

**Server:**
- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_SSH_KEY`

### Code Owners
See [CODEOWNERS](CODEOWNERS) for automatic PR assignment.

---

**Questions?** Open an issue or contact @Alaustrup
