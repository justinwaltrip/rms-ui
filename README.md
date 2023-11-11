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

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
