/**
 * @category IINA API Object
 */
declare namespace IINA {
  /**
   * Represents a rectangle.
   */
  export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  /**
   * Additional configurations for the HTTP request.
   */
  export interface HTTPRequestOption<DataType = Record<string, any>> {
    /**
     * The parameters to be sent in the request body or url.
     */
    params: Record<string, string>;
    /**
     * The HTTP headers to be sent in the request.
     */
    headers: Record<string, string>;
    /**
     * The data to be sent in the request body (mainly for POST).
     */
    data: DataType;
  }

  /**
   * Represents a HTTP response.
   */
  export interface HTTPResponse<DataType = any> {
    /**
     * The response body.
     */
    text: string;
    /**
     * The response data, if any.
     */
    data: any | null;
    /**
     * The HTTP status code.
     */
    statusCode: number;
    /**
     * Reason of the response, e.g. "ok" for 200.
     */
    reason: string;
  }

  /**
   * Represents a menu item.
   */
  export interface MenuItem {
    /**
     * If this item has a submenu, this property contains its subitems.
     */
    readonly items: MenuItem[];
    /**
     * The title of the menu item.
     */
    title: string;
    /**
     * Whether this item is selected (with a checkmark).
     */
    selected: boolean;
    /**
     * Whether this item is enabled.
     */
    enabled: boolean;

    /**
     * The callback function to be called when the item is clicked.
     * @param item The item itself.
     */
    action: (item: MenuItem) => void;
    /**
     * Add a subitem to this menu item.
     * @param item The menu item to be added.
     */
    addSubMenuItem(item: MenuItem): this;
  }

  /**
   * Represents a video, audio or subtitle track.
   * See mpv's `track-list` property for more information.
   */
  export interface Track {
    /**
     * The track ID. Unique for each type of tracks.
     */
    id: number;
    /**
     * The track title.
     */
    title: string | null;
    /**
     * The track title, formatted by IINA for display. Guaranteed to be non-null.
     */
    formattedTitle: string;
    /**
     * The language of the track.
     */
    lang: string | null;
    codec: string | null;
    isDefault: boolean;
    isForced: boolean;
    isSelected: boolean;
    isExternal: boolean;
    demuxW: number | null;
    demuxH: number | null;
    demuxChannelCount: number | null;
    demuxChannels: number | null;
    demuxSamplerate: number | null;
    demuxFPS: number | null;
  }

  /**
   * Represents a chapter.
   */
  export interface Chapter {
    /**
     * The title of the chapter.
     */
    title: string;
    /**
     * The start time of the chapter, in seconds.
     */
    start: number;
  }

  /**
   * Represents a playback history item.
   */
  export interface History {
    /**
     * The name of the file.
     */
    name: string;
    /**
     * The URL of the file.
     */
    url: string;
    /**
     * The date when the file was played.
     */
    date: Date;
    /**
     * The progress of the last playback, in seconds.
     */
    progress: number | null;
    /**
     * The duration of the file, in seconds.
     */
    duration: number;
  }

  /**
   * Represents a recent document (in the File - Open Recent menu).
   */
  export interface RecentDocument {
    /**
     * The name of the file.
     */
    name: string;
    /**
     * The URL of the file.
     */
    url: string;
  }

  /**
   * Represents a playlist item.
   */
  export interface PlaylistItem {
    /**
     * The full path or URL of the file.
     */
    filename: string;
    /**
     * If the item has a title (e.g the playlist is loaded from a M3U file),
     * this property contains the title.
     * For normal local files, this property is always null.
     * Developers should obtain the title from the file path or URL instead.
     * @remarks The title of the current playing item can be obtained from
     * {@link API.StatusAPI.title | core.status.title}.
     */
    title: string | null;
    /**
     * Whether the item is currently playing.
     */
    isPlaying: boolean;
    /**
     * @internal Use {@link IINA.PlaylistItem.isPlaying | isPlaying} instead.
     * See mpv's `playlist-current-pos` property for more information.
     */
    isCurrent: boolean;
  }

  /**
   * @category API Modules
   */
  export namespace API {
    /**
     * The interface of `core.window`. Controls the player window.
     * @seealso {@link API.Core | The Core module}
     */
    interface WindowAPI {
      /**
       * Whether the window is loaded.
       * Typically, the window is loaded when it's going to play the first file.
       * The window must be loaded to display OSDs and overlays.
       * If these APIs are called before the window is loaded, they will be ignored
       * or even raise an error.
       * @seealso Use {@link API.Event.on | event.on("iina.window-loaded")} to listen to the event.
       */
      readonly loaded: boolean;
      /**
       * Whether the window is visible on the screen.
       */
      readonly visible: boolean;
      /**
       * Get the information of all screens in the system.
       */
      readonly screens: { frame: Rect; main: boolean; current: boolean }[];
      /**
       * Get or set the current position and size of the window.
       * @example
       * ```js
       * // get the current frame
       * let frame = core.window.frame;
       * // move the window to (100, 100)
       * core.window.frame = { ...frame, x: 100, y: 100 };
       * ```
       * @seealso Use {@link API.Event.on | event.on("iina.window-moved")} and
       * {@link API.Event.on | event.on("iina.window-resized")} to get notified when the frame changes.
       */
      frame: Rect;
      /**
       * Get or set the current fullscreen state.
       * @example
       * ```js
       * // toggle fullscreen
       * core.window.fullscreen = !core.window.fullscreen;
       * ```
       */
      fullscreen: boolean;
      /**
       * Get or set the current Picture-in-Picture (PIP) state.
       */
      pip: boolean;
      /**
       * Get or set the current always-on-top state.
       * @example
       * ```js
       * // make the window always on top
       * core.window.ontop = true;
       * ```
       */
      ontop: boolean;
      /**
       * Get or set the current miniaturized state.
       * Set to true to miniaturize the window, and false to deminiaturize (restore).
       */
      miniaturized: boolean;
      /**
       * When reading, get the current displayed sidebar name, or `null` if no sidebar is shown.
       * When writing, show the sidebar with the specified name, or hide the sidebar if `null` is given.
       * @example
       * ```js
       * // show the playlist sidebar
       * core.window.sidebar = "playlist";
       * // hide the sidebar
       * core.window.sidebar = null;
       * ```
       * @remarks Note that plugins can add their own sidebars,
       * and the sidebar names are prefixed with `plugin:`.
       * If it's your own plugin, you can use {@link API.SidebarView | sidebar.show} instead.
       */
      sidebar:
        | "audio"
        | "video"
        | "sub"
        | "playlist"
        | "chapters"
        | `plugin:${string}`
        | null;
    }

    /**
     * The interface of `core.status`. Provides information about the current playback.
     * @seealso {@link API.Core | The Core module}
     */
    interface StatusAPI {
      /**
       * Whether the player is paused.
       */
      readonly paused: boolean;
      /**
       * Whether the player is idle (i.e. not playing any file).
       */
      readonly idle: boolean;
      /**
       * The current playback position, in seconds.
       */
      readonly position: number | null;
      /**
       * The duration of the current file, in seconds.
       */
      readonly duration: number | null;
      /**
       * Current playback speed.
       */
      readonly speed: number;
      /**
       * Width of the video.
       */
      readonly videoWidth: number | null;
      /**
       * Height of the video.
       */
      readonly videoHeight: number | null;
      /**
       * Whether the current file is a network resource (not a local file).
       */
      readonly isNetworkResource: boolean;
      /**
       * URL of the current file.
       */
      readonly url: string;
      /**
       * Title of the current file. The title is the "best guess" by IINA based on the filename and metadata.
       */
      readonly title: string;
    }

    /**
     * @internal This is the base interface of {@link API.AudioAPI | AudioAPI},
     * {@link API.VideoAPI | VideoAPI} and {@link API.SubtitleAPI | SubtitleAPI}.
     * @seealso {@link API.Core | The Core module}
     */
    interface TrackAPI {
      /**
       * Get or set the ID of the current track, i.e. can be used to switch tracks.
       * Track IDs are unique for each type of tracks, and can be obtained from {@link API.TrackAPI.tracks | tracks}.
       */
      id: number | null;
      /**
       * Returns a list of all tracks.
       */
      readonly tracks: Track[];
      /**
       * Returns the information of the current track.
       */
      readonly currentTrack: Track;
      /**
       * Load an external track from a URL.
       * @param url The URL or file path of the track.
       * @remarks Equivalent to clicking the corresponding menu items in IINA.
       * Can also be achieved by mpv's `video-add`, `audio-add` and `sub-add` commands,
       * but the IINA version performs other necessary checks.
       */
      loadTrack(url: string);
    }

    /**
     * The interface of `core.audio`. Can be used to control the audio tracks.
     * @seealso {@link API.Core | The Core module}
     */
    interface AudioAPI extends TrackAPI {
      /**
       * Sets the audio delay in seconds.
       * @remarks Equivalent to setting the mpv `audio-delay` property.
       */
      delay: number;
      /**
       * Sets the audio volume. Note that the maxinum value can be set by the user.
       * The maxinum value can be obtained from mpv's `volume-max` property.
       * @remarks Equivalent to setting the mpv `volume` property.
       */
      volume: number;
      /**
       * Sets the audio balance.
       * @remarks Equivalent to setting the mpv `mute` property.
       */
      muted: boolean;
    }

    /**
     * The interface of `core.subtitle`. You can use it to control the subtitle tracks.
     * @seealso {@link API.Core | The Core module}
     */
    interface SubtitleAPI extends TrackAPI {
      /**
       * Get or set the ID of the second subtitle track.
       */
      secondID: number | null;
      /**
       * Get or set the subtitle delay in seconds.
       * @remarks Equivalent to setting the mpv `sub-delay` property.
       */
      delay: number;
    }

    /**
     * The interface of `core.video`. You can use it to control the video tracks.
     */
    interface VideoAPI extends TrackAPI {}

    /**
     * The `Core` module provides methods that control the player's main functions.
     * It also has the following members to control the tracks, the player window, and the player status:
     * - {@link API.AudioAPI | core.audio}
     * - {@link API.VideoAPI | core.video}
     * - {@link API.SubtitleAPI | core.subtitle}
     * - {@link API.WindowAPI | core.window}
     * - {@link API.StatusAPI | core.status}
     *
     * @example
     * ```js
     * // pause the playback
     * core.pause();
     *
     * // display a message (OSD) at the top of the window
     * core.osd("The plugin is running!");
     *
     * // get the names of all subtitle tracks
     * let subtitles = core.subtitle.tracks.map(track => track.title);
     * ```
     * @availableInEntry Main entry only
     * @category API Modules
     */
    export interface Core {
      /**
       * Open a new file in the current player window.
       * @param url The URL or file path of the media.
       */
      open(url: string): void;
      /**
       * Display an On Screen Display (OSD) message at the top of the window.
       * @param message The message to display.
       */
      osd(message: string): void;
      /**
       * Pause the playback.
       */
      pause(): void;
      /**
       * Resume the playback.
       */
      resume(): void;
      /**
       * Stop the playback and close the file.
       */
      stop(): void;
      /**
       * Seek (jump) forward or backward in the current file.
       * @param seconds The number of seconds to seek. Can be negative (backward).
       * @param exact Whether to seek exactly to the given position. If false, the seek will be performed in the nearest keyframe.
       * @remarks Use mpv's `seek` command for advanced seeking.
       * @seealso {@link API.StatusAPI.duration | core.status.duration} for getting the duration of the current file.
       */
      seek(seconds: number, exact: boolean): void;
      /**
       * Seek (jump) to a specific position in the current file.
       * @param seconds The number of seconds to seek to.
       * @remarks Use mpv's `seek` command for advanced seeking.
       * @seealso {@link API.StatusAPI.duration | core.status.duration} for getting the duration of the current file.
       */
      seekTo(seconds: number);
      /**
       * Set the playback speed.
       * @param speed The speed to set. 1.0 is normal speed, 2.0 is twice as fast, 0.5 is half speed, etc.
       * @remarks Equivalent to setting the mpv `speed` property.
       */
      setSpeed(speed: number);
      /**
       * Returns the list of chapters in the current file.
       */
      getChapters(): Chapter[];
      /**
       * Seek to a specific chapter.
       * @param index The index of the chapter to play, starting from 0.
       * The chapter list can be obtained from {@link API.Core.getChapters | getChapters}.
       * @remarks Basically, IINA seeks to the start time of the chapter.
       */
      playChapter(index: number);
      /**
       * Returns the list of entries in the playback history.
       */
      getHistory(): History[];
      /**
       * Returns the list of recently opened files in the system's recent documents list.
       */
      getRecentDocuments(): RecentDocument[];
      /**
       * Returns the version information of IINA and mpv.
       */
      getVersion(): { iina: string; build: string; mpv: string };
      /**
       * See the linked interface's documentation for more details.
       */
      window: WindowAPI;
      /**
       * See the linked interface's documentation for more details.
       */
      status: StatusAPI;
      /**
       * See the linked interface's documentation for more details.
       */
      audio: AudioAPI;
      /**
       * See the linked interface's documentation for more details.
       */
      video: VideoAPI;
      /**
       * See the linked interface's documentation for more details.
       */
      subtitle: SubtitleAPI;
    }

    /**
     * The `MPV` module provides direct access to mpv's API, including properties, commands, and hooks.
     * @remarks Setting a window-related property in mpv, such as `fullscreen`, may also work in IINA.
     * However, it is recommended to use IINA's own API when possible.
     * @seealso Please make sure to check out mpv's documentation before using this module.
     * - mpv's [options](https://mpv.io/manual/stable/#optinons) and [properties](https://mpv.io/manual/stable/#properties).
     *   Most mpv options can be set as properties.
     * - mpv's [commands](https://mpv.io/manual/stable/#list-of-input-commands).
     *
     * For MPV events, use the {@link API.Event | event} module.
     *
     * @availableInEntry Main entry only
     * @category API Modules
     */
    export interface MPV {
      /**
       * Get a property as a boolean (flag).
       * @param name The name of the property.
       * @example
       * ```js
       * // is muted?
       * let muted = mpv.getFlag("mute");
       * ```
       */
      getFlag(name: string): boolean;
      /**
       * Get a property as a number.
       * @param name The name of the property.
       * @remarks Internally, it always reads the double format of the property,
       * i.e. using mpv's `MPV_FORMAT_DOUBLE`, because JavaScript doesn't distinguish between integers and floats.
       * @example
       * ```js
       * // get the raw byte positon in the source stream
       * let pos = mpv.getNumber("stream-pos");
       * ```
       */
      getNumber(name: string): number;
      /**
       * Get a property as a string. Most mpv properties are available as strings.
       * @param name The name of the property.
       * @example
       * ```js
       * // get the pixel format of the current video
       * let pm = mpv.getString("video-params/pixelformat");
       * ```
       */
      getString(name: string): string;
      /**
       * Try to get the property as a native JavaScript object.
       * It's useful for getting dictionaries (e.g. `video-params`) and lists (e.g. `vf`).
       * @param name The name of the property.
       * @example
       * ```js
       * // get the current video's parameters
       * let params = mpv.getNative("video-params");
       * // => { "stereo-in": "mono", "h": 1080, "w": 1920, "chroma-location": "mpeg2/4/h264", ... }
       * ```
       */
      getNative<T>(name: string): T;
      /**
       * Set the value of a property.
       * @param name The name of the property.
       * @param value The value to set.
       * If the value is a JavaScript object, it will be treated as a dictionary and converted to a mpv node.
       */
      set(name: string, value: any): void;
      /**
       * Run a mpv command.
       * @param name The name of the command.
       * @param args The argument list.
       * @example
       * ```js
       * // seek to 00:10, at the nearest keyframe
       * mpv.command("seek", ["10", "absolute+keyframes"]);
       * ```
       */
      command(name: string, args: string[]): void;
      /**
       * Adds a mpv hook.
       * @param name The name of the hook, such as `on_load` or `on_load_fail`.
       * @param priority The priority of the hook, should be an integer. Higher priority hooks are executed first.
       * @param callback The callback function to run when the hook is triggered.
       * If it is an `async` function, the `next` function **must** be called manually when the hook is finished.
       * If it is a normal function, the `next` function should be ignored.
       * The hook callback is considered finished when the function returns.
       * @example
       * ```js
       * // the user opened an unrecognized web URL;
       * // run an external handler (e.g. yt-dlp) to get the actual video URL
       * mpv.addHook("on_load", 50, async (next) => {
       *   // get the current URL
       *   const url = mpv.getString("stream-open-filename");
       *   // run the external parser
       *   const actualURL = await runCustomHandler(url);
       *   // set the actual URL
       *   mpv.set("stream-open-filename", actualURL);
       *   // continue loading the video; MUST be called if the callback is async
       *   next();
       * });
       * ```
       * @seealso mpv's [hook](https://mpv.io/manual/stable/#hooks) API.
       */
      addHook(
        name: string,
        priority: number,
        callback: (
          /**
           * The function to call when the hook is finished, if the callback is async.
           */
          next?: () => void,
        ) => void,
      ): void;
    }

    /**
     * The `Event` module allows listening to mpv and IINA events.
     * Event names should be prefixed with either `iina.` or `mpv.` to specify the source.
     * This module mainly provides two methods, `on` and `off`.
     * The `on` method is used to register a callback function to an event,
     * which will return a unique string ID for the callback.
     * This ID can be used to remove the callback using the `off` method.
     *
     * The callback function may be called with associated data,
     * such as the new file path for the `iina.file-loaded` event.
     * However, most events do not provide any data, and the callback function should get
     * necessary information from the {@link API.MPV | mpv} or the {@link API.Core | core} module.
     *
     * All mpv events can be used here by simply adding `mpv.` before the event name,
     * e.g. `mpv.end-file`.
     * Please refer to mpv's documentation for a list of mpv events.
     * When listenting to mpv property changes, add the `.changed` suffix to the property name,
     * e.g. `mpv.volume.changed`.
     *
     * The IINA events are listed below.
     * @example
     * ```js
     * // show the file's path when playing a new file
     * const eventID = event.on("iina.file-loaded", () => {
     *   core.osd(`Playing ${core.status.url}`);
     * })
     *
     * // remove the listener
     * event.off("iina.file-loaded", eventID);
     *
     * // using the mpv API: show the current volume when it changes
     * event.on("mpv.volume.changed", () => {
     *   core.osd(`Volume: ${mpv.getNumber("volume")}`);
     * });
     * ```
     * @seealso mpv's [list of events](https://mpv.io/manual/stable/#list-of-events).
     * @availableInEntry Main entry only
     * @category API Modules
     */
    export interface Event {
      /**
       * Get notified when the player's window is loaded.
       * The window must be loaded before you can display OSDs and overlays.
       */
      on(event: "iina.window-loaded", callback: () => void): string;
      /**
       * Get notified when the width and/or height of the video has changed,
       * and the player window has been resized accordingly.
       * Typically, this is due to a new file being played, a crop filter is applied, or a video track change.
       * You may respond to video aspect ratio changes here.
       */
      on(
        event: "iina.window-size-adjusted",
        callback: (
          /**
           * The new frame of the player window.
           */
          frame: Rect,
        ) => void,
      ): string;
      /**
       * Get notified when the player window is moved, either by the user or by IINA.
       */
      on(
        event: "iina.window-moved",
        callback: (
          /**
           * The new frame of the player window.
           */
          frame: Rect,
        ) => void,
      ): string;
      /**
       * Get notified when the player window is resized, either by the user or by IINA.
       */
      on(
        event: "iina.window-resized",
        callback: (
          /**
           * The new frame of the player window.
           */
          frame: Rect,
        ) => void,
      ): string;
      /**
       * Get notified when the player window's fullscreen status has changed.
       */
      on(
        event: "iina.window-fs.changed",
        callback: (
          /**
           * The new fullscreen status.
           */
          status: boolean,
        ) => void,
      ): string;
      /**
       * Get notified when the player window is moved to another screen.
       */
      on(event: "iina.window-screen.changed", callback: () => void): string;
      /**
       * Get notified when the player window is minimized.
       */
      on(event: "iina.window-miniaturized", callback: () => void): string;
      /**
       * Get notified when the player window is deminiaturized.
       */
      on(event: "iina.window-deminiaturized", callback: () => void): string;
      /**
       * Get notified when the player window becomes or stops being the main window.
       * This essentially means that the player window is or is not the frontmost window
       * that accepts keyboard and mouse input.
       */
      on(
        event: "iina.window-main.changed",
        callback: (
          /**
           * Whether the window is the main window.
           */
          status: boolean,
        ) => void,
      ): string;
      /**
       * Get notified when the player window is about to close.
       */
      on(event: "iina.window-will-close", callback: () => void): string;
      /**
       * Get notified when the player window is closed.
       */
      on(event: "iina.window-did-close", callback: () => void): string;
      /**
       * Get notified when the player enters or exits music mode (mini player).
       */
      on(
        event: "iina.music-mode.changed",
        callback: (
          /**
           * Whether the player is in music mode.
           */
          status: boolean,
        ) => void,
      ): string;
      /**
       * Get notified when the player enters or exits Picture-in-Picture (PIP) mode.
       */
      on(
        event: "iina.pip.changed",
        callback: (
          /**
           * The new PIP status.
           */
          status: boolean,
        ) => void,
      ): string;
      /**
       * Get notified when a new file is loaded.
       */
      on(
        event: "iina.file-loaded",
        callback: (
          /**
           * The new file's URL.
           */
          url: string,
        ) => void,
      ): string;
      /**
       * Get notified when a new file has started playing.
       */
      on(event: "iina.file-started", callback: () => void): string;
      /**
       * Get notified when the mpv instance is initialized.
       */
      on(event: "iina.mpv-inititalized", callback: () => void): string;
      /**
       * Get notified when the thumbnails of the current video are generated.
       */
      on(event: "iina.thumbnails-ready", callback: () => void): string;
      /**
       * Get notified when the video overlay view for this plugin is loaded.
       * @seealso The {@link API.Overlay | overlay} module.
       */
      on(event: "iina.plugin-overlay-loaded", callback: () => void): string;
      /**
       * Add listener to an mpv event.
       */
      on(event: `mpv.${string}`, callback: () => void): string;

      /**
       * Remove a listener from an event.
       * @param event The event name.
       * @param id The unique string ID returned by the `on` method.
       */
      off(event: string, id: string);
    }

    /**
     * The `Input` module provides methods to capture mouse and keybord events in the player window.
     * Although it can be used to add keyboard shortcuts,
     * it is recommended to use the {@link API.Menu | Menu} module to do so.
     * This module, by providing both the `keyDown`/`mouseDown` and `keyUp`/`mouseUp` listeners,
     * provides more user interaction possibilities; for example, you can implement a "hold to seek" feature.
     *
     * Each listener is associated with a priority. Listeners with higher priority are called first.
     * If the priority `>= PRIORITY_HIGH`, the handler will be called before the default handlers,
     * e.g. mpv key bindings. To be more specific, the listeners are called in the following order:
     * - Listeners with priority `>= PRIORITY_HIGH`
     * - Default handlers, e.g. mpv key bindings
     * - Listeners with priority `< PRIORITY_HIGH`
     *
     * **You should avoid using `PRIORITY_HIGH` unless necessary.**
     * The default priority is always `PRIORITY_LOW`.
     *
     * The event callback should return a boolean value indicating whether the event is handled.
     * If the event is handled, it will not be passed down to other listeners
     * (which might include the default handlers in IINA, therefore overriding the default behavior).
     *
     * In IINA, an input event is sent to the menu bar first, then to the frontmost window.
     * Therefore, under current implementation,
     * if a key input is captured by one of the menu items, it will not be passed down to this module.
     * We may change this behavior in the future, but for now,
     * you should not expect much from the priority system and always use `PRIORIY_LOW` for your listeners.
     *
     * For mouse events, due to the complexity of the underlying implementation,
     * currently it is not possible to detect drag events.
     * For more advanced mouse event handling, the {@link API.Overlay | overlay} module might be helpful.
     *
     * @example
     * ```js
     * // priority is HIGH for this listener, so it will be called before default handlers
     * input.onKeyDown("A", (data) => {
     *   console.log(data);
     *   // doesn't return anything, so the event will be passed down to other handlers
     * }, input.PRIORITY_HIGH)
     *
     * // priority is LOW for this listener, so it will be called after default handlers
     * input.onKeyUp("Alt+a", ({x, y}) => {
     *   console.log(`Alt+a up at ${x},${y}`);
     *   return true;  // stop the event propagation
     * })
     * ```
     *
     * Hold the mouse button to speed up the playback:
     * ```js
     * input.onMouseDown(input.MOUSE, () => { core.setSpeed(2) });
     * input.onMouseUp(input.MOUSE, () => { core.setSpeed(1); });
     * // Reset speed when started dragging.
     * // See the docs for the `onMouseDrag` method for more details.
     * input.onMouseDrag(input.MOUSE, () => { core.setSpeed(1) });
     * ```
     *
     * @availableInEntry Main entry only
     * @category API Modules
     */
    export interface Input {
      MOUSE: string;
      RIGHT_MOUSE: string;
      OTHER_MOUSE: string;

      PRIORITY_LOW: number;
      PRIORITY_HIGH: number;
      /**
       * Convert a mpv key code to a standarized form used in IINA.
       * This method is useful when checking if there is already a registered key binding.
       *
       * @param code the mpv key code.
       * @example input.normalizeKeyCode("Shift+a") // => "A"
       */
      normalizeKeyCode(code: string): string;
      /**
       * Get all registered mpv (and iina) key bindings.
       * @returns A dictionary of key bindings, where the key is the key code and the value is
       * an object with the following properties:
       *   - action: the corresponding mpv or iina command
       *   - key: the key code
       *   - isIINACommand: whether the command is an iina command
       * @example
       * // check if a key binding is already registered
       * const kc = input.normalizeKeyCode("Shift+Alt+X")
       * if (input.getAllKeyBindings()[kc]) {
       *   // alert the user: the key binding is already registered
       * }
       */
      getAllKeyBindings(): Record<
        string,
        { key: string; action: string; isIINACommand: string }
      >;
      /**
       * Listen to a key down event.
       * @param button The key (or key combination) to listen to. It should be a valid mpv key code.
       * @param callback To remove the listener, pass `null` to this parameter.
       * @param priority The priority of the handler. Higher priority handlers are called first.
       */
      onKeyDown(
        button: string,
        /**
         * @returns Whether to stop the event propagation.
         * If `true`, the event will not be passed down to other handlers.
         */
        callback: (
          /**
           * The data associated with the event.
           */
          data: {
            /**
             * The x coordinate of the current mouse cursor, relative to the player window.
             */
            x: number;
            /**
             * The y coordinate of the current mouse cursor, relative to the player window.
             */
            y: number;
            /**
             * Whether the event is a repeat event (by holding down the key).
             */
            isRepeat: boolean;
          },
        ) => boolean,
        priority?: number,
      ): string;
      /**
       * Listen to a key up event.
       * @param button The key (or key combination) to listen to. It should be a valid mpv key code.
       * @param callback To remove the listener, pass `null` to this parameter.
       * @param priority The priority of the handler. Higher priority handlers are called first.
       */
      onKeyUp(
        button: string,
        /**
         * @returns Whether to stop the event propagation.
         * If `true`, the event will not be passed down to other handlers.
         */
        callback: (
          /**
           * The data associated with the event.
           */
          data: {
            /**
             * The x coordinate of the current mouse cursor, relative to the player window.
             */
            x: number;
            /**
             * The y coordinate of the current mouse cursor, relative to the player window.
             */
            y: number;
            /**
             * Whether the event is a repeat event (by holding down the key).
             */
            isRepeat: boolean;
          },
        ) => boolean,
        priority?: number,
      ): string;
      /**
       * Listen to a mouse up event.
       *
       * Note that if you return `true` in the callback,
       * **both the default single-click and double-click actions** in IINA will stop working.
       * You are responsible for handling them on your own.
       * @param button The mouse button. Should be one of `input.MOUSE`, `input.RIGHT_MOUSE`, and `input.OTHER_MOUSE`.
       * @param callback To remove the listener, pass `null` to this parameter.
       * @param priority The priority of the handler. Higher priority handlers are called first.
       */
      onMouseUp(
        button: string,
        /**
         * @returns Whether to stop the event propagation.
         * If `true`, the event will not be passed down to other handlers.
         */
        callback: (
          /**
           * The data associated with the event.
           */
          data: {
            /**
             * The x coordinate of the current mouse cursor, relative to the player window.
             */
            x: number;
            /**
             * The y coordinate of the current mouse cursor, relative to the player window.
             */
            y: number;
          },
        ) => boolean,
        priority?: number,
      ): string;
      /**
       * Listen to a mouse down event.
       * @param button The mouse button. Should be one of `input.MOUSE`, `input.RIGHT_MOUSE`, and `input.OTHER_MOUSE`.
       * @param callback To remove the listener, pass `null` to this parameter.
       * @param priority The priority of the handler. Higher priority handlers are called first.
       */
      onMouseDown(
        button: string,
        /**
         * @returns Whether to stop the event propagation.
         * If `true`, the event will not be passed down to other handlers.
         */
        callback: (
          /**
           * The data associated with the event.
           */
          data: {
            /**
             * The x coordinate of the current mouse cursor, relative to the player window.
             */
            x: number;
            /**
             * The y coordinate of the current mouse cursor, relative to the player window.
             */
            y: number;
          },
        ) => boolean,
        priority?: number,
      ): string;
      /**
       * Listen to a mouse drag event. Works for the left mouse button only.
       * The sole purpose of this method is to allow the plugin to know when a drag event is initiated
       * while the mouse button is hold down. If the user started dragging,
       * the plugin should not perform any action to interfere with the default dragging behavior.
       * In short, if you need to do something _while the mouse button is hold down_,
       * listen to both `mouseDown` and `mouseDrag` events, and cancel your action when either of them fires.
       * @param button The mouse button. Should always be `input.MOUSE`.
       * @param callback To remove the listener, pass `null` to this parameter.
       * @param priority The priority of the handler, however it has no effect.
       * There is no way to override the default dragging behavior in IINA.
       * Should always be `PRIORITY_LOW`.
       */
      onMouseDrag(
        button: typeof iina.input.MOUSE,
        /**
         * @returns Whether to stop the event propagation, but it has no effect.
         * Should always return `false`.
         */
        callback: (data: { x: number; y: number }) => boolean,
        priority?: number,
      ): string;
    }

    export interface HTTPXMLRPC {
      /**
       * Call a XML-RPC method.
       * @param method The method name
       * @param args The arguments
       */
      call<T = any>(method: string, args: any[]): Promise<T>;
    }

    /**
     * The `HTTP` module provides a simple interface to make HTTP requests.
     * It also provides a XML-RPC client and a `download` function which can be used to
     * download files to user's disk.
     * @example
     * ```js
     * // print the source of IINA's homepage
     * const res = await http.get("https://iina.io");
     * console.log(res.text);
     * ```
     * @availableInEntry Main and Global
     * @category API Modules
     */
    export interface HTTP {
      /**
       * Send an HTTP GET request.
       * @param options The options for the request, including headers and parameters.
       * @example
       * ```js
       * http.get("https://iina.io", { headers: { "User-Agent": "IINA" } });
       * ```
       */
      get<ReqData = Record<string, any>, ResData = any>(
        url: string,
        options: HTTPRequestOption<ReqData>,
      ): Promise<HTTPResponse<ResData>>;
      /**
       * Send an HTTP POST request.
       * @param options The options for the request, including headers and parameters.
       */
      post<ReqData = Record<string, any>, ResData = any>(
        url: string,
        options: HTTPRequestOption<ReqData>,
      ): Promise<HTTPResponse<ResData>>;
      /**
       * Send an HTTP PUT request.
       * @param options The options for the request, including headers and parameters.
       */
      put<ReqData = Record<string, any>, ResData = any>(
        url: string,
        options: HTTPRequestOption<ReqData>,
      ): Promise<HTTPResponse<ResData>>;
      /**
       * Send an HTTP PATCH request.
       * @param options The options for the request, including headers and parameters.
       */
      patch<ReqData = Record<string, any>, ResData = any>(
        url: string,
        options: HTTPRequestOption<ReqData>,
      ): Promise<HTTPResponse<ResData>>;
      /**
       * Send an HTTP DELETE request.
       * @param options The options for the request, including headers and parameters.
       */
      delete<ReqData = Record<string, any>, ResData = any>(
        url: string,
        options: HTTPRequestOption<ReqData>,
      ): Promise<HTTPResponse<ResData>>;
      /**
       * Start a XML-RPC client.
       * @param location The XML-RPC endpoint URL.
       */
      xmlrpc(location: string): HTTPXMLRPC;
      /**
       * Download a file to user's local file system.
       * @param url The URL of the file to download.
       * @param dest The destination path, including the file name.
       * The path follows IINA plugin API's file path convention;
       * see the {@link API.File | file} module for more information.
       * The `file-system` permission is required in `Info.json` if the destination is outside the plugin's sandbox.
       * @param options The options for the request, including headers and parameters.
       * Additionally, you can specify the HTTP method to use.
       * @example
       * ```js
       * // download a file to the plugin's data folder
       * await http.download("https://example.com/file.zip", "@data/file.zip");
       * ```
       */
      download(
        url: string,
        dest: string,
        options?: HTTPRequestOption & { method: string },
      ): Promise<undefined>;
    }

    /**
     * The `WebSocket` module provides a simple interface to create local WebSocket servers,
     * therefore enabling the plugin to communicate with other applications.
     * **It is only available on macOS 10.15 or later.**
     *
     * Currently, TLS (thus the `wss://` protocol) is not supported.
     * When connecting to the server, a client should use the `ws://` protocol.
     *
     * @example
     * ```js
     * ws.createServer({ port: 10010 });
     * ws.onStateUpdate((s, err) => {
     *   if (s == "failed") {
     *     console.log(err);
     *   }
     * })
     *
     * ws.onNewConnection(conn => console.log("new connection"));
     * ws.onConnectionStateUpdate((conn, s) => console.log(conn + ": " + s));
     * ws.onMessage((conn, m) => {
     *   console.log(`Message from ${conn}: ${m.text()}`);
     *   ws.sendText(conn, "Received!");
     * )
     *
     * ws.startServer();
     * ```
     *
     * @availableInEntry Main and Global
     */
    export interface WebSocket {
      /**
       * Create a WebSocket server.
       * @param options The options for the server.
       * @throws If the option is invalid, an error will be thrown.
       */
      createServer(options: Partial<{ port: number }>): void;
      /**
       * Start the WebSocket server. Must be called after `createServer()`.
       * You should setup state update handlers before calling this method,
       * since some errors (e.g. port already in use) may occur **after** starting the server
       * and will be reported through a state update.
       *
       * @throws If the server is not in the correct state, an error will be thrown.
       */
      startServer(): void;
      /**
       * Handle the server's state update.
       * You should respond properly to the "failed" or "cancelled" state.
       * The server will be removed if the state is "failed" or "cancelled",
       * and you must call `createServer()` and `startServer()` again to create a new one.
       *
       * It is possible that you receive a "failed" state immediately after calling `startServer()`,
       * which indicates that an error occurred when starting the server.
       * @param callback The callback function.
       */
      onStateUpdate(
        callback: (
          /**
           * The server's new state.
           */
          state: "setup" | "ready" | "waiting" | "failed" | "cancelled",
          /**
           * The error if the state is `failed` or `waiting`.
           */
          error?: { message: string; description: string },
        ) => void,
      ): void;
      /**
       * Handle a new connection to the server.
       * @param callback The callback function.
       */
      onNewConnection(
        callback: (
          /**
           * An unique ID for this connection.
           */
          conn: string,
          /**
           * The information of the client.
           */
          info: { path: string },
        ) => void,
      ): void;
      /**
       * Handle a connection's state change.
       * You should respond properly to the "failed" or "cancelled" state,
       * e.g. remove the connection ID from your cached list.
       * @param callback The callback function.
       */
      onConnectionStateUpdate(
        callback: (
          /**
           * The connection ID.
           */
          conn: string,
          /**
           * The connection's new state.
           */
          state:
            | "setup"
            | "preparing"
            | "ready"
            | "waiting"
            | "failed"
            | "cancelled",
          /**
           * The error if the state is `failed` or `waiting`.
           */
          error?: { message: string; description: string },
        ) => void,
      ): void;
      /**
       * Handle a message from a connection.
       */
      onMessage(
        callback: (
          /**
           * The connection ID.
           */
          conn: string,
          /**
           * The message content.
           */
          message: { data: () => Uint8Array; text: () => string },
        ) => void,
      ): void;
      /**
       * Send a message to a connection. The message will be encoded as UTF-8 and sent as binary data.
       * @param conn The connection ID.
       * @param text The text to send.
       * @returns "no_connection" if the connection does not exist, "success" if the message is sent successfully.
       * @throws Any error occurred when sending the message.
       */
      sendText(
        conn: string,
        text: string,
      ): Promise<"no_connection" | "success">;
    }

    /**
     * The `Console` module outputs messages to IINA's log system.
     * The log can be found in Console.app or Xcode's console (if you are running a debug build from Xcode);
     * However, it is recommended to use IINA's Log Window to view the logs conveniently.
     * Furthermore, the JS DevTool provided under Plugin - Developer Tool provides an interactive console.
     *
     * The log is also written to the log files, if the user has enabled logging.
     * Therefore, it is recommended to use this module to output debug messages and
     * ask users to provide the log files when reporting bugs.
     *
     * @availableInEntry Main and Global
     * @category API Modules
     */
    export interface Console {
      /**
       * Log to IINA's log system with the `debug` log level.
       * @param message The message to log. It will be converted to a string if it is not a string.
       */
      log(...message: any[]): void;
      /**
       * Log to IINA's log system with the `warning` log level.
       * @param message The message to log. It will be converted to a string if it is not a string.
       */
      warn(message: any): void;
      /**
       * Log to IINA's log system with the `error` log level.
       * @param message The message to log. It will be converted to a string if it is not a string.
       */
      error(message: any): void;
    }

    /**
     * The `Menu` module enables developers to add items to IINA's Plugin menu.
     * An item can be a simple menu item, or a submenu item with subitems.
     *
     * @example
     * ```js
     * // create a menu to choose subtitle tracks
     * const subTracksMenu = menu.item("Subtitle Track");
     *
     * // add a submenu item for each track
     * for (const track of core.subtitle.tracks) {
     *   subTracksMenu.addSubmenuItem(
     *     menu.item(
     *       track.title,
     *       // when clicked, set the subtitle track
     *       () => { core.subtitle.id = track.id },
     *       // show checkmark if the track is currently selected
     *       { selected: track.id === core.subtitle.id }
     *     )
     *   );
     * }
     * // add the menu to IINA's Plugin menu
     * menu.addItem(subTracksMenu);
     * ```
     *
     * @availableInEntry Main and Global.
     * However, the two entry points have separate sets of menu items.
     * Menu items created in the Global entry point are available all the time,
     * while menu items created in the Main entry point are only available when the associated window is focused.
     * Global menu items are displayed above the Main menu items.
     * The order of the plugin menu items is illustrated below:
     *
     * ```
     * ------------------------------
     * Plugin 1 - Global menu item 1
     * Plugin 1 - Global menu item 2
     * Plugin 1 - Main menu item 1  ─┬──► Available when the window is focused
     * Plugin 1 - Main menu item 2  ─┘
     * ------------------------------
     * Plugin 2 - Global menu item 1
     * ...
     * ```
     * @category API Modules
     */
    export interface Menu {
      /**
       * Creates a new menu item.
       * @param title The title of the menu item.
       * @param action The callback function to be called when the item is clicked.
       * Pass `null` when no action is needed.
       * @param options Additional options for the menu item.
       * - `enabled`: Whether the item is enabled. Defaults to `true`.
       * - `selected`: Whether the item is selected (has checkmark). Defaults to `false`.
       * - `keyBinding`: The key binding for the item, in mpv's [key binding format](https://mpv.io/manual/stable/#key-names).
       * @remarks This method does not add the item to the menu.
       * Please use {@link Menu.addItem | addItem} after creating the item.
       */
      item(
        title: string,
        action?: () => void | null,
        options?: Partial<{
          enabled: boolean;
          selected: boolean;
          keyBinding: string;
        }>,
      ): MenuItem;
      /**
       * Creates a separator menu item.
       */
      separator(): MenuItem;
      /**
       * Adds a menu item to IINA's Plugin menu.
       * @param item The menu item to add.
       */
      addItem(item: MenuItem): void;
      /**
       * List all menu items for this plugin.
       */
      items(): MenuItem[];
      /**
       * Remove a menu item from IINA's Plugin menu.
       * @param index The index of the menu item to remove, starting from 0.
       */
      removeAt(index: number): void;
      /**
       * Remove all menu items for this plugin.
       */
      removeAllItems(): void;
      /**
       * Refresh the Plugin menu.
       */
      forceUpdate(): void;
    }

    /**
     * The `Overlay` module provides a way to render custom contents on top of the video,
     * which can be used to display lyrics, statistics, live comments, etc.
     * The overlay is essentially a web view, therefore you can use HTML, CSS,
     * and advanced techniques like WebGL to render the contents.
     *
     * Two modes are provided to load the overlay contents:
     * - "Simple Mode": activated by calling {@link Overlay.simpleMode | overlay.simpleMode()}.
     *   In this mode, you directly set the HTML and CSS contents of the overlay using
     *   {@link Overlay.setContent | overlay.setContent()} and {@link Overlay.setStyle | overlay.setStyle()}.
     * - Loading a HTML page: activated by calling {@link Overlay.loadFile | overlay.loadFile()}.
     *   The HTML file should contain the CSS and JavaScript code to render the contents.
     *
     * When activating either mode, the previous mode will be deactivated and the overlay will be cleared.
     *
     * As a web view, the overlay has its own JavaScript context, which cannot access the IINA API directly.
     * It can only communicate with the plugin script via `iina.postMessage` and `iina.onMessage` to exchange data.
     * See [API in Web Views](/pages/webviews) for more information.
     *
     * @example
     * ```js
     * // simple mode
     * overlay.simpleMode();
     * overlay.setContent(`<p>Hello World</p>`);
     * overlay.setStyle(`p { color: red; }`);
     * overlay.show();
     *
     * // load a HTML file
     * overlay.loadFile("/path/to/overlay.html");
     * overlay.show();
     * ```
     * @availableInEntry Main entry only
     * @category API Modules
     */
    export interface Overlay {
      /**
       * Show the overlay. The overlay is hidden by default and you need to call this method to show it.
       */
      show(): void;
      /**
       * Hide the overlay.
       */
      hide(): void;
      /**
       * Set the opacity of the overlay.
       * @param opacity The opacity of the overlay, from 0 to 1.
       */
      setOpacity(opacity: number): void;
      /**
       * Indicate whether the overlay accepts input events.
       * If set to `true`, mouse events will be passed to the overlay,
       * but only for the HTML elements with the `data-clickable` attribute.
       * In this case, buttons will become clickable and input fields will become editable.
       * See [API in Web Views](/pages/webviews) for more information.
       *
       * ```html
       * <button data-clickable>Click Me</button>
       * <input type="text" data-clickable>
       * ```
       *
       * @param clickable Whether the overlay is clickable.
       */
      setClickable(clickable: boolean): void;
      /**
       * Clear the overlay contents and load a HTML file into the overlay.
       * The HTML file should contain the CSS and JavaScript code to render the contents.
       * It is possible to put the JavaScript code in a separate file and load it using a `<script>` tag.
       * The webpage can communicate with the Internet using standard methods like `fetch`,
       * but it cannot access the IINA API directly.
       * It should use `iina.postMessage` and `iina.onMessage` to exchange data with the plugin script.
       * See [API in Web Views](/pages/webviews) for more information.
       * @param path The path to the HTML file, related to the plugin root directory.
       */
      loadFile(path: string): void;
      /**
       * Clear the overlay contents and activate the "Simple Mode".
       * In the simple mode, you directly set the HTML and CSS contents of the overlay from the plugin script.
       */
      simpleMode(): void;
      /**
       * (Simple Mode Only)
       * Set the CSS style for the overlay. The CSS string will be put into a `<style>` tag at the end of `<head>`.
       * The suggested usage is to call `setStyle` once when activating the simple mode,
       * and then use `setContent` (probably multiple times) to update the contents.
       *
       * ```html
       * <head>
       *    ...
       *    <style> [inserted here] </style>
       * </head>
       * ```
       * An error will be raised if the overlay is not in simple mode.
       * @param style The CSS string.
       */
      setStyle(style: string): void;
      /**
       * (Simple Mode Only)
       * Set the HTML contents for the overlay. The HTML string will be put into a `<div>` tag inside `<body>`,
       * with class `content`.
       *
       * ```html
       * <body>
       *    <div class="content"> [inserted here] </div>
       * </body>
       * ```
       * An error will be raised if the overlay is not in simple mode.
       * @param content The HTML string.
       */
      setContent(content: string): void;
      /**
       * Post a message to the overlay webview.
       * The overlay webview also has two methods, `iina.postMessage` and `iina.onMessage`, to exchange data with the plugin script.
       * See [API in Web Views](/pages/webviews) for more information.
       * @param name The message name.
       * @param data The message data.
       */
      postMessage(name: string, data: any): void;
      /**
       * Register a listener for messages posted by the overlay webview.
       * The overlay webview also has two methods, `iina.postMessage` and `iina.onMessage`, to exchange data with the plugin script.
       * See [API in Web Views](/pages/webviews) for more information.
       * @param name The message name.
       * @param callback The callback to be called when a message with the given name is received.
       */
      onMessage(
        name: string,
        callback: (
          /**
           * The message data, posted by the JS script inside the overlay webview.
           */
          data: any,
        ) => void,
      ): void;
    }

    /**
     * The `Playlist` module provides methods to manipulate the playlist
     * and add custom menu items to the playlist context menu.
     *
     * @availableInEntry Main entry only
     * @category API Modules
     */
    export interface Playlist {
      /**
       * Get all items in the playlist.
       */
      list(): PlaylistItem[];
      /**
       * Get the number of items in the playlist.
       */
      count(): number;
      /**
       * Add an item to the playlist.
       * @param url The URL of the item.
       * @param at The index to insert the item. If not specified, the item will be appended to the end of the playlist.
       * @example
       * ```js
       * playlist.add("https://example.com/video.mp4", 0 /* insert at the beginning * );
       * ```
       */
      add(url: string, at?: number): PlaylistItem;
      /**
       * Remove an item from the playlist.
       * @param index The index of the item to remove.
       */
      remove(index: number): PlaylistItem;
      /**
       * Move an item in the playlist.
       * @param index The index of the item to move.
       * @param to The destination index.
       */
      move(index: number, to: number): PlaylistItem;
      /**
       * Play an item in the playlist.
       * @param index The index of the item to play.
       */
      play(index: number): void;
      /**
       * Play the next item in the playlist.
       */
      playNext(): void;
      /**
       * Play the previous item in the playlist.
       */
      playPrevious(): void;
      /**
       * Provide a menu builder function to add custom menu items to the playlist context menu.
       * When the user selects one or more items in the playlist and right-clicks on them,
       * the menu builder function will be called with the selected items as an argument.
       * It should return an array of menu items, which will be inserted into the context menu.
       * @param builder The menu builder function.
       *
       * @example
       * ```js
       * // trash the selected items
       * playlist.registerMenuBuilder(entries => [
       *   menu.item(`Trash these ${entries.length} files`, () => {
       *     for (const entry of entries) {
       *        file.trash(entry.filename);
       *     }
       *   }),
       * ]);
       * ```
       */
      registerMenuBuilder(
        builder: (
          /**
           * The user-selected playlist items.
           */
          entries: PlaylistItem[],
        ) => MenuItem[],
      ): void;
    }

    /**
     * The `Utils` module provides methods to resolve paths, execute external programs and show system dialogs.
     * @availableInEntry Main and Global entry
     * @category API Modules
     */
    /**
     * The `Utils` interface provides utility methods for various operations such as file manipulation, executing external programs, and interacting with the system.
     */
    export interface Utils {
      /**
       * The error code returned by `utils.exec` when the executable file is not found.
       */
      ERROR_BINARY_NOT_FOUND: -1;
      /**
       * The error code returned by `utils.exec` when the executable file is found but cannot be executed.
       */
      ERROR_RUNTIME: -2;
      /**
       * Check if a binary file exists in the system PATH, or a file exists at the given path.
       * This method can be used before `utils.exec` to check if the executable file exists.
       * @param file The binary name, or the path to the file.
       *
       * @example
       * ```js
       * // check if ffmpeg exists in PATH
       * utils.fileInPath("ffmpeg")
       *
       * // check if a ffmpeg exists in the plugin's data directory
       * utils.fileInPath("@data/bin/ffmpeg")
       * ```
       */
      fileInPath(file: string): boolean;
      /**
       * Resolve a path by expanding special path prefixes like `@data` to the actual system directory.
       * It also handles tilde expansion.
       * @param path The path to resolve.
       */
      resolvePath(path: string): string;
      /**
       * Execute an external program.
       * @param file The binary name (if it's in the system PATH), or the path to the executable file.
       * It's recommended to use `utils.fileInPath` to check if the executable file exists.
       * @param args The arguments to pass to the executable file.
       * @param cwd The working directory of the executable file.
       * @param stdoutHook Set up a hook to receive the streaming standard output of the executable file.
       * @param stderrHook Set up a hook to receive the streaming standard error of the executable file.
       * @returns A promise that resolves to an object containing the exit status, standard output, and standard error output.
       *
       * @remarks Permission "file-system" must be present in Info.json to use this method.
       * @example
       * ```js
       * // execute ffmpeg
       * const { status, stdout, stderr } = await utils.exec("ffmpeg", [
       *   "-i", "input.mp4",
       *   "-vf", "scale=1280:720",
       *   "output.mp4",
       * ]);
       * ```
       */
      exec(
        file: string,
        args: string[],
        cwd?: string | null,
        stdoutHook?:
          | ((
              /**
               * The newly available standard output data.
               */
              data: string,
            ) => void)
          | null,
        stderrHook?:
          | ((
              /**
               * The newly available standard error data.
               */
              data: string,
            ) => void)
          | null,
      ): Promise<{ status: number; stdout: string; stderr: string }>;
      /**
       * Show a system dialog with "OK" and "Cancel" buttons.
       * Can be used to ask for confirmation or simply show a message to the user.
       * @param title The content of the dialog.
       * @returns `true` if the user clicks "OK", `false` if the user clicks "Cancel".
       *
       * @example
       * ```js
       * const yes = utils.ask("Are you sure you want to delete these files?");
       *
       * utils.ask("This is a message");
       * ```
       */
      ask(title: string): boolean;
      /**
       * Show a system dialog with an input field to prompt the user for a string input.
       * @param title The title of the dialog.
       *
       * @example
       * ```js
       * // download a file to the plugin's data folder with user-input filename
       * const fn = utils.prompt("Please enter the file name");
       * http.download("https://example.com/test.zip", `@data/downloads/${fn}`);
       * ```
       */
      prompt(title: string): string | undefined;
      /**
       * Show a system file chooser panel.
       * @param title The title of the panel.
       * @param options Optional options.
       * - `chooseDir`: choose a directory instead of a file.
       * - `allowedFileTypes`: specify a list of available file extensions.
       *   Files without these extensions will be disabled in the panel.
       * @returns A Promise that resolves to the full path of the chosen file or directory.
       *
       * @example
       * ```js
       * const path = await utils.chooseFile("Please select a subtitle file", {
       *   allowedFileTypes: ["ass", "srt"],
       * });
       * core.subtitle.loadTrack(path);
       */
      chooseFile(
        title: string,
        options: Partial<{
          chooseDir: boolean;
          allowedFileTypes: string[];
        }>,
      ): Promise<string>;
      /**
       * Write a password to the system keychain.
       * Can be used to store other sensitive information such as JWT tokens.
       * @param service The service name. It will be prefixed by the plugin's identifier.
       * @param name The username.
       * @param password The password to write.
       * @returns `true` if the password is written successfully, `false` otherwise.
       */
      keyChainWrite(service: string, name: string, password: string): boolean;
      /**
       * Read a password corresponding to the username from the system keychain.
       * @param service The service name.
       * @param name The usaername.
       * @returns The password if read successfully, `false` otherwise.
       */
      keyChainRead(service: string, name: string): string | false;
      /**
       * Open a URL in the system. It can be a http or https link, or a file path.
       * When it is a web URL, the default browser will be used to open the link.
       * When it is a file path, magic variables like `@data` will be resolved, and the file will be revealed in Finder.
       * @param url The URL to open.
       * @returns `true` if the URL is opened successfully, `false` otherwise.
       */
      open(url: string): boolean;
    }

    /**
     * The `Preference` module provides a user settings system.
     * The user can set preferences of the plugin in IINA's Preference (Settings) window,
     * which can be read by the plugin.
     * See [Plugin Preferences](/pages/plugin-preferences) for details.
     * @category API Modules
     * @availableInEntry Main and Global entry
     */
    export interface Preferences {
      /**
       * Get the preference value corresponding to the key.
       * @param key The preference key.
       */
      get(key: string): any;
      /**
       * Set the value for a preference key.
       * @param key The preference key.
       * @param value The value.
       */
      set(key: string, value: any): void;
      /**
       * Persist the preference changes to disk.
       * By default, the preferences are persisted to disk only when
       * the plugin's preferences page (in IINA's Settings window) is closed.
       * Therefore, it's recommended to call this method after invoking `set` programmatically.
       */
      sync(): void;
    }

    /**
     * A subtitle item contains an arbitrary data object.
     * An optional descriptor function can be used to override the default one.
     */
    export interface SubtitleItem<T> {
      data: T;
      desc?: SubtitleItemDescriptor<T>;
    }

    /**
     * Specify how IINA should display the subtitle item for user's selection.
     */
    export type SubtitleItemDescriptor<T> = (item: SubtitleItem<T>) => {
      /**
       * The main text of the item.
       */
      name: string;
      /**
       * The left secondary text of the item.
       */
      left: string;
      /**
       * The right secondary text of the item.
       */
      right: string;
    };

    /**
     * A subtitle provider project. It has three properties:
     * - `search`: an async function that searches for subtitles and returns array of subtitle items.
     * - `description`: an optional function that returns a descriptor object for the subtitle items.
     * - `download`: an async function that downloads the subtitle file and returns an array of paths to the downloaded files.
     * See [Subtitle Provider](/pages/subtitle-providers) for details.
     */
    export interface SubtitleProvider<T> {
      search(): Promise<SubtitleItem<T>[]> | Subtitle["CUSTOM_IMPLEMENTATION"];
      description?(): SubtitleItemDescriptor<T>;
      download(item: SubtitleItem<T>): Promise<string[]>;
    }

    /**
     * The `Subtitle` module provides a way to register custom subtitle downloaers that
     * integrates into IINA's user interface.
     * See [Subtitle Provider](/pages/subtitle-providers) for details.
     * @category API Modules
     */
    export interface Subtitle {
      /**
       * The subtitle provider's `search` function can return this to indicate that the provider
       * will present the search result in a custom way and handle the download itself.
       */
      CUSTOM_IMPLEMENTATION: string;
      /**
       * Creates a subtitle item with associated data, and a descriptor object.
       * @param data The assiciated data of type `T`.
       * @param desc Descriptor of the assiciated data, which determines how the data should be
       * displayed in IINA's interface.
       * Nornally, the descriptor is set globally by the subtitle provider.
       *
       * @example
       * ```js
       * // the associated data can be any type;
       * // the descriptor is used to display the data in IINA's UI
       * const item = subtitle.item({
       *   name: "Subtitle Name",
       *   language: "English",
       *   rating: 4.5,
       *   downloads: 1000
       * });
       * ```
       */
      item<T>(data: T, desc?: SubtitleItemDescriptor<T>): SubtitleItem<T>;
      /**
       * Register a subtitle source provider. If the provider is already registered,
       * it will be replaced with the new one.
       * @param id A unique ID of the provider.
       * @param provider The `SubtitleProvider` with assiciated subtitle data type `T`.
       * See [Subtitle Providers](/pages/subtitle-providers) for details.
       *
       * @example
       * ```js
       * subtitle.registerProvider("my-provider", {
       *   search: async () => {
       *     // search for subtitles
       *     const results = await searchSubtitles(core.status.title);
       *     // return an array of subtitle items
       *     return results.map(r => subtitle.item(r));
       *   },
       *   description: (item) => {
       *     // return description for this subtitle item
       *   },
       *   download: async (item) => {
       *     // download the subtitle files for this subtitle item
       *     const paths = await downloadSubtitle(item.data);
       *     return paths;
       *   },
       * });
       * ```
       */
      registerProvider<T>(id: string, provider: SubtitleProvider<T>): void;
    }

    /**
     * The `StandaloneWindow` module provides a way to create a separate window to display custom content.
     * You are able to control a full-sized webview inside the window, therefore you can use HTML, CSS,
     * and advanced techniques like WebGL to render the contents.
     *
     * Two modes are provided to load the window contents:
     * - "Simple Mode": activated by calling {@link StandaloneWindow.simpleMode | standaloneWindow.simpleMode()}.
     *   In this mode, you directly set the HTML and CSS contents of the overlay using
     *   {@link StandaloneWindow.setContent | standaloneWindow.setContent()} and
     *   {@link StandaloneWindow.setStyle | standaloneWindow.setStyle()}.
     * - Loading a HTML page: activated by calling {@link StandaloneWindow.loadFile | standaloneWindow.loadFile()}.
     *   The HTML file should contain the CSS and JavaScript code to render the contents.
     *
     * When activating either mode, the previous mode will be deactivated and the overlay will be cleared.
     *
     * The window's webview has its own JavaScript context, which cannot access the IINA API directly.
     * It can only communicate with the plugin script via `iina.postMessage` and `iina.onMessage` to exchange data.
     * See [API in Web Views](/pages/webviews) for more information.
     *
     * @example
     * ```js
     * // simple mode
     * standaloneWindow.simpleMode();
     * standaloneWindow.setContent(`<p>Hello World</p>`);
     * standaloneWindow.setStyle(`p { color: red; }`);
     * standaloneWindow.show();
     *
     * // load a HTML file
     * standaloneWindow.loadFile("/path/to/sa-window.html");
     * standaloneWindow.show();
     * ```
     * @availableInEntry Main and Global.
     * Each entry can only create one standalone window, and their content and controls are isolated.
     * @category API Modules
     */
    export interface StandaloneWindow {
      /**
       * Open the standalone window.
       */
      open(): void;
      /**
       * Close the standalone window.
       */
      close(): void;
      /**
       * Clear the overlay contents and load a HTML file into the overlay.
       * The HTML file should contain the CSS and JavaScript code to render the contents.
       * It is possible to put the JavaScript code in a separate file and load it using a `<script>` tag.
       * The webpage can communicate with the Internet using standard methods like `fetch`,
       * but it cannot access the IINA API directly.
       * It should use `iina.postMessage` and `iina.onMessage` to exchange data with the plugin script.
       * See [API in Web Views](/pages/webviews) for more information.
       * @param path The path to the HTML file, related to the plugin root directory.
       */
      loadFile(path: string): void;
      /**
       * Clear the window contents and activate the "Simple Mode".
       * In the simple mode, you directly set the HTML and CSS contents of the overlay from the plugin script.
       */
      simpleMode(): void;
      /**
       * (Simple Mode Only)
       * Set the CSS style of the standalone window. The CSS string will be put into a `<style>` tag at the end of `<head>`.
       * The suggested usage is to call `setStyle` once when activating the simple mode,
       * and then use `setContent` (probably multiple times) to update the contents.
       *
       * ```html
       * <head>
       *    ...
       *    <style> [inserted here] </style>
       * </head>
       * ```
       * An error will be raised if the overlay is not in simple mode.
       * @param style The CSS string.
       */
      setStyle(style: string): void;
      /**
       * (Simple Mode Only)
       * Set the HTML content of the standalone window. The HTML string will be put into a `<div>` tag inside `<body>`,
       * with class `content`.
       *
       * ```html
       * <body>
       *    <div class="content"> [inserted here] </div>
       * </body>
       * ```
       * An error will be raised if the overlay is not in simple mode.
       * @param content The HTML string.
       */
      setContent(content: string): void;
      /**
       * Set various properties of the standalone window.
       * @param props Properties of the standalone window.
       * - `title`: the title of the window.
       * - `resizable`: whether the window is resizable.
       * - `hudWindow`: whether the window is a HUD window, like IINA's Inspector window.
       *   This option will also make the window have translucency and vibrancy background effects.
       * - `fullSizeContentView`: whether the window has a full size content view,
       *   that is, the content view is not inset by the title bar.
       * - `hideTitleBar`: whether the window should hide the title bar.
       */
      setProperty(
        props: Partial<{
          title: string;
          resizable: boolean;
          hudWindow: boolean;
          fullSizeContentView: boolean;
          hideTitleBar: boolean;
        }>,
      ): void;
      /**
       * Set the frame of the standalone window, allowing to resize and move it.
       * Specify `null` to keep the current value.
       * @param w The width of the window.
       * @param h The height of the window.
       * @param x The x coordinate of the window.
       * @param y  The y coordinate of the window.
       */
      setFrame(
        w?: number | null,
        h?: number | null,
        x?: number | null,
        y?: number | null,
      ): void;
      /**
       * Post a message to the standalone window.
       * The JS environment inside the window also has two methods,
       * `iina.postMessage` and `iina.onMessage`, to exchange data with the plugin script.
       * See [API in Web Views](/pages/webviews) for more information.
       * @param name The message name.
       * @param data The message data.
       */
      postMessage(name: string, data: any): void;
      /**
       * Register a listener for messages posted by the standalone window.
       * The JS environment inside the window also has two methods,
       * `iina.postMessage` and `iina.onMessage`, to exchange data with the plugin script.
       * See [API in Web Views](/pages/webviews) for more information.
       * @param name The message name.
       * @param callback The callback to be called when a message with the given name is received.
       */
      onMessage(
        name: string,
        callback: (
          /**
           * The message data, posted by the JS script inside the overlay webview.
           */
          data: any,
        ) => void,
      ): void;
    }

    /**
     * The `SidebarView` module provides a way to display custom content in the sidebar.
     * The content is rendered in a webview, therefore you can load webpages, display information such as lyrics,
     * or additional playback controls.
     *
     * You should add a `sidebarTab` field in the plugin Info.json when using this module:
     * ```json
     * {
     *  "sidebarTab": { name: "Title" }
     * }
     * ```
     *
     * The webview has its own JavaScript context, which cannot access the IINA API directly.
     * It can only communicate with the plugin script via `iina.postMessage` and `iina.onMessage` to exchange data.
     * See [API in Web Views](/pages/webviews) for more information.
     *
     * @availableInEntry Main only.
     * @category API Modules
     */
    export interface SidebarView {
      /**
       * Show the sidebar and switch to the plugin's tab.
       */
      show(): void;
      /**
       * Hide the sidebar.
       */
      hide(): void;
      /**
       * Load an HTML file into the webview.
       * @param path The path to the HTML file, related to the plugin root directory.
       */
      loadFile(path: string): void;
      /**
       * Post a message to the webview.
       * The JS environment inside the sidebar view also has two methods,
       * `iina.postMessage` and `iina.onMessage`, to exchange data with the plugin script.
       * See [API in Web Views](/pages/webviews) for more information.
       * @param name The message name.
       * @param data The message data.
       */
      postMessage(name: string, data: any): void;
      /**
       * Register a listener for messages posted by the sidebar view.
       * The JS environment inside the window also has two methods,
       * `iina.postMessage` and `iina.onMessage`, to exchange data with the plugin script.
       * See [API in Web Views](/pages/webviews) for more information.
       * @param name The message name.
       * @param callback The callback to be called when a message with the given name is received.
       */
      onMessage(name: string, callback: (data: any) => void): void;
    }

    /**
     * A file handle returned by {@link File.handle | file.handle()}.
     * Can be used to read and write files in binary mode.
     */
    export interface FileHandle {
      /**
       * Get the current offset of the file handle.
       */
      offset(): number;
      /**
       * Seek to a given offset.
       * @param offset The offset to seek to.
       */
      seekTo(offset: number): void;
      /**
       * Seek to the end of the file.
       */
      seekToEnd(): void;
      /**
       * Read a given number of bytes from the current offset.
       * @param length The number of bytes to read.
       */
      read(length: number): Uint8Array | undefined;
      /**
       * Read all bytes from the current offset to the end of the file.
       */
      readToEnd(): Uint8Array | undefined;
      /**
       * Write data to the file at the current offset.
       * @param data The data to write.
       */
      write(data: string | Uint8Array | number[]): void;
      /**
       * Close the file handle.
       */
      close(): void;
    }

    /**
     * The `File` module provides access to the file system.
     *
     * All path-related API can use special path prefixes as "pseudo folders"
     * to access some directories without specifying the absolute path.
     * Available pseudo folders are:
     * - `@tmp/`: the plugin's temporary directory.
     *   There is no guarantee that the files in this directory will be kept after IINA quits.
     * - `@data/`: the plugin's data directory.
     * - `@video/:id`, `@audio/:id`, `@sub/:id`: the video, audio, and subtitle files of the current playing media.
     *   `:id` is the track ID.
     *
     * @category API Modules
     */
    export interface File {
      list(
        path: string,
        options: Partial<{ includeSubDir: boolean }>,
      ): { filename: string; path: string; isDir: boolean }[];
      /**
       * Check if a file or directory exists.
       * @param path The path to the file or directory.
       */
      exists(path: string): boolean;
      /**
       * Write text content to a file.
       * @param path The path to the file.
       * @param content The string to write.
       */
      write(path: string, content: string): void;
      /**
       * Read from a text file.
       * @param path The path to the file.
       * @param options Currently unused.
       */
      read(path: string, options?: Partial<{}>): string | undefined;
      /**
       * Trash a file.
       * @param path The path to the file.
       */
      trash(path: string): void;
      /**
       * Delete a file immediately.
       * @param path The path to the file.
       */
      delete(path: string): void;
      /**
       * Show the file or directory in Finder.
       * @param path The path to the file or directory.
       */
      revealInFinder(path: string): void;
      /**
       * Read or write binary data from a file.
       * @param path The path to a file.
       * @param mode Can be either `read` or `write`.
       */
      handle(path: string, mode: string): FileHandle;
    }

    /**
     * The `Global` module provides a way to create new player instances and communicate with them.
     * The controlled player instances can have special properties, such as hidden User Interface,
     * disabled window animations, disabled plugins, and more.
     *
     * It also enables communication between the main entries and the global entry.
     *
     * @availableInEntry Global and main.
     * However, the `createPlayerInstance` method is only available in the global entry.
     * Note that if the plugin doesn't have a global entry, the whole module will be unavailable.
     * @category API Modules
     */
    export interface Global {
      /**
       * Create a new controlled player instance.
       * **Available in the global entry only.**
       * @param options The options for the new player instance.
       * - `disableWindowAnimation`: Disable window animations when opening/closing the window.
       * - `disableUI`: Hide the window's User Interface.
       * - `enablePlugins`: Enable all plugins for the new player instance.
       * - `label`: A custom label of the new player instance. Can be obtained by `global.getLabel()`
       *   in the main entry.
       * Note that if this option is set to `false`, the player will only have the current plugin loaded
       * to ensure communication between the players and the global entry.
       * - `url`: The URL to open in the new player instance.
       * @returns The ID of the new player instance.
       */
      createPlayerInstance(
        options: Partial<{
          disableWindowAnimation: boolean;
          disableUI: boolean;
          enablePlugins: boolean;
          label: string;
          url: string;
        }>,
      ): number;
      /**
       * Get the custom label of the current player instance.
       * The label can be set by the `label` option of {@link createPlayerInstance}.
       * **Available in the main entry only.**
       */
      getLabel(): string;
      /**
       * Post a message to the (main entry of) player instance(s).
       * **Available in the global entry only.**
       * @param target Specify the target player instance(s).
       * If set to a string, it will be treated as the player instance's label.
       * If set to a number, it will be treated as the player instance's ID.
       * The ID is only available for plugin-created players returned by {@link createPlayerInstance}.
       * If set to `null`, the message will be sent to all player instances.
       * @param name The message name.
       * @param data The message data.
       */
      postMessage(
        target: null | number | string,
        name: string,
        data: any,
      ): void;
      /**
       * Post message to the global entry.
       * **Available in the main entry only.**
       * @param name The message name.
       * @param data The message data.
       */
      postMessage(name: string, data: any): void;
      /**
       * Register a message listener.
       * @param name The message name.
       * @param callback The callback function.
       */
      onMessage(
        name: string,
        callback: (
          /**
           * The message data.
           */
          data: any,
          /**
           * The player's ID.
           * Available in the global entry only, and only when the message is sent from a player instance.
           */
          player?: string,
        ) => void,
      ): void;
    }
  }

  interface Require {
    (file: string): any;
  }

  interface Module {
    exports: any;
  }

  /**
   * The global IINA API object containing all API modules as listed below.
   * @category Global IINA API Object
   */
  export interface IINAGlobal {
    core: API.Core;
    mpv: API.MPV;
    event: API.Event;
    http: API.HTTP;
    ws: API.WebSocket;
    console: API.Console;
    menu: API.Menu;
    input: API.Input;
    overlay: API.Overlay;
    utils: API.Utils;
    preferences: API.Preferences;
    subtitle: API.Subtitle;
    sidebar: API.SidebarView;
    standaloneWindow: API.StandaloneWindow;
    playlist: API.Playlist;
    file: API.File;
    global: API.Global;
  }
}

/**
 * Run a function periodically with a given interval.
 * Mimics the behavior of `setInterval` in the browser.
 * @returns A unique ID for removing the interval.
 * @category Utilities
 */
declare const setInterval: (
  callback: /**
   * The callback function to run periodically.
   */
  Function,
  /**
   * The interval in milliseconds.
   */
  time: number,
) => string;
/**
 * Run a function after a given time.
 * Mimics the behavior of `setTimeout` in the browser.
 * @returns A unique ID for removing the timeout.
 * @category Utilities
 */
declare const setTimeout: (
  /**
   * The callback function to run after the given time.
   */
  callback: Function,
  /**
   * The timeout in milliseconds.
   */
  time: number,
) => string;
/**
 * Remove a previously set interval function.
 * @category Utilities
 */
declare const clearInterval: (
  /**
   * The ID returned by `setInterval` when the interval was set.
   */
  id: string,
) => void;
/**
 * Remove a previously set timeout function.
 * @category Utilities
 */
declare const clearTimeout: (
  /**
   * The ID returned by `setTimeout` when the timeout was set.
   */
  id: string,
) => void;

/**
 * The global IINA API object containing all the API modules.
 * See the {@link IINA.IINAGlobal} interface for available modules.
 * @category IINA API Object
 */
declare const iina: IINA.IINAGlobal;
/**
 * A node-style `require` function for the naive module system.
 * @category Utilities
 */
declare const require: IINA.Require;
/**
 * A node-style `module` object for the naive module system.
 * @category Utilities
 */
declare const module: IINA.Module;
