---
name: get-clickup-ticket
description: Load this skill when the user wants to retrieve a ClickUp ticket by ID, ideally via /get-clickup-ticket [id] or by prompting for the ID
user-invocable: true
allowed-tools: clickup_get_task
---

# Get ClickUp Ticket

When invoked via `/get-clickup-ticket`:

1. **Extract the ticket ID**:
   - If the user provides an ID in the invocation (e.g., `/get-clickup-ticket 12345` or `/get-clickup-ticket DEV-123`), parse and extract the first argument as the `task_id`
   - If no ID is provided, prompt the user with: "Quel est l'ID du ticket ClickUp ?"

2. **Fetch the ticket**:
   - Use the `clickup_get_task` tool with the extracted or provided `task_id`
   - Include full data by setting `include: ["custom_fields", "description"]` to get all available fields

3. **Return the result**:
   - Filter the response to only include "name", "markdown_description", and "id" fields
   - Output as JSON object with only these three fields
   - Do not prettify, format, or modify beyond this filtering

4. **Error handling**:
   - If the ticket is not found, inform the user: "Aucun ticket ClickUp trouvé avec l'ID: [id]"
   - If the ID format is invalid, ask the user to verify and provide a correct ID

5. **Scope**: This skill supports both numeric IDs and custom IDs (like 'DEV-1234').
