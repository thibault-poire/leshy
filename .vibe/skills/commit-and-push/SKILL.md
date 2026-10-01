---
name: commit-and-push
description: "Load this skill when the user wants to stage all changes, commit, and push the current branch. Generates a commit message in English following the format feat(id): message, where id is the ticket ID from the branch name."
user-invocable: true
---

# Commit and Push

Stage all changes, create a commit with a conventional message, push the current branch, and return the pull request creation link.

## Steps

1. **Extract the ticket ID from the branch name.**
   - Run `git rev-parse --abbrev-ref HEAD` to get the current branch name.
   - The branch name starts with the ticket ID followed by `-` (e.g. `869f7ym83-create_locale_endpoint` gives the ID `869f7ym83`).
   - The ID is the leading segment before the first `-`. If the branch has no such ID prefix, ask the user which ID to use.

2. **Review the changes.**
   - Run `git status` and `git diff` (plus `git diff --cached` if needed) to understand what changed and write an accurate message.
   - Never commit blindly; the message must describe the actual changes.
   - If `git status` shows changes unrelated to the current ticket (pre-existing modifications or deletions in the working tree), ask the user whether to include them in the commit or leave them unstaged before running `git add -A`.

3. **Stage all changes.**
   - Run `git add -A` to stage all changes, including new files.

4. **Commit.**
   - Run `git commit -m "<message>"`.
   - Message format (English only, lowercase scope):
     ```
     feat(<ticket-id>): <message>
     ```
   - Example: `feat(869f7ym83): add locales endpoint with entity and dto`
   - The message must be in English, in the imperative mood, short (under 72 chars if possible), and describe the change, not the files.
   - Only use another type than `feat` (e.g. `fix`, `test`, `refactor`) if the user explicitly requests it.

5. **Push the branch.**
   - Run `git push -u origin <current-branch>` (with `-u` only when the branch has no upstream yet).
   - Never force-push. If the push is rejected, report the reason to the user instead of retrying.

6. **Return the pull request creation link.** (only if the push succeeded)
   - Skip this step when the current branch is the default branch (`main` or `master`) or when a pull request already exists for it.
   - Check for an existing pull request with `gh pr view <current-branch>`. If the command is unavailable, use the GitHub connector tools instead of installing `gh`.
   - Build the link from the remote URL: `https://github.com/<owner>/<repo>/pull/new/<current-branch>` (parse `<owner>/<repo>` from `git remote get-url origin`, handling both SSH and HTTPS formats).
   - Do not create the pull request; simply return the link to the user so they can open it themselves.

7. **Return to main and pull.** (only if the push succeeded)
   - Run `git checkout main`.
   - Run `git pull origin main`.
   - If `git checkout main` or the pull fails (e.g. untracked files blocking the checkout, merge conflict), stay on the current branch and report the issue to the user.

## Notes

- If the working tree is already clean, report it and skip to pushing only if the branch has unpushed commits. Steps 6 and 7 still apply after a successful push.
- Do not amend or rewrite existing commits unless the user explicitly asks.
