Each IINA player core is isolated from other ones, with its own window, mpv instance, and plugin instances. This means that a normal plugin cannot directly communicate with other player cores.
However, sometimes it is useful for a plugin to control multiple player windows, for example, to synchronize the playback of multiple videos. In this case, the plugin can use the Global entry point and utilize the `global` module.

## The global entry point

Similar to the main entry, a plugin can have a global entry point.
You can specify a global entry in the `Info.json` file:

```json
{
  "global": "global.js"
}
```

This file will be loaded when IINA starts, before any player core is initialized.

Internally, IINA creates a "global plugin instance" for the plugin, and loads the global entry script in this instance. The global plugin instance is isolated from the player core instances (which load the main entry script). Since the global plugin instance is not associated with any player core, it cannot use some API modules like `core` and `mpv`. However, it can use the `global` module to control and communicate with the main entry script in other player cores.

![Plugin Architecture](/media/plugin-structure.png)

Note that the global entry script has its own menu and is able to create a standalone window.
Therefore, users can access your menu items and user interface even when no video is playing.
See the documentation of the respective modules for more details.

## Creating player cores

The global entry script can create new player cores using the `global` module:

```js
const player = global.createPlayerInstance({
  url: "/path/to/video.mp4",
  disableWindowAnimation: true,
  disableUI: true,
  enablePlugins: false,
});
```

Here, `disableWindowAnimation` will disable the window resizing animation, and `disableUI` will hide the titlebar and on-screen control (OSC). These are useful to create programmatically controlled player windows for, e.g., presentations and video walls.

## Communication with the player cores

The global entry script can communicate with the main entry scripts in the player cores using
a similar message passing mechanism as the one used in [webviews](/pages/webviews).
The global entry script can send messages to the main entry scripts using `global.postMessage()`:

```js
// send to all players
global.postMessage(null, "message-name", data);

// send to a managed player
const player = global.createPlayerInstance({ ... });
global.postMessage(player, "message-name", data);
```

`global.postMessage()` takes three parameters: the target player, the message name, and the message data.
The target player can be `null` to send the message to all players.
Otherwise, it can be either a number or a string to send the message to a specific player:

- if it's a number, it should be the one returned by `createPlayerInstance()`,
- if it's a string, it should be the player's ID.

If a player (player's main entry script) sent a message to the global entry script,
the global entry script can receive it together with the player's ID using `global.onMessage()`:

```js
global.onMessage("message-name" (data, playerID) => {
  // do something
  global.postMessage(playerID, "reply-message", replyData);
});
```

Therefore, it provides a convenient way for the global entry script to reply to the player.

On the player side, the main entry script can send messages to the global entry script
using `global.postMessage()` and receive messages using `global.onMessage()`:

```js
global.postMessage("message-name", data);

global.onMessage("message-name", (data) => {
  // do something
});
```
