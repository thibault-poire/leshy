---
name: ticket-development-workflow
description: "Load this skill to execute a complete development workflow from a ClickUp ticket: fetch ticket details, develop NestJS features, generate unit tests, then commit and push the branch. Invoke via /ticket-development-workflow [id]. If any skill fails, it will notify you and wait for instructions to continue or stop."
user-invocable: true
---

# Ticket Development Workflow Skill

This skill orchestrates a complete development workflow by sequentially invoking four specialized skills:

1. `get-clickup-ticket` - Retrieve ClickUp ticket details
2. `nestjs-developer` - Develop NestJS features based on ticket requirements
3. `unit-test-generator` - Generate unit tests for the developed features
4. `commit-and-push` - Stage all changes, commit in `feat(<ticket-id>): <message>` format, and push the branch

## Invocation

Invoke this skill using one of these commands:

- `/ticket-development-workflow [ticket_id]`
- `/ticket-development-workflow` (will prompt for ticket ID)

## Workflow Phases

### Phase 1: Fetch Ticket Details

- Invokes `get-clickup-ticket` skill with the provided or prompted ticket ID
- Extracts: `id`, `name`, `markdown_description`
- **On failure**: Notifies user and asks whether to retry with a different ID or abort

### Phase 2: NestJS Development

- Invokes `nestjs-developer` skill with the ticket data (JSON format)
- Creates branch, develops features following project conventions
- **On failure**: Notifies user and asks whether to continue to tests or abort

### Phase 3: Unit Test Generation

- Invokes `unit-test-generator` skill to create Vitest tests for the controllers and services developed in Phase 2
- **On failure**: Notifies user that tests may need manual completion

### Phase 4: Commit and Push

- Invokes `commit-and-push` skill to stage all changes, commit, and push the current branch
- The commit message is in English following `feat(<ticket-id>): <message>`, with the ticket ID extracted from the branch name
- **On failure**: Notifies user that changes may need manual push

## Error Handling

This skill implements **fail-fast with user confirmation**:

1. If `get-clickup-ticket` fails (invalid ID, not found, API error):
   - Show error message to user
   - Ask: "Ticket recovery failed. Do you want to retry with a different ID or abort? (retry/abort)"
   - If "retry": prompt for new ID and retry Phase 1
   - If "abort": stop workflow

2. If `nestjs-developer` fails (development error, git error):
   - Show error message to user
   - Ask: "Development failed. Do you want to continue to test generation or abort? (continue/abort)"
   - If "continue": proceed to Phase 3 with available data
   - If "abort": stop workflow

3. If `unit-test-generator` fails (test generation error):
   - Show error message to user
   - Notify: "Test generation failed. The NestJS development is complete but tests may need manual work."
   - Proceed to Phase 4 (no abort option)

4. If `commit-and-push` fails (git error, push rejected):
   - Show error message to user
   - Notify: "Commit and push failed. The development and tests are complete, but changes may need manual push."
   - Workflow completes (this is the final phase)

## Input Processing

### With Ticket ID

```
/ticket-development-workflow DEV-123
```

Extracts ID as `DEV-123` and proceeds to Phase 1.

### Without Ticket ID

```
/ticket-development-workflow
```

Prompts: "Quel est l'ID du ticket ClickUp ?"

## Data Flow

```
User Input (ID)
    ↓
Phase 1: get-clickup-ticket
    ↓ (output: {id, name, markdown_description})
Phase 2: nestjs-developer
    ↓ (output: developed NestJS code)
Phase 3: unit-test-generator
    ↓ (output: Vitest test files beside the source files)
Phase 4: commit-and-push
    ↓ (output: commit created and branch pushed to origin)
Complete Workflow
```

## Skill Invocation Details

### Phase 1: get-clickup-ticket

- Tool: `skill` with name `get-clickup-ticket`
- Input: ticket ID from user
- Expected output: JSON with `id`, `name`, `markdown_description`
- On error: Parse error message and present to user

### Phase 2: nestjs-developer

- Tool: `skill` with name `nestjs-developer`
- Input: JSON string matching get-clickup-ticket output format
- Format: `{"id": "...", "name": "...", "markdown_description": "..."}`
- On error: Parse error and present to user with continue/abort choice

### Phase 3: unit-test-generator

- Tool: `skill` with name `unit-test-generator`
- Input: The module, controllers and services developed in Phase 2 (not the ticket JSON)
- Expected output: Vitest test files (`<module>.controller.test.ts`, `<module>.service.test.ts`) in `server/src/<module>/`
- On error: Notify user but complete workflow

### Phase 4: commit-and-push

- Tool: `skill` with name `commit-and-push`
- Input: None (the skill extracts the ticket ID from the current branch name)
- Expected output: All changes staged, a commit with message `feat(<ticket-id>): <message>` in English, and the branch pushed to origin
- On error: Notify user but complete workflow

## User Interaction Flow

```
Start: User invokes /ticket-development-workflow [id?]
    ↓
If no ID: Prompt "Quel est l'ID du ticket ClickUp ?"
    ↓
Phase 1: Load get-clickup-ticket skill
    ↓
If Phase 1 fails:
    → Show: "Error: [specific error message]"
    → Ask: "Ticket recovery failed. Do you want to retry with a different ID or abort? (retry/abort)"
    → If retry: Go back to ID prompt
    → If abort: Exit workflow
    ↓
Phase 2: Load nestjs-developer skill with ticket data
    ↓
If Phase 2 fails:
    → Show: "Error: [specific error message]"
    → Ask: "Development failed. Do you want to continue to test generation or abort? (continue/abort)"
    → If continue: Proceed to Phase 3
    → If abort: Exit workflow
    ↓
Phase 3: Load unit-test-generator skill
    ↓
If Phase 3 fails:
    → Show: "Error: [specific error message]"
    → Notify: "Test generation failed. The NestJS development is complete but tests may need manual work."
    ↓
Phase 4: Load commit-and-push skill
    ↓
If Phase 4 fails:
    → Show: "Error: [specific error message]"
    → Notify: "Commit and push failed. The development and tests are complete, but changes may need manual push."
    ↓
Workflow Complete
```

## Example Session

### Successful Flow

```
User: /ticket-development-workflow DEV-123

Skill:
1. Loading get-clickup-ticket for DEV-123...
2. Ticket found: "Create user authentication"
3. Loading nestjs-developer...
4. NestJS development complete: User module created with auth endpoints
5. Loading unit-test-generator...
6. Unit tests generated for UserService and UserController
7. Loading commit-and-push...
8. Commit created and branch pushed
9. Workflow complete!
```

### Flow with Error in Phase 1

```
User: /ticket-development-workflow DEV-999

Skill:
1. Loading get-clickup-ticket for DEV-999...
2. Error: Aucun ticket ClickUp trouvé avec l'ID: DEV-999
3. Ticket recovery failed. Do you want to retry with a different ID or abort? (retry/abort)

User: retry

Skill:
4. Quel est l'ID du ticket ClickUp ?

User: DEV-123

Skill:
5. Loading get-clickup-ticket for DEV-123...
6. [continues with Phase 2 and 3]
```

### Flow with Error in Phase 2

```
User: /ticket-development-workflow DEV-123

Skill:
1. Loading get-clickup-ticket for DEV-123...
2. Ticket found: "Create user authentication"
3. Loading nestjs-developer...
4. Error: Git command failed: unable to create the development branch
5. Development failed. Do you want to continue to test generation or abort? (continue/abort)

User: continue

Skill:
6. Loading unit-test-generator...
7. Warning: Test generation may be incomplete due to previous errors
8. Workflow complete with warnings
```

### Flow with Error in Phase 3

```
User: /ticket-development-workflow DEV-123

Skill:
1. Loading get-clickup-ticket for DEV-123...
2. Ticket found: "Create user authentication"
3. Loading nestjs-developer...
4. NestJS development complete
5. Loading unit-test-generator...
6. Error: Could not determine which service to test
7. Test generation failed. The NestJS development is complete but tests may need manual work.
8. Loading commit-and-push...
9. Commit created and branch pushed
10. Workflow complete
```

## Implementation Notes

1. **Skill Loading**: Use the `skill` tool to load each sub-skill sequentially
2. **State Management**: Maintain the ticket data between phases in memory
3. **Error Detection**: Check for error patterns in skill outputs (error messages, exceptions, null results)
4. **User Prompts**: Use clear, actionable questions with explicit options
5. **Logging**: Provide clear progress messages at each phase

## Conventions

- Always show which phase is currently executing
- Always show success/failure status for each phase
- Always give user control on failure (except for final phase)
- Keep messages concise but informative
- Use consistent formatting for prompts and notifications
