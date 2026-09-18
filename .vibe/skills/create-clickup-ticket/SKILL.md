---
name: create-clickup-ticket
description: Load this skill when the user wants to create a new ClickUp task with AI tag
user-invocable: true
allowed-tools: clickup_clickup_get_list, clickup_clickup_create_task
---

# Create ClickUp Ticket

This skill guides the user through creating a new ClickUp task with the **ia** tag.

## Workflow

When invoked (via `/create-clickup-ticket` or model selection):

1. **Ask for functional information (objectives)**
   - Prompt: "Veuillez décrire les **objectifs fonctionnels** et le périmètre de cette tâche."
   - This will be used to **derive the task title**

2. **Ask for technical details**
   - Prompt: "Veuillez préciser les **spécifications techniques**, les exigences et les contraintes techniques."

3. **Reformulate user inputs for professional tone**
   - Take the raw functional objectives and technical details from steps 1-2
   - Rewrite both in a clear, professional, and structured manner
   - Remove informal language, abbreviations, and ensure proper grammar
   - Maintain all technical accuracy and requirements
   - Preserve all key information while improving clarity

4. **Derive the title from functional information**
   - Extract a concise title from the **reformulated** functional objectives (step 1)
   - Truncate to approximately **255 characters maximum**
   - Use the first sentence or a summarized version if the text is long
   - Ensure the title is clear and descriptive

4. **Ask for priority**
   - Prompt: "What is the **priority**?"
   - Present options: `urgente`, `élevée`, `normale`, `basse`
   - Map French to ClickUp values:
     - `urgente` → `urgent`
     - `élevée` → `high`
     - `normale` → `normal`
     - `basse` → `low`
   - Default: `normal` if user presses enter without selection

5. **Ask for the target list**
   - Prompt: "Dans quelle **liste ClickUp** cette tâche doit-elle être créée ? (indiquez le nom ou l'ID de la liste)"
   - If user provides a name, use `clickup_get_list` to resolve it to an ID
   - If user provides an ID directly, use it as-is
   - Default: "Tasks" if user presses enter without selection

6. **Create the task**
   - Use `clickup_create_task` with:
     - `name`: the derived title from **reformulated** functional information (step 4, max ~255 chars)
     - `list_id`: the resolved list ID (from step 5)
     - `markdown_description`: formatted as:
       ```markdown
       ### Descriptions

       {functional_information}

       ### Details techniques

       {technical_details}
       ```
     - `priority`: the mapped priority value (from step 3)
     - `tags`: `["ia"]`

## Notes

- Always add the **"ia"** tag to every task created through this skill
- If the user provides a list name that doesn't exist or is ambiguous, ask for clarification
- Use the workspace_id from the session if needed (most tools auto-detect it)
- Keep questions clear and one at a time — do not ask multiple questions in a single message
