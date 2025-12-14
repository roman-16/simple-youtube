# Agent Guidelines

## General Principles
- **Strictness**: ALWAYS/NEVER = strict rules. Prefer/Avoid = strong defaults with exceptions allowed
- **Git Operations**: NEVER EVER do ANY git operation (`git add`, `git stage`, `git restore --staged`, `git commit`, `git push`, `git checkout`, `git branch`, `git merge`, `git rebase`, etc.) without EXPLICIT user permission. This is an absolute rule with ZERO exceptions. Only the user initiates git operations
- **Verify Before Implementing**: ALWAYS verify APIs, library features, and configurations using Context7 or official documentation before implementation. NEVER assume attributes, methods, or behavior exist without verification
- **Documentation**: Use `docs/README.md` as the main documentation file (rest of `docs/` folder available for additional docs)
- **Ask Questions**: ALWAYS ask if unclear. NEVER assume. STOP and ask before proceeding if ANY of:
  - Multiple valid approaches exist
  - User intent could be interpreted multiple ways
  - Requirements are vague or incomplete
  - Design decisions needed (architecture, patterns, data models, APIs)
  - Trade-offs exist between options
  - Scope is ambiguous (what's in/out, how deep to go)

## Feature Workflow
1. **Research**: Understand the codebase, requirements, and constraints before making changes
   - Check existing patterns and implementations for similar functionality
   - Review related tests to understand expected behavior
   - Identify dependencies and potential side effects
2. **Plan**: Create an initial plan breaking down the task into clear, actionable steps
   - Create a markdown feature file in `docs/features/` named `YYYY-MM-DD-HHMM_FEATURE_NAME.md`
   - Use `date +%Y-%m-%d-%H%M` to get the timestamp (e.g., `docs/features/2025-11-26-1530_AUTHENTICATION.md`)
3. **Present Summary**: Present a brief plan summary to the user
   - Display: "Type `y` to go to clarifying"
   - If user adds context/feedback: immediately update the feature file
   - Continue showing the prompt until user types `y`
   - Only proceed to step 4 (Clarify) after user confirmation
4. **Clarify**: Ask questions to ensure complete understanding. REQUIRED before implementation if ANY ambiguity exists
   - Ask ONE question at a time, wait for answer, then ask the next question
   - Use previous answers to inform subsequent questions
   - Format each question as:
     ```
     **Question:** [question]?
     (1) [option]
     (2) [option]
     ```
     Mention that text answers are welcome (pick number, add context, or free-form text). Don't include "text answer" as a numbered option
   - Update the feature file with each Q&A after answering
   - Continue until ALL ambiguities resolved - don't stop after pre-written questions. Proactively identify new ambiguities and ask follow-ups. Don't ask permission to continue
   - Know when to stop: architecture, file structure, user-facing changes, breaking changes, major patterns - NOT minor implementation details
   - After all questions: comprehensively update plan with all decisions
   - NEVER skip if uncertain - defaulting to assumption is unacceptable
5. **Confirm**: Present the final plan summary and ask "Type `y` to implement this plan"
   - If "y": proceed to implementation
   - If other feedback: adjust the plan and ask for confirmation again
6. **Implement**: Execute the plan incrementally, following code style and architecture guidelines
   - Write tests alongside implementation
   - Make incremental commits for major milestones if working on large features
7. **Validate**: Run all quality gates in order to ensure correctness (see Quality Gates section)
   - If any gate fails: fix issues and re-run all gates from the beginning
8. **Update Feature File**: Sync the feature file with any discussions, decisions, or changes not yet documented
9. **Complete**: After all quality gates pass, summarize changes made and ask about committing (see Version Control section)

## Architecture
Browser extension (Chrome/Firefox) that simplifies YouTube by removing clutter and distractions:
- **Browser Support**: Chrome (manifest v3) and Firefox (manifest v2) via vite-plugin-web-extension
- **Content Scripts**: DOM manipulation modules that remove shorts, short videos, community posts, and "Watch Again" feed
- **Popup UI**: React-based settings panel with Tailwind CSS styling
- **Storage**: webext-options-sync for cross-browser settings persistence
- **Build**: Vite with separate Chrome/Firefox builds

## Project Structure
Key directories:
- `public/icons/` - Extension icons in various sizes
- `src/contentScript/` - Content scripts injected into YouTube pages
- `src/contentScript/modules/` - Feature modules (community, explore, shorts, videos)
- `src/popup/` - React popup UI for extension settings
- `src/popup/App/` - Main app components (Configuration, Presets)
- `src/popup/components/` - Reusable UI components (Button, Switch, TimeInput)
- `src/popup/hooks/` - Custom React hooks for options storage
- `src/shared/` - Shared utilities and options storage configuration

## Code Style

### General Principles
- **Simplicity**: Straightforward solutions. No unnecessary intermediate variables—directly invoke/access if used once
- **Paradigm**: Functional only—pure functions, immutability, no classes/mutations
- **Duplicate Code**: Extract to reusable helpers
- **Dependencies**: Check existing before adding new. Prefer well-maintained. Document rationale for major ones

### Style & Formatting
- **Formatting**: Biome (2 spaces, auto-organize imports), empty line at end of files, whitespace between logical blocks
- **Property Ordering**: Alphabetical by default unless another ordering makes better sense. For mixed objects: primitives first, then nested (both alphabetically)

### Imports & Exports
- **Imports**: `@/` for src/, `@@/` for package root, `./` for same directory only
- **Exports**: ALWAYS at end of file (EOF). Only export what's used elsewhere. Export shared types. Do not export unused code
  - Use inline `type` keyword in export statements: `export { functionName, type TypeName }`
  - Alphabetical ordering for exports (case-insensitive)
- **Default exports preferred**: Nearly every file has default export named as file
  - Named exports only for: types, constants alongside default, or utilities grouping together (rare)
  - Barrel files (index.ts): Only re-export actual consumer imports—remove unused
- **File Organization**: Remove folder if only index file—move up and rename to folder name. No `types.ts` files. Files named as default export
- **Type Location**: Define types in the module where they're **primarily used**, export for other modules to import

### Naming Conventions
- **PascalCase**: Types/Interfaces/Classes (`OrderEvent`, `UserConfig`)
- **camelCase**: Functions/Variables/Constants (`processOrder`, `maxRetries`)
- **Descriptive Names**: Full names, not abbreviations—especially parameters. Exceptions: `i` (index), `error` (catch), single-letter generics (`T`, `K`, `V`)
- **Files**: Named as default export
- **Test Files**: Mirror source with `.test.ts` in `tests/`

### TypeScript Practices
- **Types**: Strict, never `any` (use `unknown`). Prefer `type` over `interface`. Infer when obvious. No `types.ts` files—define inline, co-located with primary implementation
- **Type Derivation**: Prefer `Awaited<ReturnType<typeof fn>>` to derive types from function returns instead of defining explicit duplicate types
- **Type Assertions**: Prefer `satisfies` over `as`. Use type predicates for filters: `items.filter((item): item is NonNullable<typeof item> => item !== null)`
- **Variables**: Prefer `const`. Use `let` only for: lazy init singletons, error cleanup, loop counters, complex state
- **Nullish Values**: Prefer `undefined` over `null` for absent values
- **Inline Constants**: Inline strings/numbers used 2-3 times in one module. Extract only when cross-module, complex, or likely to change

### Functions & Control Flow
- **Functions**: Arrow functions, implicit returns when possible
- **Callbacks**: Pass references directly if signatures match: `process.on("SIGINT", shutdown)`
- **Wrapper Functions**: Don't create functions called once at startup—execute at module scope. Don't wrap array functions—use single-item arrays
- **Async**: Prefer async/await
- **Loops**: Prefer functional (map, filter, reduce) over imperative (for, while)
- **Conditionals**: Combine related, reduce nesting. Single-line for simple cases

### Object & Data Handling
- **Object Construction**: Spread dynamic FIRST, explicit LAST (explicit overrides): `{ ...dynamicProps, id: 123 }`
- **Redundant Variables**: Don't create multiple holding same value
- **String Building**: Array join for conditional concat (not `+=`)
- **Method Chaining**: Chain directly unless needed for clarity

### Comments & Documentation
- **When**: Explain "why" not "what"—business logic, workarounds, non-obvious decisions
- **Avoid**: NEVER restate code. If self-explanatory, no comment needed
- **TODOs**: `// TODO:` with context (optional ticket ref)

### Config & Environment
- **Config**: Env vars only, no secrets in code
- **Env Vars**: ALWAYS update: `.env`, `.env.example`, `src/env.ts`. NEVER access `process.env` directly—import from `src/env.ts`

### Error Handling & Logging
- **Errors**: Graceful failures with structured logging. Include context (what failed, why, expected). Consider error codes for production
- **Logging**: Structured JSON via custom logger. Log: key ops, state changes, external calls, errors

### Testing
- **Approach**: Write tests alongside implementation (TDD/test-first)
- **Test Strategy**: Write tests outside-in (e.g., e2e → integration → unit)
- **Location**: `.test.ts` files in `tests/` directory, mirroring `src/` structure
- **Framework**: vitest with exact matchers only (no relative matchers like `toBeCloseTo`, `toBeGreaterThan`)
- **Coverage**: Minimum 95% for statements, lines, and functions; 90% for branches
- **Mocking**:
  - **ONLY mock external dependencies** (npm packages) - NEVER mock our own code in `src/`
  - **Not all dependencies need mocking** - only mock dependencies that require it (external services, APIs, complex integrations)
  - **ALL mocks MUST be global** - place in `.vitest/mocks/` directory, named as `mock` + camelCased dependency name (e.g., `@google-cloud/secret-manager` → `mockGoogleCloudSecretManager.ts`)
  - **No local mocks** - NEVER use `vi.mock()` in test files. All mocking must be in `.vitest/mocks/`
  - **Mock setup**: Import mocks in `.vitest/setup.ts`, referenced by `vitest.config.ts`
  - **Mock exports**: Export mocks from `.vitest/mocks/index.ts` barrel file only when tests need to reconfigure them
- **Test Environment**: Set `process.env` in `.vitest/env.ts`, imported first in `.vitest/setup.ts`
- **Test Quality**:
  - Write meaningful tests validating behavior/edge cases
  - Avoid trivial tests (testing that functions exist, mocked implementations without behavior verification)
  - Test behavior, not implementation details
  - Use descriptive test names: `"should throw error when orderId is missing"`
  - Group related tests with `describe` blocks
- **DOM Selectors**: Define a `selectors` constant at the top of test files with all query selectors.
- **Validation**: Run `npm run test` after test changes

## Quality Gates
Run in this order to fail fast:

1. TypeScript compilation must succeed with no errors (`npm run typecheck`)
2. Biome linting must pass (`npm run lint`)
3. All tests must pass and test coverage must meet minimum 95% threshold across all metrics (`npm run test`)
4. Project must build and run successfully (`npm run dev`)

## Version Control

### CRITICAL: Explicit Permission Required
- **NEVER do ANY git operation without explicit user permission** - This includes: commit, push, stage, unstage, branch operations, merges, rebases, etc.
- **ALWAYS wait for user to type `y`, `c`, or `p`** before executing ANY git command
- **Even if quality gates pass, even if the user said "commit" earlier in the conversation, even if it seems obvious** - STOP and ask for confirmation with the exact options below
- **No exceptions. No shortcuts. No assuming intent.**

### Quality Gates & Timing
- **Quality Gates Required**: Run ALL quality gates before ANY git operation. If any gate fails, inform the user and stop
- **When to Ask About Committing**: Ask when you feel like it makes sense
  - Logical unit complete (feature/bugfix/refactor/task finished)
  - Quality gates pass (or minimally, changes validated)
  - Before significantly different task
  - **Key principle**: When in doubt, ask. Only skip if certain larger commit coming
- **Commit Workflow**: NEVER commit automatically. Only ask when logical
  - Ask: "Type `y` to start committing"
  - If "y": Run quality gates first. If any gate fails, inform the user and stop. Then proceed with commit workflow:
    - Check staged files (`git status`, `git diff --staged`)
    - Display: files to unstage (if any), additional files to stage (if any), proposed commit message (conventional format describing ALL changes), horizontal rule (`---`)
    - Display options based on staging needs:
      - If staging changes needed (files to unstage or additional files to stage): Type `s` to stage | `c` to stage and commit | `p` to stage, commit and push
      - If no staging changes needed: Type `c` to commit | `p` to commit and push
    - On `s`: unstage specified files, stage additional files, show staged changes, prompt with `c`/`p` options
    - On `c`/`p`: perform staging changes if needed, then commit (and push if `p`)
    - On other response: treat as instruction (modify message, change files, make more changes, etc.)
    - If file changes made relevant to current commit: restart entire workflow from beginning
  - On other response: treat as instruction (don't start commit workflow)
- **Commit Message Format**: `emoji type(scope): description`
  - Examples: `✨ feat(consumer): add retry logic` | `🐛 fix(zendesk): handle rate limiting` | `✅ test(consumer): add timeout scenarios`
  - **Body**: Keep simple and concise. Skip body for obvious changes. Use bullet list only for meaningful details (key architectural decisions, breaking changes, important context). Avoid exhaustive change lists
- **Types with Emojis**:
  - `✨ feat` - New feature
  - `🐛 fix` - Bug fix
  - `♻️ refactor` - Code refactoring
  - `✅ test` - Adding or updating tests
  - `📚 docs` - Documentation changes
  - `🔧 chore` - Maintenance tasks
  - `⚡ perf` - Performance improvements
  - `🎨 style` - Code style/formatting changes
  - `🔒 security` - Security improvements
- **Scope**: popup, contentScript, shared, build

## Commands
- **Build**: `npm run build` (production - both Chrome and Firefox) | `npm run dev` (development with watch)
- **Type check**: `npm run typecheck`
- **Lint**: `npm run lint` (Biome)
- **Build Chrome only**: `npm run build:chrome`
- **Build Firefox only**: `npm run build:firefox`
