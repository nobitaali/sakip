# Contributing to SAKIP

Terima kasih atas minat Anda untuk berkontribusi pada proyek SAKIP! Dokumen ini berisi panduan untuk berkontribusi pada pengembangan aplikasi SAKIP.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Documentation](#documentation)
7. [Pull Request Process](#pull-request-process)
8. [Issue Reporting](#issue-reporting)
9. [Community](#community)

## Code of Conduct

### Our Pledge

Kami berkomitmen untuk menjadikan partisipasi dalam proyek ini sebagai pengalaman yang bebas dari pelecehan bagi semua orang, tanpa memandang usia, ukuran tubuh, disabilitas, etnis, identitas dan ekspresi gender, tingkat pengalaman, kebangsaan, penampilan pribadi, ras, agama, atau identitas dan orientasi seksual.

### Our Standards

Contoh perilaku yang berkontribusi menciptakan lingkungan yang positif meliputi:

- Menggunakan bahasa yang ramah dan inklusif
- Menghormati sudut pandang dan pengalaman yang berbeda
- Menerima kritik konstruktif dengan baik
- Fokus pada apa yang terbaik untuk komunitas
- Menunjukkan empati terhadap anggota komunitas lainnya

### Enforcement

Pelanggaran terhadap code of conduct dapat dilaporkan ke tim proyek di conduct@sakip-app.com. Semua keluhan akan ditinjau dan diselidiki serta akan menghasilkan respons yang dianggap perlu dan sesuai dengan keadaan.

## Getting Started

### Prerequisites

Sebelum berkontribusi, pastikan Anda memiliki:

- Node.js 18+ dan npm
- PostgreSQL 14+
- Redis 6+
- Git
- Text editor atau IDE (VS Code direkomendasikan)

### Development Setup

1. **Fork repository**
   ```bash
   # Fork di GitHub, kemudian clone
   git clone https://github.com/YOUR_USERNAME/sakip-app.git
   cd sakip-app
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-org/sakip-app.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env dengan konfigurasi development Anda
   ```

5. **Setup database**
   ```bash
   # Buat database development
   createdb sakip_dev
   
   # Jalankan migrasi
   npm run db:migrate
   
   # Seed data
   npm run db:seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

### Project Structure

```
sakip-app/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── stores/            # State management
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript types
├── public/                # Static assets
├── docs/                  # Documentation
├── tests/                 # Test files
├── dummy-data/            # Sample data
└── scripts/               # Build and utility scripts
```

## Development Workflow

### Branch Strategy

Kami menggunakan Git Flow dengan modifikasi:

- `main` - Production-ready code
- `develop` - Integration branch untuk fitur baru
- `feature/*` - Feature branches
- `hotfix/*` - Urgent fixes untuk production
- `release/*` - Release preparation

### Creating a Feature Branch

```bash
# Update develop branch
git checkout develop
git pull upstream develop

# Create feature branch
git checkout -b feature/your-feature-name

# Work on your feature
# ... make changes ...

# Commit changes
git add .
git commit -m "feat: add new feature description"

# Push to your fork
git push origin feature/your-feature-name
```

### Commit Message Convention

Kami menggunakan [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(dashboard): add performance chart component
fix(auth): resolve login redirect issue
docs(api): update authentication documentation
test(utils): add unit tests for date helpers
```

## Coding Standards

### JavaScript/TypeScript

Kami menggunakan ESLint dan Prettier untuk konsistensi kode:

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Code Style Guidelines

#### 1. **Naming Conventions**

```javascript
// Variables dan functions - camelCase
const userName = 'john_doe';
const getUserData = () => {};

// Constants - UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';

// Components - PascalCase
const UserProfile = () => {};

// Files - kebab-case
user-profile.component.js
api-service.js
```

#### 2. **Component Structure**

```jsx
// React Component Template
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { apiService } from '../services/api';
import './ComponentName.css';

interface ComponentProps {
  prop1: string;
  prop2?: number;
}

const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 = 0 }) => {
  // Hooks
  const [localState, setLocalState] = useState('');
  const { data, loading, error } = useQuery('key', apiService.getData);

  // Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // Render helpers
  const renderContent = () => {
    // Render logic
  };

  // Early returns
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Main render
  return (
    <div className="component-name">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

#### 3. **API Service Pattern**

```javascript
// services/apiService.js
class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 10000,
    });
  }

  async get(endpoint, params = {}) {
    try {
      const response = await this.client.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    // Error handling logic
    return new Error(error.response?.data?.message || error.message);
  }
}

export const apiService = new ApiService(process.env.VITE_API_URL);
```

### CSS/Styling

Kami menggunakan Tailwind CSS dengan beberapa custom utilities:

```jsx
// Good - Menggunakan Tailwind classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  <h2 className="text-lg font-medium text-gray-900">Title</h2>
  <button className="btn-primary">Action</button>
</div>

// Custom components untuk pattern yang sering digunakan
<div className="card">
  <div className="card-header">
    <h2 className="card-title">Title</h2>
  </div>
  <div className="card-content">
    Content here
  </div>
</div>
```

## Testing Guidelines

### Testing Strategy

1. **Unit Tests** - Individual functions dan components
2. **Integration Tests** - API endpoints dan data flow
3. **E2E Tests** - User workflows

### Writing Tests

#### Unit Tests (Jest + React Testing Library)

```javascript
// components/__tests__/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS classes', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByText('Click me')).toHaveClass('btn-primary');
  });
});
```

#### API Tests

```javascript
// services/__tests__/apiService.test.js
import { apiService } from '../apiService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ApiService', () => {
  beforeEach(() => {
    mockedAxios.create.mockReturnValue(mockedAxios);
  });

  it('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await apiService.get('/test');
    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith('/test', { params: {} });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Test Coverage Requirements

- **Minimum coverage**: 80%
- **Critical paths**: 95%
- **New features**: 90%

## Documentation

### Code Documentation

#### JSDoc Comments

```javascript
/**
 * Calculates the performance percentage based on achievement and target
 * @param {number} achievement - The actual achievement value
 * @param {number} target - The target value
 * @param {string} [polarity='higher_better'] - The indicator polarity
 * @returns {number} The calculated percentage
 * @throws {Error} When target is zero or negative
 * @example
 * const percentage = calculatePerformance(85, 100);
 * console.log(percentage); // 85
 */
function calculatePerformance(achievement, target, polarity = 'higher_better') {
  if (target <= 0) {
    throw new Error('Target must be greater than zero');
  }
  
  if (polarity === 'lower_better') {
    return target <= achievement ? 100 : (target / achievement) * 100;
  }
  
  return (achievement / target) * 100;
}
```

#### Component Documentation

```jsx
/**
 * PerformanceChart - Displays performance data in various chart formats
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.data - Performance data array
 * @param {string} [props.chartType='line'] - Type of chart (line, bar, pie)
 * @param {string} [props.period='monthly'] - Data period (monthly, quarterly, yearly)
 * @param {Function} [props.onDataPointClick] - Callback when data point is clicked
 * 
 * @example
 * <PerformanceChart 
 *   data={performanceData}
 *   chartType="line"
 *   period="monthly"
 *   onDataPointClick={(point) => console.log(point)}
 * />
 */
const PerformanceChart = ({ data, chartType = 'line', period = 'monthly', onDataPointClick }) => {
  // Component implementation
};
```

### README Updates

Ketika menambah fitur baru, update README.md dengan:

- Deskripsi fitur
- Cara penggunaan
- Screenshot (jika applicable)
- Breaking changes (jika ada)

## Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout feature/your-feature
   git rebase develop
   ```

2. **Run tests**
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

3. **Update documentation**
   - Update README jika perlu
   - Add/update JSDoc comments
   - Update API documentation

### PR Template

Gunakan template berikut untuk PR:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline runs
   - Code quality checks
   - Security scans

2. **Code Review**
   - At least 2 reviewers required
   - Address all feedback
   - Maintain discussion thread

3. **Testing**
   - QA testing (for major features)
   - Performance testing (if applicable)

4. **Merge**
   - Squash and merge preferred
   - Delete feature branch after merge

## Issue Reporting

### Bug Reports

Gunakan template berikut untuk bug reports:

```markdown
**Bug Description**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Ubuntu 20.04]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]
 - Node.js version
 - Database version

**Additional Context**
Add any other context about the problem here.
```

### Feature Requests

```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority:high` - High priority issue
- `priority:medium` - Medium priority issue
- `priority:low` - Low priority issue

## Community

### Communication Channels

- **GitHub Issues** - Bug reports dan feature requests
- **GitHub Discussions** - General discussions
- **Email** - contribute@sakip-app.com
- **Slack** - [Join our Slack workspace](https://sakip-dev.slack.com)

### Getting Help

1. **Check existing issues** - Mungkin sudah ada yang mengalami masalah serupa
2. **Read documentation** - Cek user manual dan API docs
3. **Ask in discussions** - Post di GitHub Discussions
4. **Contact maintainers** - Email untuk pertanyaan spesifik

### Recognition

Contributors akan diakui dalam:

- CONTRIBUTORS.md file
- Release notes
- Project website
- Annual contributor awards

### Mentorship

Untuk new contributors:

- **Good first issues** - Issues yang cocok untuk pemula
- **Mentorship program** - Pairing dengan experienced contributors
- **Code review feedback** - Detailed feedback untuk pembelajaran
- **Documentation** - Comprehensive guides dan examples

## Development Tips

### Useful Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm test                # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
npm run test:e2e        # Run E2E tests

# Code Quality
npm run lint            # Lint code
npm run lint:fix        # Fix linting issues
npm run format          # Format code with Prettier
npm run type-check      # TypeScript type checking

# Database
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with sample data
npm run db:reset        # Reset database

# Utilities
npm run analyze         # Analyze bundle size
npm run clean           # Clean build artifacts
```

### VS Code Extensions

Recommended extensions:

- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Thunder Client (for API testing)

### Debugging

#### Frontend Debugging

```javascript
// Use React Developer Tools
// Add breakpoints in browser DevTools
// Use console.log strategically

// Debug hooks
import { useDebugValue } from 'react';

const useCustomHook = (value) => {
  useDebugValue(value ? 'Active' : 'Inactive');
  // Hook logic
};
```

#### Backend Debugging

```javascript
// Use Node.js debugger
node --inspect-brk server.js

// Debug with VS Code
// Add breakpoints in VS Code
// Use debug console
```

### Performance Considerations

- **Bundle size** - Keep bundle size minimal
- **Code splitting** - Split code by routes
- **Lazy loading** - Load components when needed
- **Memoization** - Use React.memo, useMemo, useCallback
- **Database queries** - Optimize queries and use indexes
- **Caching** - Implement appropriate caching strategies

---

**Thank you for contributing to SAKIP!** 🎉

Your contributions help make government performance management more efficient and transparent.

For questions about contributing, please contact: contribute@sakip-app.com