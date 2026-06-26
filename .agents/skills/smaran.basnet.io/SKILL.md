```markdown
# smaran.basnet.io Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `smaran.basnet.io` repository, a TypeScript project built with Next.js. You'll learn about file naming, import/export styles, commit patterns, and how to write and organize tests. While no automated workflows were detected, this guide provides best practices and suggested commands for common tasks.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `userProfile.tsx`, `dashboardHeader.ts`

### Import Style
- Use **alias imports** for modules.
  - Example:
    ```typescript
    import Button from '@/components/Button'
    import { fetchUser } from '@/lib/api'
    ```

### Export Style
- Use **default exports**.
  - Example:
    ```typescript
    // components/Button.tsx
    const Button = () => { /* ... */ }
    export default Button
    ```

### Commit Patterns
- Commit messages are **freeform** (no enforced prefixes).
- Average commit message length is about 51 characters.
  - Example:
    ```
    Add responsive navbar and update logo asset
    ```

## Workflows

_No automated workflows detected in this repository. Below are suggested manual workflows for common tasks._

### Adding a New Component
**Trigger:** When you need to create a new UI component  
**Command:** `/add-component`

1. Create a new file in the appropriate directory using camelCase (e.g., `userCard.tsx`).
2. Define your component and export it as default.
    ```typescript
    const UserCard = ({ user }) => (
      <div>{user.name}</div>
    )
    export default UserCard
    ```
3. Import the component using alias imports where needed.
    ```typescript
    import UserCard from '@/components/userCard'
    ```
4. Add relevant tests in a file named `userCard.test.tsx`.

### Writing Tests
**Trigger:** When you add or update code that requires testing  
**Command:** `/write-test`

1. Create a test file alongside your code using the pattern `*.test.*` (e.g., `userCard.test.tsx`).
2. Write tests using your chosen testing framework (not specified in the repo).
    ```typescript
    // userCard.test.tsx
    import { render } from '@testing-library/react'
    import UserCard from './userCard'

    test('renders user name', () => {
      const user = { name: 'Alice' }
      const { getByText } = render(<UserCard user={user} />)
      expect(getByText('Alice')).toBeInTheDocument()
    })
    ```
3. Run your test suite to verify correctness.

## Testing Patterns

- **Test files** use the pattern `*.test.*` (e.g., `component.test.tsx`).
- **Testing framework** is not specified; adapt examples to your preferred tool (e.g., Jest, React Testing Library).
- Place test files alongside the code they test for easy discovery.

## Commands

| Command         | Purpose                                 |
|-----------------|-----------------------------------------|
| /add-component  | Scaffold a new component with conventions|
| /write-test     | Create and organize a test file         |
```