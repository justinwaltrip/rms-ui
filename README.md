# RMS

Local-first recipe management system inspired by Obsidian. Built with Tauri, React, and Typescript in Vite.

## Development

1. Start Your Dev server

   Now that you have everything set up, you should start your application development server provided by your UI framework or bundler (assuming you're using one, of course).

2. Start Tauri Development Window

   ```bash
   pnpm tauri dev
   ```

   The first time you run this command, the Rust package manager takes several minutes to download and build all the required packages. Since they are cached, subsequent builds are much faster, as only your code needs rebuilding.

   Once Rust has finished building, the webview opens, displaying your web app. You can make changes to your web app, and if your tooling enables it, the webview should update automatically, just like a browser. When you make changes to your Rust files, they are rebuilt automatically, and your app automatically restarts.

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Style Guide

### React Functional Components

- Create a new folder for each component. The folder name should be the name of the component in lowercase, separated by hyphens (ex. `add-filter-dialog`).

  - Inside of the folder, create a file for the component. The file name should be the name of the component in PascalCase, followed by `.tsx`. For example, `AddFilterDialog.tsx`. The only exported item from the file should be the component itself.

  - If the component has any custom styles, create a file for the styles. The file name should be the name of the component in PascalCase, followed by `.module.scss`. For example, `AddFilterDialog.module.scss`.

- If the component has any props, create a type for the props. The name of the type should be the name of the component in PascalCase, followed by `Props`. For example, `AddFilterDialogProps`.

- Use `// #region` and `// #endregion` to group 2 or more related sections of code together. This makes it easier to collapse and expand sections of code in VS Code. Inside of the functional component, the order of the regions should be:

  1. variables - simple `const` declarations
  2. contexts - `useContext` declarations
  3. states - `useState` declarations
  4. effects - `useEffect` declarations
  5. functions - `function` declarations
  6. components - `const` declarations of components

- Use inline functions whenever possible to reduce complexity and improve readability.

- Create JSDoc comments for all functions. The JSDoc comment should be placed directly above the function declaration. The JSDoc comment should include the following:
  - `@param` for each parameter
  - `@returns` for the return value
  - `@throws` for any errors that can be thrown
  - `@example` for an example of how to use the function

## Testing

End-to-end tests are written using the [WebDriver](https://www.w3.org/TR/webdriver/) interface. Tauri supports the WebDriver using the [`tauri-driver`](https://crates.io/crates/tauri-driver), which is not yet supported for macOS. We use the [WebdriverIO](https://webdriver.io/) (WDIO) test automation framework to write and run the tests. We also use the `@tauri-apps/api/mocks` package to mock the Tauri APIs.

To run the test suite,

```bash
pnpm wdio run wdio.conf.json
```

TODO: Follow steps as mentioned [here](https://jonaskruckenberg.github.io/tauri-docs-wip/development/testing.html) to setup the test environment.
