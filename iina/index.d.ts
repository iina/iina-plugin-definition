declare namespace IINA {
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
        action: () => void;
        addSubMenuItem(item: MenuItem): void;
    }

    export namespace API {
        export interface Core {
            open(url: string): void;
            osd(url: string): void;
            getWindowFrame(): { x: number, y: number, width: number, height: number };
        }

        export interface MPV {
            getFlag(name: string): boolean;
            getNumber(name: string): number;
            getString(name: string): string;
            getNative<T>(name: string): T;
            set(name: string, value: any): void;
            command(name: string, args: string[]): void;
            addHook(name: string, priority: number, callback: (next: () => void) => void): void;
        }

        export interface Event {
            on(event: string, callback: () => void): void;
        }

        export interface HTTPXMLRPC {
            call<T = any>(method: string, args: any[]): Promise<T>;
        }

        export interface HTTP {
            get(url: string, options: HTTPRequestOption): Promise<HTTPResponse>;
            post(url: string, options: HTTPRequestOption): Promise<HTTPResponse>;
            put(url: string, options: HTTPRequestOption): Promise<HTTPResponse>;
            patch(url: string, options: HTTPRequestOption): Promise<HTTPResponse>;
            delete(url: string, options: HTTPRequestOption): Promise<HTTPResponse>;
            xmlrpc(location: string): HTTPXMLRPC;
        }

        export interface Console {
            log(message: any): void;
            warn(message: any): void;
            error(message: any): void;
        }

        export interface Menu {
            item(title: string, action?: () => void): MenuItem;
            addItem(item: MenuItem): void;
        }

        export interface Overlay {
            show(): void;
            hide(): void;
            setOpacity(opcity: number): void;
            loadFile(path: string): void;
            sendMessage(name: string, data: any): void;
            onMessage(name: string, callback: (data: any) => void): void;
        }

        export interface Utils {
            ERROR_BINARY_NOT_FOUND: -1;
            ERROR_RUNTIME: -2;
            exec(file: string, args: string[]): Promise<{ status: number, stdout: string, stderr: string }>;
        }

        export interface Preferences {
            get(key: string): any;
            set(key: string, value: any): void;
            sync(): void;
        }
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
    }
}

declare const iina: IINA.IINAGlobal;
