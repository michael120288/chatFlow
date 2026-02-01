# GitStream Configuration

This directory contains GitStream automation workflows for this repository.

## What is GitStream?

GitStream is a workflow automation tool that helps with:
- Automatically labeling PRs by size and type
- Auto-approving safe changes (formatting, docs, tests)
- Requesting reviews from relevant code owners
- Enforcing code review standards
- Detecting missing tests

## Current Automations

1. **safe_changes**: Auto-approves PRs with only formatting, documentation, or test changes
2. **label_by_size**: Labels PRs as xs/s/m/l/xl based on the amount of changes
3. **code_experts**: Automatically requests reviews from code owners
4. **missing_tests**: Warns when code changes don't include test updates

## Customization

Edit `gitstream.cm` to modify automation rules. See the [GitStream documentation](https://docs.gitstream.cm/) for more information.

## Resources

- [GitStream Docs](https://docs.gitstream.cm/)
- [Automation Library](https://docs.gitstream.cm/automations/)
- [GitHub App](https://github.com/apps/gitstream-cm)
