The `subtitle` module provides APIs for plugins to register external subtitle providers that integrate with IINA's subtitle search and download system.
Registereed subtitle providers are available in IINA's Settings and the Subtitles > Find Online Subtitles menu.

## Registering a subtitle provider

To start, the plugin developer should add a `subtitleProviders` key to the `Info.json` file. The value should be an array of objects, each of which specifies a subtitle provider.

```json
{
  "subtitleProviders": [
    {
      "id": "open-sub",
      "name": "OpenSubtitles"
    }
  ]
}
```

This information will be used by IINA to display the provider in the Settings and the Subtitles > Find Online Subtitles menu.
The ID should be a unique string that identifies the provider.
A plugin can register multiple subtitle providers, as long as they have different IDs.
This allows you to provide multiple subtitle sources in one plugin.

In order to make the provider available in the player, the method `subtitles.registerProvider(id, provider)` should be invoked directly in the **main** entry script, that is, when the player core is initialized.
This method takes two parameters: the ID of the provider (same as the one in `Info.json`), and a provider object that defines the search and download behavior.

```js
subtitles.registerProvider("open-sub", {
  search: async (query) => {
    // ...
  },
  description: (item) => {
    // ...
  },
  download: async (item) => {
    // ...
  },
});
```

The provider is an object with three fields:

- `search()`: the entry point of a subtitle search request.
  When the user searches for subtitles, IINA will call this function.
  The function should gather necessary information from the IINA API, search for subtitles, and return a list of `SubtitleItem`s.
- `description()`: given a `SubtitleItem`, returns three labels that describes the subtitle.
  These labels will be displayed in the subtitle search result list.
  IINA will use the `SubtitleItem` list and this function to display the search result.
- `download()`: given a `SubtitleItem`, returns a list of paths.
  After the user selects a subtitle, IINA will call this function with the selected `SubtitleItem`.
  It should download the subtitle file(s) and return the paths to the downloaded files.

The whole workflow is illustrated in the figure below.

![Subtitle Provider Workflow](/media/subtitle-providers.png)

## Searching for subtitles

The `search()` function is the starting point of a subtitle search request.
It should be an `async` function, or returns a `Promise`.

It does not take any parameters, but all information about the current video can be obtained from the IINA API.
There are numerous ways to gather related information, for example, the current file URL can be obtained from `core.status.url`, and if it's an online video, its title can be obtained from `core.status.title`.
With the file URL (path), you can use the `file` module to read chunks of the file to calculate hash values.
You can also use the `utils.prompt()` to let the user input additional search keywords.

With all the necessary information, you can call the subtitle provider's API to search for subtitles.
The `http` module provides a convenient way to make HTTP and XMLRPC requests, while you can also include your own binary executable in the plugin package and use `utils.exec()` to call it.

The `search()` function should return a list of `SubtitleItem`s, which are basically wrappers containing arbitrary data objects.
You can create one by calling `subtitle.item(data)`.
The data object can be anything you want, and the encapsulating `SubtitleItem` will be passed to the subsequent `description()` and `download()` functions.
For example, the subtitle provider may return a list of results as follows:

```js
results = [
  {
    id: "123456",
    title: "Subtitle 1",
    lang: "en",
    format: "srt",
    score: 0.9,
  },
  {
    id: "654321",
    title: "Subtitle 2",
    lang: "en",
    format: "ass",
    score: 0.8,
  },
];
```

You can create a list of of `SubtitleItem`s and return it:

```js
const items = results.map((x) => subtitle.item(x));

console.log(items[0].data.id);
// "123456"
```

## Showing the result to user

The `description()` method specifies how to display the `SubtitleItem`s in IINA's interface.
When showing the list of results, IINA displays a primary label and two secondary labels for each subtitle, as shown in the screenshot below.

![Subtitle Selection](/media/sub-sel.png)

The return value of `description()` should be an object with three fields, `name`, `left`, and `right`, corresponding to the primary and two secondary labels. With the previous example, the `description()` method may look like:

```js
{
  description: (item) => ({
    name: item.title,
    left: `${item.lang} ${item.format}`,
    right: `Rating: ${item.score * 10}`,
  });
}
```

## Downloading the subtitle files

Finally, IINA will call the `download()` method when the user selected a subtitle from the list.
The method should perform the download and return an array of paths to the downloaded subtitle files.
The reason why it returns an array is that some subtitle providers may provide multiple files for a single subtitle entry. That said, in most cases, the array will only contain one path.

You may use the `http` module to download the files, or use the `utils.exec()` to call an external executable.
While it is possible to download the file directly to the video file's directory, it is recommended to use the plugin's `@tmp/` pseudo directory, which is a temporary directory that will be cleaned up after the player quits.
IINA will move the downloaded file to the video file's directory if user selected to save the subtitle file
in IINA's user interface.

```js
{
  download: async (item) => {
    const url = `https://example.com/subtitle/${item.id}`;
    const path = await http.download(url, "@tmp/");
    return [path];
  },
}
```
