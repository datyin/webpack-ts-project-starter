# Typescript Project Starter

Get > Code > Build

# Features

- Bundles your code with webpack
- Generates package.json with used packages on build.
- NPM ready
- ESlint & Prettier integrated
- worker_thread ready (needs manual entry setting in webpack.config.js)
- Optional modules included

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
- Minify and Transpile code (Default set for node 12.19)
- Generate package.json with only used dependencies

# Serve

```
npm run dev
```

This command is going to:

- Compile code into development mode
- Run the script
- Watch for changes & repeat the process

# Included (Optional) Modules

| Module | Description                         | Require Worker Thread           |
| ------ | ----------------------------------- | ------------------------------- |
| fetch  | Multithread Async Fetch using Axios | :heavy_check_mark: fetch.worker |
| logger | Simple Colorfull Logger             | :x:                             |
