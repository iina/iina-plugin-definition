This page contains various technical guides for plugin development.

## Info.json Structure

`Info.json` can contain the following fields.

These fields are required:

- `name`: The name of the plugin.
  It will be displayed in the plugin list in IINA's preferences.
- `version`: The version of the plugin.
  It should be in the format of `major.minor.patch`, such as `1.0.0`.
- `identifier`: The unique identifier of the plugin.
  It should be in the format of reverse domain name, such as `com.example.myplugin`.
- `author`: The author of the plugin. It contains three fields:
  - `name`: The name of the author.
  - `email`: _Optional._ The email address of the author.
  - `url`: _Optional._ The homepage of the author.
- `entry`: The path to the main entry file, relative to the plugin folder.

The following fields are optional:

- `description`: A short description of the plugin.
- `globalEntry`: The path to the global entry file, relative to the plugin folder.
- `preferencesPage` The path to the preferences page file, relative to the plugin folder.
  This HTML page will be displayed in IINA's preferences.
  See [Plugin Preferences](/pages/plugin-preferences) for more details.
- `preferenceDefaults`: The default values of the preferences.
  See [Plugin Preferences](/pages/plugin-preferences) for more details.
- `helpPage`: The path to a help webpage, can be an HTML file in the plugin folder or an external URL.
  This page will be displayed in IINA's preferences.
- `subProviders`: An array of subtitle providers to register.
  See [Subtitle Providers](/pages/subtitle-providers) for more details.
- `sidebarTab`: A dictionary containing the information of the sidebar tab.
  It may have the following fields:
  - `name`: The title of the tab.
- `permissions`: An array of permissions required by the plugin.
  See the [_Plugin Permissions_](#plugin-permissions) section below for more details.
- `allowedDomains` An array of domains that the plugin can access.
  This will be displayed in IINA's preferences and when installing the plugin.
  Typically, you can put `["*"]` here to allow the plugin to access all domains.
- `ghRepo`: The GitHub repository of the plugin, in the format of `username/repo`.
  If specified, IINA will check for updates on GitHub automatically.
- `ghVersion`: An integer that should be incremented every time you publish a new version to GitHub.
  When checking for updates, IINA will compare this number with the latest code on GitHub.

## Plugin Permissions

Plugins should declare the permissions they need in `Info.json`.
When installing a plugin, IINA will display the permissions required by it to the user.
The permissions are listed below:

- `show-osd`: The plugin can show OSD messages.
  This permission is required if the plugin uses the `iina.core.osd()` method.
- `show-alert`: The plugin can show native alert dialogs.
  This permission is required if the plugin uses related methods in the `iina.utils` module.
- `video-overlay`: The plugin can draw on the video overlay.
  This permission is required if the plugin uses the `iina.overlay` module.
- `network-request`: The plugin can access the network.
  This permission is required if the plugin uses the `iina.http` module.
- `file-system`: The plugin can access the file system.
  This permission is required if the plugin uses the `iina.file` module or executes external programs
  using `iina.utils.exec()`.

## Type Definitions

_(Note: If you are using the `iina-plugin` CLI tool to create a plugin,
the type definitions will be automatically installed for you.)_

IINA provides type definitions for TypeScript and JavaScript users.
Add the `iina-plugin-definition` package to your project to get the type definitions.

```sh
npm install --save-dev iina-plugin-definition
```

Sometimes, you may need to update your `tsconfig.json` file to
make sure the type definitions are loaded correctly.
If you don't have a `tsconfig.json` file, create one in the root of your project.
Here is an example:

```
{
  "compilerOptions": {
    "lib": ["es6", "es7", "esnext"],
    "sourceMap": false,
    "target": "es6",
    "module": "es6",
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/iina-plugin-definition"
    ]
  },
  "compileOnSave": false
}
```

Note that we added the `iina-plugin-definition` package to the `typeRoots` field,
and we didn't include `"DOM"` in the `lib` field, because IINA doesn't provide a browser environment.

After doing so, you should be able to see autocomplete suggestions for IINA APIs in your editor.

## Equivalents of Common Browser APIs

Since the plugin code doesn't run in a browser, there is no `window` object,
which is the global context you may be familiar with if you have experience with web development.
As a result, some useful global methods are not available, sush ad `fetch`, `prompt`, and `localStorage`.

For the following important timer methods, IINA provides equivalents, so you can use them directly:

- `setTimeout()` and `clearTimeout()`
- `setInterval()` and `clearInterval()`

IINA usually provides alternatives for other browser APIs as well, such as:

- `fetch()`: Use the `iina.http` module instead
- `prompt()`: Use `iina.utils.ask()` instead
- `localStorage`: Use the `iina.file` module to access the file system
- `console`: Use the `iina.console` module instead.

## JavaScript Module System

When your entry file gets bigger and more complex, you may want to split it into multiple files.
Therefore, you will need a way to import code from other files.
This is usually done by using a module system, such as CommonJS or ES6 modules.
ES6 modules (the `import` and `export` keywords)
are not fully supported by JavaScriptCore, especially on early macOS versions.
Therefore, IINA provides a node-flavor JavaScript module system to help you organize your code.

In your entry file, you can use the `require()` function to import other files:

```js
const { foo } = require("./foo.js");
```

While in other files, you can use the `module.exports` object to export values:

```js
module.exports = {
  foo: "bar",
};
```

However, this module system is very basic and doesn't support any more features.
If you need more flexibility, especially ES6 modules, you can use a bundler, as described below.

## Using Bundlers

You may want to use a bundler to bundle your plugin code into a single file.
Although it requires more work, it can bring you many benefits, such as:

- Using ES6 modules and modern JavaScript features
- Using third-party libraries
- Using the full tech stack of web development to develop ustom user interfaces,
  such as React, Vue, and TypeScript

IINA recommends using [Parcel](https://parceljs.org/) to bundle your plugin code.
Our plugin templates are already configured to work with Parcel,
so you may start using it right away.

_(Note: If you are using the `iina-plugin` CLI tool to create a plugin,
it will automatically install Parcel for you, if you choose to use it.)_

#### Common Workflow

In parcel, you can add targets to your `package.json` file.

```json
{
  "targets": {
    "entry": {
      "distDir": "./dist/",
      "source": "src/index.ts",
      "isLibrary": false
    }
  }
}
```

In the above example, all contents in `src/index.ts` (and all files imported by it)
will be bundled into `dist/index.js`.
You can therefore use `dist/index.js` as the entry file of your plugin.

You can also add more targets for custom user interfaces.
For example, you may want to use React to build a custom UI for your plugin.
In this case, you can add a new target to your `package.json` file:

```json
{
  "targets": {
    "ui": {
      "distDir": "./dist/ui/",
      "source": "src/ui/index.html"
    }
  }
}
```

Where in `src/ui/index.html`, you can import JavaScript files containing your React code.
Then you can load `dist/ui/index.html` to display your custom UI.

## Debugging

Debugging is a critical part of plugin development.
IINA provides a few tools to help you debug your plugin.

#### Reloading

When developing a plugin, you may want to reload it without installing it again.
To do so, you can symlink a plugin folder to `~/Library/Application Support/IINA/Plugins/`.
_The destination must have a `.iinaplugin-dev` suffix._
For example:

```sh
ln -s /path/to/myplugin ~/Library/Application\ Support/com.colliderli.iina/plugins/myplugin.iinaplugin-dev
```

_(Note: If you are using the `iina-plugin` CLI tool to create a plugin,
you can use `iina-plugin link <dir>` to create the symlink.)_

Then you can modify your code (or build your code using a bundler),
then restart IINA to reload the plugin.

For webviews, you may be able to reload the webview by selecting `Reload` in the context menu
without restarting IINA.

#### Log Viewer

Starting from IINA 1.3.2, you can use Window > Log Viewer to view the logs
from all IINA log subsystems.
Upon launch, IINA loads all plugins in the plugin folder, so you may see
a line like `Loading JS plugin from /path/to/plugin` in the log viewer.
Any errors occurred during the loading process will also be displayed here.

Once your plugin is loaded, you should be able to select the log subsystems for your plugin.
The subsystem's name would be `global - <plugin name>` for the global instance and
`player<id> - <plugin name>` for the player instances.
Any logs printed using the `iina.console` module will be displayed in the log viewer.

#### JS Dev Tool

Starting from IINA 1.4.0, you can use Plugin > Developer Tool to run a JavaScript console
in the context of any plugin.
This console is similar to the JavaScript console in web browsers.
In this console, you can access all IINA APIs and the global variables in your plugin.
You can also inspect the return values of IINA APIs and test your code in this console.

#### Safari Web Inspector

If you need more advanced debugging features, you can use the Safari Web Inspector.
To do so, you need to enable the Develop menu in Safari Preferences > Advanced.
Then after launching IINA,
you can select Develop > (your computer name) and select the
JavaScript context you want to debug.
This will open a new window with the Web Inspector.
You will able to add breakpoints, inspect variables, and use the console in this window.
