## Windows, Players, and Entry Points

First, let's have a look at the structure of IINA's plugin system.
IINA can have multiple windows opened simultaneously.
Each window is associated with a **player core** (we may simply call it **player**),
which reads the video file and renders it to the window.
Internally, players are separated from each other, which means that they have their own mpv instances and plugin instances, and don't share any data.

A plugin starts from an **entry point**. This is a JavaScript file executed by IINA.
There are two types of entry points: **main entry** and **global entry**.
Each plugin can have at most one main entry and one global entry.

The main entry is executed in a player's context.
The code in the main entry can thus control the player associated with it.
The main entry file is loaded immediately after a player being initialized,
and a **plugin instance** is created.
Therefore, the plugin has multiple instances, one for each player.

On the other hand, the global entry is not associated with any player.
The plugin only has one **global instance**, created for the global entry.
Because it is executed when IINA starts, it can display windows and menus when no video is playing.
It also means that the global entry cannot control any player directly.
However, the global instance can further create managed players, and communite with the main entry instances
in these players, therefore controlling them indirectly.

See the following diagram for a better understanding.

![Plugin Architecture](/media/plugin-structure.png)

An important thing to note is that the entry files, both main and global,
are executed before opening any video file.
You can write initialization code directly in the entry files,
such as [registering subtitle downloaders](/interfaces/IINA.API.Subtitle),
[adding menu items](/interfaces/IINA.API.Menu),
and [creating custom windows](/interfaces/IINA.API.StandaloneWindow),
but if you need to do something at runtime, you should use [event listeners](/interfaces/IINA.API.Event).
For example, if you need to do something when a video file is opened, you should listen to the
`"mpv.file-loaded"` event.

```
Player Created -> Plugin Code executed -> User opens a file -> File starts to play
```

## Struture of a Plugin

A plugin is a folder with an `Info.json` file and some other JavaScript files and resources.
The folder should be named with the extension `.iinaplugin`.
On macOS, such a folder is displayed as a package, but you can also open it as a folder
by right-clicking and selecting "Show Package Contents".

The `Info.json` file contains the metadata of the plugin, such as its name and version,
and most importantly, paths to the entry points.

The simplest plugin contains only the `Info.json` file and a main entry file:

```json
// Info.json
{
  "name": "My Plugin",
  "identifier": "com.example.myplugin",
  "version": "1.0.0",
  "entry": "main.js"
}
```

```js
// main.js
iina.console.log("Hello, world!");
```

The `entry` field here specifies the path to the main entry file, relative to the plugin folder.
It is possible to have a more complex folder structure, especially when you have custom user interfaces,
and uses a bundler like Parcel or Webpack to build the plugin.

For possible fields in `Info.json`, see the _Info.json Structure_ section in
[Development Guide](/pages/dev-guide).

## Writing the Code for Your Plugin

In the above `main.js` example, we used `iina.console.log` to print a message to the console.
All IINA APIs are exposed through the `iina` object.

The methods are grouped into several **modules**, such as `iina.console` and `iina.menu`.
It is recommended to destructure the `iina` object to get the modules you need:

```js
const { console, core, event } = iina;

console.log("Hello, world!");

event.on("mpv.file-loaded", () => {
  core.osd("Starts playing");
});
```

In the above example, we used the `core` module to show an OSD message when a video file is opened.

#### Which version of JavaScript can I use?

JavaScript is a (notoriously) fast-evolving language, and new features are added every year.
IINA uses the `JavaScriptCore` engine, which is the same engine used in Safari.
However, different macOS versions use different versions of `JavaScriptCore`, therefore have
different support for JavaScript features.
IINA 1.3.2's minimum macOS version is 10.11, which means that when running on 10.11, it generally supports
the JavaScript features introduced in ES2015 (ES6) and earlier.
Therefore, when writing a plugin, you should keep in mind that
not all new JavaScript features are supported natively.

- The baseline is that you can use most of the ES6 features.
- You can use tools such as [caniuse](https://caniuse.com/) to check the support of a feature.
  macOS 10.11 corresponds to Safari 9, 10.12 to Safari 10, and so on.
- You can use a transpiler such as Babel to compile your code to ES6.
  This is recommended and typically done when you use a bundler like Webpack or Parcel.
  If you need to use TypeScript or create custom user interfaces with React or Vue,
  you should always be using a bundler.

## The Next Step

Now you have a basic understanding of IINA's plugin system, and you can start writing your own plugin.
Read the [Creating Plugins](/pages/creating-plugins) page to learn how to create a plugin for development.
Please also be sure to read the [Development Guide](/pages/dev-guide) for type definitions, debugging tips, and more.

You can also check out the [API documentation](/modules) to see what you can do with IINA's APIs.
There are several additional toturials available in the sidebar.
