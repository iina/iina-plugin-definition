declare namespace IINA {
  export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  export interface HTTPRequestOption {
    params: Record<string, string>;
    headers: Record<string, string>;
    data: Record<string, any>;
  }

  export interface HTTPResponse {
    text: string;
    reason: string;
    data: any;
    statusCode: number;
  }

  export interface MenuItem {
    items: MenuItem[];
    title: string;
    selected: boolean;
    enabled: boolean;
    action: (item: MenuItem) => void;
    addSubMenuItem(item: MenuItem): this;
  }

  export interface Track {
    id: number;
    title: string | null;
    formattedTitie: string;
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

  export interface Chapter {
    title: string;
    start: number;
  }

  export interface History {
    name: string;
    url: string;
    date: string;
    progress: number | null;
    duration: number;
  }

  export interface RecentDocument {
    name: string;
    url: string;
  }

  export interface PlaylistItem {
    filename: string;
    title: string;
    isPlaying: boolean;
    isCurrent: boolean;
  }

  export namespace API {
    interface WindowAPI {
      readonly loaded: boolean;
      readonly visible: boolean;
      readonly screens: { frame: Rect; main: boolean; current: boolean }[];
      frame: Rect;
      fullscreen: boolean;
      pip: boolean;
      ontop: boolean;
      sidebar: string | null;
    }

    interface StatusAPI {
      readonly paused: boolean;
      readonly idle: boolean;
      readonly position: number | null;
      readonly duration: number | null;
      readonly speed: number;
      readonly videoWidth: number | null;
      readonly videoHeight: number | null;
      readonly isNetworkResource: boolean;
      readonly url: string;
    }

    interface TrackAPI {
      id: number | null;
      readonly tracks: Track[];
      readonly currentTrack: Track;
      loadTrack(url: string);
    }

    interface AudioAPI extends TrackAPI {
      delay: number;
      volume: number;
      muted: boolean;
    }

    interface SubtitleAPI extends TrackAPI {
      secondID: number | null;
      delay: number;
    }

    interface VideoAPI extends TrackAPI {}

    export interface Core {
      open(url: string): void;
      osd(message: string): void;
      pause(): void;
      resume(): void;
      stop(): void;
      seek(seconds: number, exact: boolean): void;
      seekTo(seconds: number);
      setSpeed(speed: number);
      getChapters(): Chapter[];
      playChapter(index: number);
      getHistory(): History[];
      getRecentDocuments(): RecentDocument[];
      getVersion(): { iina: string; build: string; mpv: string };
      window: WindowAPI;
      status: StatusAPI;
      audio: AudioAPI;
      video: VideoAPI;
      subtitle: SubtitleAPI;
    }

    export interface MPV {
      getFlag(name: string): boolean;
      getNumber(name: string): number;
      getString(name: string): string;
      getNative<T>(name: string): T;
      set(name: string, value: any): void;
      command(name: string, args: string[]): void;
      addHook(
        name: string,
        priority: number,
        callback: (next: () => void) => void,
      ): void;
    }

    export interface Event {
      // Window
      on(event: "iina.window-loaded", callback: () => void): string;
      on(
        event: "iina.window-size-adjusted",
        callback: (frame: Rect) => void,
      ): string;
      on(event: "iina.window-moved", callback: (frame: Rect) => void): string;
      on(event: "iina.window-resized", callback: (frame: Rect) => void): string;
      on(
        event: "iina.window-fs.changed",
        callback: (status: boolean) => void,
      ): string;
      on(event: "iina.window-screen.changed", callback: () => void): string;
      on(event: "iina.window-miniaturized", callback: () => void): string;
      on(event: "iina.window-deminiaturized", callback: () => void): string;
      on(
        event: "iina.window-main.changed",
        callback: (status: boolean) => void,
      ): string;
      on(event: "iina.window-will-close", callback: () => void): string;
      on(event: "iina.window-did-close", callback: () => void): string;
      on(
        event: "iina.music-mode.changed",
        callback: (status: boolean) => void,
      ): string;
      on(
        event: "iina.pip.changed",
        callback: (status: boolean) => void,
      ): string;
      on(event: "iina.file-loaded", callback: (url: string) => void): string;
      on(event: "iina.file-started", callback: () => void): string;
      on(event: "iina.mpv-inititalized", callback: () => void): string;
      on(event: "iina.thumbnails-ready", callback: () => void): string;
      on(event: "iina.plugin-overlay-loaded", callback: () => void): string;
      on(event: string, callback: () => void): string;

      off(event: string, id: string);
    }

    export interface HTTPXMLRPC {
      call<T = any>(method: string, args: any[]): Promise<T>;
    }

    export interface HTTP {
      get(url: string, options?: HTTPRequestOption): Promise<HTTPResponse>;
      post(url: string, options?: HTTPRequestOption): Promise<HTTPResponse>;
      put(url: string, options?: HTTPRequestOption): Promise<HTTPResponse>;
      patch(url: string, options?: HTTPRequestOption): Promise<HTTPResponse>;
      delete(url: string, options?: HTTPRequestOption): Promise<HTTPResponse>;
      xmlrpc(location: string): HTTPXMLRPC;
      download(
        url: string,
        dest: string,
        options?: HTTPRequestOption & { method: string },
      ): Promise<undefined>;
    }

    export interface Console {
      log(message: any): void;
      warn(message: any): void;
      error(message: any): void;
    }

    export interface Menu {
      item(
        title: string,
        action?: () => void | null,
        options?: Partial<{
          enabled: boolean;
          selected: boolean;
          keyBinding: string;
        }>,
      ): MenuItem;
      addItem(item: MenuItem): void;
      separator(): MenuItem;
      items(): MenuItem[];
      removeAt(index: number): void;
      removeAllItems(): void;
      forceUpdate(): void;
    }

    export interface Overlay {
      show(): void;
      hide(): void;
      setOpacity(opacity: number): void;
      loadFile(path: string): void;
      simpleMode(): void;
      setStyle(style: string);
      setContent(content: string);
      postMessage(name: string, data: any): void;
      onMessage(name: string, callback: (data: any) => void): void;
    }

    export interface Playlist {
      list(): PlaylistItem[];
      count(): number;
      add(url: string, at?: number): PlaylistItem;
      remove(index: number): PlaylistItem;
      move(index: number, to: number): PlaylistItem;
      play(index: number): void;
      playNext(): void;
      playPrevious(): void;
      registerMenuBuilder(
        builder: (entries: PlaylistItem[]) => MenuItem[],
      ): void;
    }

    export interface Utils {
      ERROR_BINARY_NOT_FOUND: -1;
      ERROR_RUNTIME: -2;
      fileInPath(file: string): boolean;
      resolvePath(path: string): string;
      exec(
        file: string,
        args: string[],
        cwd?: string | null,
        stdoutHook?: ((data: string) => void) | null,
        stderrHook?: ((data: string) => void) | null,
      ): Promise<{ status: number; stdout: string; stderr: string }>;
      ask(title: string): boolean;
      prompt(title: string): string | undefined;
      chooseFile(
        title: string,
        options: Partial<{ chooseDir: boolean; allowedFileTypes: string[] }>,
      ): string;
    }

    export interface Preferences {
      get(key: string): any;
      set(key: string, value: any): void;
      sync(): void;
    }

    export interface SubtitleItem<T> {
      data: T;
      desc: SubtitleItemDescriptor<T>;
    }

    export type SubtitleItemDescriptor<T> = (item: SubtitleItem<T>) => {
      name: string;
      left: string;
      right: string;
    };

    export interface SubtitleProvider<T> {
      search(): Promise<SubtitleItem<T>[]>;
      description?(): SubtitleItemDescriptor<T>;
      download(item: SubtitleItem<T>): string[];
    }

    export interface Subtitle {
      item<T>(data: T, desc: SubtitleItemDescriptor<T>): SubtitleItem<T>;
      registerProvider<T>(id: string, provider: SubtitleProvider<T>): void;
    }

    export interface StandaloneWindow {
      open(): void;
      close(): void;
      loadFile(path: string): void;
      postMessage(name: string, data: any): void;
      onMessage(name: string, callback: (data: any) => void): void;
      simpleMode(): void;
      setStyle(style: string): void;
      setContent(content: string): void;
      setProperty(
        props: Partial<{
          title: string;
          resizable: boolean;
          hudWindow: boolean;
          fullSizeContentView: boolean;
          hideTitleBar: boolean;
        }>,
      ): void;
      setFrame(
        w?: number | null,
        h?: number | null,
        x?: number | null,
        y?: number | null,
      ): void;
    }

    export interface SidebarView {
      show(): void;
      hide(): void;
      loadFile(path: string): void;
      postMessage(name: string, data: any): void;
      onMessage(name: string, callback: (data: any) => void): void;
    }

    export interface FileHandle {
      offset(): number;
      seekTo(offset: number): void;
      seekToEnd(): void;
      read(length: number): Uint8Array | undefined;
      readToEnd(): Uint8Array | undefined;
      write(data: string | Uint8Array | number[]): void;
      close(): void;
    }

    export interface File {
      list(
        path: string,
        options: Partial<{ includeSubDir: boolean }>,
      ): { filename: string; path: string; isDir: boolean };
      exists(path: string): boolean;
      write(path: string, content: string): void;
      read(path: string, options: Partial<{}>): string | undefined;
      trash(path: string): void;
      delete(path: string): void;
      revealInFinder(path: string): void;
      handle(path: string, mode: string): FileHandle;
    }

    export interface Global {
      createPlayerInstance(
        options: Partial<{
          disableWindowAnimation: boolean;
          disableUI: boolean;
          enablePlugins: boolean;
          url: string;
        }>,
      ): number;
      postMessage(
        target: null | number | string,
        name: string,
        data: any,
      ): void;
      postMessage(name: string, data: any): void;
      onMessage(
        name: string,
        callback: (data: any, player?: string) => void,
      ): void;
    }
  }

  interface Require {
    (file: string): any;
  }

  interface Module {
    exports: any;
  }

  export interface IINAGlobal {
    core: API.Core;
    mpv: API.MPV;
    event: API.Event;
    http: API.HTTP;
    console: API.Console;
    menu: API.Menu;
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

declare const setInterval: (callback: Function, time: number) => string;
declare const setTimeout: (callback: Function, time: number) => string;
declare const clearInterval: (id: string) => void;
declare const clearTimeout: (id: string) => void;

declare const iina: IINA.IINAGlobal;
declare const require: IINA.Require;
declare const module: IINA.Module;
