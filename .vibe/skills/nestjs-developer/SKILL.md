---
name: nestjs-developer
description: "Load this skill when the user wants to develop NestJS features following project conventions. Accepts development objectives in JSON (similar to get-clickup-ticket output format: id, name, markdown_description) or text format. Uses plan mode to break down tasks."
user-invocable: true
---

# NestJS Developer Skill

This skill helps develop NestJS features following the existing project conventions. It accepts development objectives in JSON format (matching get-clickup-ticket output structure with id, name, markdown_description fields) or plain text format and uses plan mode to systematically break down and execute the development tasks.

## Scope

This skill performs **development only**. Do not generate, modify, or run unit tests.

## Project Conventions (from codebase analysis)

### Code Structure

- **Source directory**: `server/src/`
- **Module organization**: Feature-based modules (e.g., `spaces/`)
- **File naming**: kebab-case (e.g., `spaces.controller.ts`)
- **Class naming**: PascalCase (e.g., `SpacesController`)

### Import Conventions

- Use relative paths starting with `src/` (e.g., `"src/spaces/spaces.service"`)
- Do NOT use `../` parent imports (oxlint rule: `import/no-relative-parent-imports`)
- Import order (oxfmt), groups separated by blank lines: nestjs imports (`@nestjs/*`) first, then internal imports (`src/...`), then typeorm type-only imports (`import type { ... } from "typeorm"`) last

### TypeScript & NestJS

- Decorators: `@Module`, `@Controller`, `@Injectable`, `@Entity`, `@Get`, `@Post`, etc.
- Validation: Use `class-validator` decorators with `ValidationPipe`
- TypeORM: UUID primary keys (`@PrimaryGeneratedColumn("uuid")`)
- Configuration: `@nestjs/config` for environment variables

### Database

- TypeORM with PostgreSQL
- Entities in `entities/` subdirectory
- Repository injection via `@InjectRepository(Entity)`

### Linting & Formatting

- **Linter**: oxlint with rules:
  - No relative parent imports (`import/no-relative-parent-imports`)
  - Explicit `any` is allowed by config (`typescript/no-explicit-any` is "off"), but prefer proper types or `unknown` anyway
  - No floating promises (`typescript/no-floating-promises`)
- **Formatter**: oxfmt with custom import sorting

## Input Format

The skill accepts development objectives in two formats:

### JSON Format (matching get-clickup-ticket output)

The JSON input must contain at least `id` and `name` fields (matching get-clickup-ticket output format):

```json
{
  "id": "DEV-123",
  "name": "Create user authentication",
  "markdown_description": "Implement JWT authentication for users with:\n\n- User registration endpoint\n- User login endpoint\n- JWT token generation\n- Token validation middleware"
}
```

**Branch Creation Rule**: Before starting development, the skill will create/switch to a branch named `[id]-[title]` where `title` is the `name` field **translated to English**, converted to lowercase with spaces replaced by underscores.

Example: For the JSON above, branch name would be: `DEV-123-create_user_authentication`

Additional optional fields:

- `entity`: Entity definition object
- `endpoints`: API endpoints array
- `requirements`: Feature requirements array
- `dependencies`: Additional dependencies array

### Text Format

```
Create a user authentication module with:
- User entity with email, password, name fields
- Auth service with register and login methods
- Auth controller with /register and /login endpoints
- JWT token generation and validation
- Password hashing
```

For text input, the skill will prompt for `id` and `name` to create the branch.

## Workflow (Plan Mode)

When invoked via `/nestjs-developer` or by describing a NestJS development task:

### Phase 0: Branch Management

1. **Extract or request ID and name**:
   - For JSON input: use `id` and `name` fields
   - For text input: prompt user for `id` and `name`
2. **Generate branch name**: **Translate `name` to English** first (titles are often in French), then convert to lowercase and replace spaces with underscores: `name.trim().toLowerCase().replace(/\s+/g, '_')`
3. **Create branch**: `[id]-[english_title]` (e.g., `DEV-123-create_user_authentication`)
4. **Switch to branch**: Use `git checkout -b [branch_name]` or `git switch -c [branch_name]`

### Phase 1: Parse & Validate Input

1. **Detect input format**: Check if input is JSON or plain text
2. **Parse JSON** if format is JSON (expecting id, name, markdown_description)
3. **Extract requirements** from markdown_description or text using structured parsing
4. **Validate** that required fields are present
5. **Request missing information** if needed

### Phase 2: Analyze Existing Codebase

1. **Scan existing modules** to understand project structure
2. **Check for similar patterns** (existing entities, services, controllers)
3. **Identify dependencies** that might be needed
4. **Review configuration** (TypeORM, validation, etc.)

### Phase 3: Generate Development Plan

Create a todo list with the `todo` tool:

1. **Create entity** (if database model needed)
2. **Create DTOs** (for request/response validation)
3. **Create service** (business logic)
4. **Create controller** (HTTP endpoints)
5. **Create module** (tie everything together)
6. **Update app.module** (register new module)

### Phase 4: Implement Components

For each component in the plan:

#### Entity Creation

- File: `src/{feature}/entities/{name}.entity.ts`
- Use TypeORM decorators: `@Entity()`, `@PrimaryGeneratedColumn("uuid")`, `@Column()`
- Follow existing entity patterns (see `space.entity.ts`)
- Add proper types and validation

#### DTO Creation

- File: `src/{feature}/dto/{name}.dto.ts`
- Use `class-validator` decorators: `@IsString()`, `@IsEmail()`, `@IsNotEmpty()`, etc.
- Extend from `PartialType` for update DTOs when applicable
- Add proper TypeScript types

#### Service Creation

- File: `src/{feature}/{feature}.service.ts`
- Use `@Injectable()` decorator
- Inject repositories with `@InjectRepository(Entity)`
- Implement business logic methods
- Return proper types (avoid `any`)
- Handle promises properly (no floating promises)

#### Controller Creation

- File: `src/{feature}/{feature}.controller.ts`
- Use `@Controller("{path}")` decorator
- Inject service in constructor
- Create endpoints with proper decorators: `@Get()`, `@Post()`, `@Param()`, `@Body()`, etc.
- Use DTOs for request/response validation
- Return proper HTTP responses

#### Module Creation

- File: `src/{feature}/{feature}.module.ts`
- Use `@Module()` decorator
- Import `TypeOrmModule.forFeature([Entity])` for TypeORM
- Declare controllers, providers, imports
- Export if needed for other modules

### Phase 5: Integration

1. **Register module** in `app.module.ts`
2. **Add imports** following the custom group order
3. **Verify imports** don't use relative parent paths

### Phase 6: Validation

1. **Run linting** (from `server/`): `pnpm lint`
2. **Check TypeScript**: `npx tsc --noEmit`
3. **Verify structure** matches project conventions
4. **Do not run tests**: never generate or execute unit tests (`pnpm test`, `pnpm test:cov`); test generation is the responsibility of the `unit-test-generator` skill

## Input Processing

### JSON Input Processing (get-clickup-ticket compatible)

When receiving JSON input (matching get-clickup-ticket output):

1. Parse the JSON object
2. Extract required fields:
   - `id`: Task/feature identifier (used for branch name prefix)
   - `name`: Feature title (used for branch name suffix)
   - `markdown_description`: Full description (parsed for requirements)
3. Generate branch name: `[id]-[english_title_in_lowercase_with_underscores]`
   - **Translate `name` to English** if it is not already in English (titles are often in French)
   - Trim and convert the English title to lowercase: `name.trim().toLowerCase()`
   - Replace all spaces with underscores: `.replace(/\s+/g, '_')`
   - Example: `"Créer l'authentification utilisateur"` -> `"create_user_authentication"`
   - Final branch: `DEV-123-create_user_authentication`
4. Extract development requirements from `markdown_description`:
   - Parse for entity definitions
   - Parse for endpoint definitions
   - Parse for technical requirements
5. Validate that `id` and `name` are present

### Text Input Processing

When receiving plain text input:

1. Use structured parsing to extract:
   - Feature/module name (first noun or explicit name)
   - Description (full text)
   - Entity names (look for "entity", "model", "table")
   - Endpoints (look for HTTP methods or paths)
   - Requirements (look for "need", "require", "should have")
2. **Prompt for branch information**:
   - Ask: "Quel est l'ID pour cette tache ? (ex: DEV-123)"
   - Ask: "Quel est le titre pour cette tache ? (sera utilise pour le nom de la branch)"
3. Generate branch name from provided id and title (**translate the title to English** before slugification)
4. Ask clarifying questions if information is ambiguous
5. Present parsed structure to user for confirmation

## Branch Naming Rules

The branch name is always generated as: `[id]-[english_title_slug]` (the title is translated to English before slugification)

Where:

- `id`: The value from the `id` field (e.g., "DEV-123", "FEAT-456")
- `title_slug`: The `name` field **translated to English**, then converted to lowercase with all whitespace replaced by underscores

Examples with a French title:

- `id: "DEV-123"`, `name: "Créer l'authentification utilisateur"` -> `DEV-123-create_user_authentication`

Examples:

- `id: "DEV-123"`, `name: "Create User Auth"` -> `DEV-123-create_user_auth`
- `id: "FEAT-456"`, `name: "Add payment gateway"` -> `FEAT-456-add_payment_gateway`
- `id: "BUG-789"`, `name: "Fix login bug"` -> `BUG-789-fix_login_bug`

Special cases:

- Multiple consecutive spaces are replaced by a single underscore
- Leading/trailing spaces in name are trimmed before conversion
- If name is empty, use "development" as default

## Code Generation Templates

### Entity Template

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("{{table_name}}")
export class {{EntityName}} {
  @PrimaryGeneratedColumn("uuid")
  id: string;

{{#each fields}}
  @Column({
{{#if column_type}}
    type: "{{column_type}}",
{{/if}}
{{#if length}}
    length: {{length}},
{{/if}}
{{#if unique}}
    unique: true,
{{/if}}
{{#if nullable}}
    nullable: {{nullable}},
{{/if}}
{{#if default}}
    default: {{default}},
{{/if}}
  })
  {{property_name}}: {{ts_type}};
{{/each}}
}
```

### DTO Template

```typescript
import { IsString, IsEmail, IsNotEmpty{{#if hasOtherValidators}}, {{otherValidators}}{{/if}} } from "class-validator";

export class {{DtoName}} {
{{#each fields}}
  @Is{{validator}}()
  {{name}}: {{type}};
{{/each}}
}
```

### Service Template

```typescript
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { {{EntityName}} } from "src/{{feature}}/entities/{{entity_file}}.entity";

import type { Repository } from "typeorm";

@Injectable()
export class {{ServiceName}} {
  constructor(
    @InjectRepository({{EntityName}})
    private readonly {{entity_var}}_repository: Repository<{{EntityName}}>,
  ) {}

{{#each methods}}
  {{#if async}}async {{/if}}{{name}}({{params}}): {{returnType}} {
    {{body}}
  }
{{/each}}
}
```

### Controller Template

```typescript
import { Controller, {{methods}} } from "@nestjs/common";

import { {{ServiceName}} } from "src/{{feature}}/{{service_file}}.service";

@Controller("{{path}}")
export class {{ControllerName}} {
  constructor(private readonly {{service_var}}: {{ServiceName}}) {}

{{#each endpoints}}
  @{{method}}("{{route}}")
  {{handler_name}}({{params}}) {
    return this.{{service_var}}.{{service_method}}({{args}});
  }
{{/each}}
}
```

### Module Template

```typescript
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { {{ControllerName}} } from "src/{{feature}}/{{controller_file}}.controller";

import { {{ServiceName}} } from "src/{{feature}}/{{service_file}}.service";

import { {{EntityName}} } from "src/{{feature}}/entities/{{entity_file}}.entity";

@Module({
  imports: [TypeOrmModule.forFeature([{{EntityName}}])],
  controllers: [{{ControllerName}}],
  providers: [{{ServiceName}}],
})
export class {{ModuleName}} {}
```

## Conventions-Specific Rules

1. **Always use `src/` prefix** for internal imports, never `../`
2. **Follow oxlint rules**:
   - No floating promises (await or return promises)
   - No relative parent imports
   - Explicit `any` is allowed by config (`typescript/no-explicit-any` is "off"), but prefer proper types or `unknown`
3. **Follow oxfmt import order** (groups separated by blank lines):
   - nestjs imports (`/*`) first
   - internal imports (`src/...`) second
   - typeorm type-only imports (`import type { ... } from "typeorm"`) last
4. **Use UUID** for primary keys: `@PrimaryGeneratedColumn("uuid")`
5. **Use ValidationPipe** globally (already configured in main.ts)
6. **Use class-validator** for DTO validation
7. **Prefix API routes** with the controller path (will be under `/api/` globally)

## Error Handling

1. **Missing information**: Prompt user for clarification
2. **Invalid JSON**: Show error and ask for text input instead
3. **Ambiguous requirements**: Ask specific questions to resolve ambiguity
4. **File conflicts**: Check if files exist before creating, prompt for overwrite
5. **Type errors**: Validate generated code compiles before finishing
6. **Branch exists**: If branch already exists, prompt to switch to it or use a different name
7. **Git errors**: If git commands fail, inform user and stop development

## Example Sessions

### Example 1: JSON Input (get-clickup-ticket compatible)

User: `/nestjs-developer {"id": "DEV-123", "name": "Create user authentication", "markdown_description": "Implement JWT auth with user entity, register and login endpoints"}`

Skill:

1. Extracts: id=DEV-123, name=Create user authentication
2. Generates branch name: DEV-123-create_user_authentication
3. Creates/switches to branch: git checkout -b DEV-123-create_user_authentication
4. Parses markdown_description for requirements
5. Creates plan with todo items
6. Generates User entity, Auth service, Auth controller, Auth module
7. Integrates with app.module
8. Validates with linting

### Example 2: Text Input

User: `/nestjs-developer Create a products module with Product entity and CRUD endpoints`

Skill:

1. Parses text to extract: feature=products, needs entity, needs CRUD
2. Prompts: "Quel est l'ID pour cette tache ? (ex: DEV-123)"
3. User provides: "DEV-456"
4. Prompts: "Quel est le titre pour cette tache ?"
5. User provides: "Products CRUD"
6. Generates branch name: DEV-456-products_crud
7. Creates/switches to branch
8. Creates plan
9. Generates all necessary files
10. Integrates and validates

### Example 3: Full JSON with all fields

```json
{
  "id": "FEAT-789",
  "name": "Add Payment Gateway",
  "markdown_description": "Integrate Stripe payment gateway with:\n\n- Payment entity\n- Payment service\n- POST /payments endpoint\n- Webhook handling"
}
```

Skill:

1. Branch: FEAT-789-add_payment_gateway
2. Parses markdown_description for detailed requirements
3. Generates all components with proper structure

## Commands Reference

- **Branch operations**:
  - Create and switch: `git checkout -b [branch_name]`
  - Switch existing: `git switch [branch_name]`
  - Check current branch: `git branch --show-current`
- All commands run from the `server/` directory
- Lint: `pnpm lint` (runs `oxlint --type-aware src/ test/`)
- Format: `pnpm format` (runs `oxfmt src/ test/`)
- TypeScript check: `npx tsc --noEmit`
- Build: `pnpm build`
