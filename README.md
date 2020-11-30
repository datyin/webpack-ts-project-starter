# Typescript Project Starter

Get > Code > Build

# Features

- Bundles your code with webpack
- Generates package.json with used packages on build.
- NPM ready
- ESlint & Prettier integrated
- worker_thread ready (needs manual entry setting in src/\*.webpack.js)

# Install:

```
npm install
```

This command is going to:

- Install all needed dependencies and devDependencies for your development platform

# Build

```
npm run build
```

This command is going to:

- Bundle used scripts only into one file
- Minify and Transpile code (Default set to installed node version)
- Generate package.json with only used dependencies

# Serve

```
npm run dev
```

This command is going to:

- Compile code into development mode
- Run the script
- Watch for changes & repeat the process
