# Contributing to contenteditable.lab

Thank you for your interest in contributing to contenteditable.lab! This document provides guidelines and instructions for contributing.

## Ways to Contribute

### 1. Report a New Case

Found an interesting `contenteditable` behavior? You can contribute by documenting it:

1. **Test the behavior** in the [Playground](https://contenteditable.realerror.com/playground)
2. **Copy the issue template** from the playground
3. **Open a GitHub issue** with your findings

Alternatively, create a pull request with a new case file:

```bash
# Create a new case file
touch src/content/cases/ce-XXXX-your-case-name.md
```

Case file template:

```markdown
---
id: 'ce-XXXX'
os: 'macOS'
osVersion: '14.0'
device: 'MacBook Pro'
deviceVersion: 'M1'
browser: 'Chrome'
browserVersion: '120.0'
keyboard: 'US QWERTY'
caseTitle: 'Your case title describing the behavior'
tags: ['relevant', 'tags']
status: 'draft'
scenarioId: 'scenario-your-scenario'
---

## Phenomenon

Describe what happens...

## Reproduction Steps

1. Step one
2. Step two
3. Step three

## Expected Behavior

What should happen...

## Observed Behavior

What actually happens...
```

### 2. Improve Documentation

- Fix typos or clarify existing documentation
- Add more details to case descriptions
- Improve code examples

### 3. Translate Content

See [TRANSLATION.md](./TRANSLATION.md) for translation guidelines.

### 4. Improve the Site

- Fix bugs in the website
- Improve accessibility
- Enhance the playground
- Add new features

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm

### Getting Started

```bash
# Clone the repository
git clone https://github.com/easylogic/contenteditable.git
cd contenteditable

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Project Structure

```
src/
├── components/     # Astro and React components
├── content/        # Markdown content (cases)
├── i18n/           # Internationalization
├── pages/          # Page routes
└── styles/         # Global styles

public/             # Static assets
```

### Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |

## Pull Request Guidelines

### Before Submitting

1. **Test your changes locally**
   ```bash
   pnpm build
   pnpm preview
   ```

2. **Follow existing code style**
   - Use consistent naming conventions
   - Follow the existing component patterns

3. **Write clear commit messages**
   ```
   feat: add new case for Safari IME handling
   fix: correct typo in Korean translation
   docs: update contribution guidelines
   ```

### PR Checklist

- [ ] Changes build without errors
- [ ] All links work correctly
- [ ] Content follows the schema (for case contributions)
- [ ] Tested in at least one browser

### Review Process

1. Submit your PR
2. A maintainer will review within a few days
3. Address any feedback
4. Once approved, your PR will be merged

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for everyone.

### Expected Behavior

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## Questions?

- Open a [GitHub Discussion](https://github.com/easylogic/contenteditable/discussions)
- Check existing [Issues](https://github.com/easylogic/contenteditable/issues)

---

Thank you for contributing to contenteditable.lab! 🎉

