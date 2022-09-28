# Contribution Guidelines

When contributing to `daily-huddle`, whether on GitHub or in other community spaces:

- Be respectful, civil, and open-minded.
- Before opening a new pull request, try searching through the [issue tracker](https://github.com/OrigenStudio/daily-huddle/issues) for known issues or fixes.

## How to Contribute

### Prerequisites

In order to not waste your time implementing changes that has already been declined, or is generally not needed, start by [opening an issue](https://github.com/OrigenStudio/daily-huddle/issues/new/choose) describing the problem you would like to solve.

### Setup your environment

_Some commands will assume you have the Github CLI installed, if you haven't, consider [installing it](https://github.com/cli/cli#installation), but you can always use the Web UI if you prefer that instead._

In order to contribute to this project, you will need to fork the repository:

```bash
gh repo fork OrigenStudio/daily-huddle
```

then, clone it to your local machine:

```bash
gh repo clone <your-github-name>/daily-huddle
```

This project uses [pnpm](https://pnpm.io) as its package manager. Install it if you haven't already:

```bash
npm install -g pnpm
```

Then, install the project's dependencies:

```bash
pnpm install
```

### Implement your changes

This project is a [Next.js](https://nextjs.org/) project created with [create-t3-app](https://github.com/t3-oss/create-t3-app). Now you're all setup and can start implementing your changes.

Here are some useful scripts for when you are developing:

| Command       | Description                                             |
| ------------- | ------------------------------------------------------- |
| `pnpm dev`    | Starts the development server with HMR                  |
| `pnpm build`  | Builds project                                          |
| `pnpm start`  | Starts server using production build                    |
| `pnpm format` | Formats the code                                        |
| `pnpm lint`   | Lints the code                                          |
| `pnpm check`  | Checks your code for typeerrors, formatting and linting |

When making commits, make sure to follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) guidelines, i.e. prepending the message with `feat:`, `fix:`, `chore:`, `docs:`, etc... You can use `git status` to double check which files have not yet been staged for commit:

```bash
git add <file> && git commit -m "feat/fix/chore/docs: commit message"
```

### When you're done

Check that your code follows the project's style guidelines by running:

```bash
pnpm check
```

Please also make a manual, functional test of your changes.

When all that's done, it's time to file a pull request to upstream:

```bash
gh pr create --web
```

and fill out the title and body appropriately. Again, make sure to follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) guidelines for your title.

## Credits

This documented was inspired by the contributing guidelines for [t3-oss/create-t3-app](https://github.com/t3-oss/create-t3-app).
