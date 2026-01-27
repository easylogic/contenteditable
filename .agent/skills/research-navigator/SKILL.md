# Research Navigator Skill

This skill provides a systematic approach for identifying gaps in the `contenteditable.lab` database and searching for new browser-specific quirks, IME issues, and specification changes.

## Objectives
- Identify what's missing in `src/content/cases/` and `src/content/scenarios/`.
- Systematically search external sources for new "incidents".
- Collect high-quality reproduction steps and environment details.

## External Intelligence Sources
1. **Browser Bug Trackers**:
   - [Chromium (Monorail/Buganizer)](https://issues.chromium.org/issues?q=componentid:1456184) - Input/Editing
   - [WebKit (Safari)](https://bugs.webkit.org/buglist.cgi?quicksearch=contenteditable)
   - [Mozilla (Firefox)](https://bugzilla.mozilla.org/buglist.cgi?quicksearch=contenteditable)
2. **Standard & Discussions**:
   - [W3C Editing Working Group](https://github.com/w3c/editing)
   - [W3C Input Events Spec](https://github.com/w3c/input-events)
3. **Editor Ecosystem**:
   - Issue trackers for Slate, ProseMirror, Lexical, and Quill.
   - StackOverflow (`contenteditable`, `ime`, `selection-api`).

## Research Workflow
1. **Gap Analysis**: Check existing tags in the project. What is under-represented? (e.g., RTL, Mobile-specific gestures, Voice Control).
2. **Keyword Scouting**: Search for "unexpected behavior", "regression", "broken" in the sources above.
3. **Cross-Reference**: Verify if the issue is already covered by an existing Scenario.
4. **Drafting**: Use the `Case Generator` skill to create a skeleton case based on findings.

## Best Practices
- **Verify Recency**: Focus on bugs from the last 2 years unless they are "immortal" quirks.
- **Environment Detail**: Look for specific OS + Browser combinations in bug reports.
- **Spec Alignment**: Check if the behavior violates a specific part of the W3C spec.
