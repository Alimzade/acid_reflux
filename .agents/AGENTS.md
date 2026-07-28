# Agent Rules

- Do not provide single-line git commits. Commit messages must always include a concise subject line followed by a list of main changes using dashes `-`.
- Do not run git add, git commit, or git push commands directly on the user's system. Always output the exact git commands as plain text in the chat for the user to run.
- Do not provide git commit commands or draft commit messages in your responses unless the user explicitly and personally requests it.
- When writing commit messages, do not include bullets detailing intermediate/temporary changes or debug/revert iterations that occurred during the session. Only list the net main changes relative to the last committed state.
- Before providing any git commit message or commands, always inspect the actual changes using git diff or other inspection tools to ensure accuracy.
- Never rely on session memory or cumulative change logs to determine repository status. Always run `git status` and `git log` first to verify exactly what has already been committed and what remains uncommitted.
- Never list already-committed changes in any diff summary, change overview, or commit message.
- Always look at the source files directly to verify the exact state of the code rather than relying on session history or automated scripts.
- Do not run pattern searches, grep queries, or python scripts to inspect code changes or find features. Instead, **read the `README.md` and "Project Structure"** to map the architecture mentally. Use that knowledge to logically deduce the exact file responsible for a feature (e.g., UI components vs backend logic), and go directly to that file to read its full contents. Always.
- Before staging changes (git add) or writing commit messages, always inspect the `.gitignore` file to check what is ignored. Do not include ignored files or paths in git add commands or commit messages.



