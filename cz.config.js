import { definePrompt } from "czg";

export default definePrompt({
  messages: {
    subject:
      "Write a brief, clear description of the changes in lowercase characters.",
  },
  types: [
    { value: "feat", name: "feat:     A new feature" },
    { value: "fix", name: "fix:      A bug fix" },
    {
      value: "docs",
      name: "docs:     Documentation only changes",
    },
    {
      value: "refactor",
      name: "refactor: A code change that neither fixes a bug nor adds a feature",
    },
    {
      value: "perf",
      name: "perf:     A code change that improves performance",
    },
    {
      value: "test",
      name: "test:     Adding missing tests or correcting existing tests",
    },
    {
      value: "build",
      name: "build:    Changes that affect the build system",
    },
    {
      value: "ci",
      name: "ci:       Changes to CI config files and scripts",
    },
    {
      value: "revert",
      name: "revert:   Revert previous commit",
    },
    {
      value: "deps",
      name: "deps:     Update dependencies",
    },
    {
      value: "notes",
      name: "notes:    Add new note or edit existing note",
    },
    {
      value: "now",
      name: "now:      Update now page",
    },
    {
      value: "resume",
      name: "resume:   Update resume/portfolio",
    },
  ],
  allowCustomScopes: false,
  allowEmptyScopes: true,
  maxSubjectLength: 100,
});
