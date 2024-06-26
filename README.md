# C# Project Version Comparer Action

[![GitHub Super-Linter](https://github.com/kenneth-fossen/project-version-cmp-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/kenneth-fossen/project-version-cmp-action/actions/workflows/ci.yml/badge.svg)

This action prints compares all the versions of your C# Project files that you
submit as a list of arguments to the action. If they are not equal, the action
will fail and report false.

## Inputs

### `projects`

**Required** List of project files to check the version of. Default `""`. Uses
paths defined from the root of the Git repository.

## Outputs

### `equal`

A boolean value if all the projects versions are equal.

## Example usage

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v4

  - name: Compare Project Files
    uses: kenneth-fossen/project-version-cmp-action@v1
    id: solution
    with:
      projects: |-
        testdata/Client.csproj
        testdata/Schema.csproj

  - name: Get the output equal
    run: echo "Projects are equal ${{ steps.solution.outputs }}"
```

## Testing

Using `act` you can test your action locally.

`act -j project-version-cmp`

## Action is created with the template JavaScript Action

Use this template to bootstrap the creation of a JavaScript action. :rocket:

This template includes compilation support, tests, a validation workflow,
publishing, and versioning guidance.

If you are new, there's also a simpler introduction in the
[Hello world JavaScript action repository](https://github.com/actions/hello-world-javascript-action).
