Welcome to the IINA Plugin API documentation!

If you are new to IINA's plugin system, please read the [Getting Started](/pages/getting-started) page first.
Click the links in the sidebar (or the drop-down menu) to see more tutorials and guides.

Quick links to the documentation of each API module:

#### Control the player

- [`iina.core`](/interfaces/IINA.API.Core): open files, get and set various status, display OSD messages, etc.
- [`iina.event`](/interfaces/IINA.API.Event): listen to IINA and mpv events.
- [`iina.mpv`](/interfaces/IINA.API.MPV): call mpv API, get and set mpv properties, run mpv commands, add hooks.

#### Extend functionalities

- [`iina.menu`](/interfaces/IINA.API.Menu): add menu items.
- [`iina.subtitle`](/interfaces/IINA.API.Subtitle): register custom subtitle downloaders.
- [`iina.playlist`](/interfaces/IINA.API.Playlist): manipulate playlist items, add custom actions to the playlist's context menu.

#### Display custom user interfaces

- [`iina.overlay`](/interfaces/IINA.API.Overlay): display contents on top of the video.
- [`iina.standaloneWindow`](/interfaces/IINA.API.StandaloneWindow): create a standalone window to display additional contents.
- [`iina.sidebar`](/interfaces/IINA.API.SidebarView): display additional contents in the sidebar.

#### Access the system and the network

- [`iina.file`](/interfaces/IINA.API.File): access the file system.
- [`iina.utils`](/interfaces/IINA.API.Utils): run shell commands, present dialogs, etc.
- [`iina.http`](/interfaces/IINA.API.HTTP): make HTTP requests.

#### Control player instances

- [`iina.global`](/interfaces/IINA.API.Global): create and control player instances.

#### Logging and preferences

- [`iina.console`](/interfaces/IINA.API.Console): log messages.
- [`iina.preferences`](/interfaces/IINA.API.Preferences): get and set plugin's preferences.
