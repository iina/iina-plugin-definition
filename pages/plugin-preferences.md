When developing a plugin, you may want provide some settings for users.
IINA provides an integrated preference panel for plugins,
which can be accessed by selecting the plugin the Settings window,
then clicking the `Preferences` tab.

To support this preference panel, you need to provide an HTML page and indicate it in the `Info.json` file:

```json
{
  "preferencesPage": "preferences.html"
}
```

## Styling the preference page

While you can use any HTML elements and CSS styles in the page,
we encourage you to use default HTML input elements with
minimal styling to stay consistent with the macOS user interface.

By default, IINA provides some CSS styles for the preference page, including:

- Dark mode support
- Font family and size
- Some utility classes:

```css
/* for showing help text */
small,
.small {
  font-size: 11px;
}

.secondary {
  color: rgba(0, 0, 0, 0.5);
}

.pref-help {
  margin-top: 2px;
}

.pref-section {
  margin-bottom: 12px;
}
```

Here is an example of using these styles:

```html
<body>
  <div class="pref-section">
    Use custom youtube-dl/yt-dlp:
    <div style="margin-top: 2px">
      <input
        type="text"
        data-pref-key="ytdl_path"
        style="width: 100%; margin-top: 2px"
      />
    </div>
  </div>
  <div class="pref-section">
    <label>
      <input type="checkbox" data-type="bool" data-pref-key="use_manifest" />
      Use manifest URL
    </label>
    <p class="small secondary pref-help">
      Use the master manifest URL for formats like HLS and DASH, if available,
      allowing for video/audio selection in runtime.
    </p>
  </div>
</body>
```

## Binding in the preference page

#### The Preferences API

IINA provides API for storing and retrieving preferences as key-value pairs.
The documentation of the [preferences](/interfaces/IINA.API.Preferences) module
will introduce the API in detail.
Basically, you can use the `get` and `set` methods to access the preferences.

```js
const { preferences } = iina;
preferences.set("key", value);
preferences.get("key");
```

You can also declare default values for the preferences in `Info.json`:

```json
{
  "preferenceDefaults": {
    "key": "value"
  }
}
```

#### Bind to preference values

IINA provides bindings for the preference page to access the plugin's settings.
For most cases, you can simply add the `data-pref-key` attribute to your `<input>` element,
and its value will be automatically synchronized with the stored preference value.

```html
<input type="checkbox" data-type="bool" data-pref-key="foo" />
```

Here, `data-type` indicates the type of the preference value.
Please follow the following rules to void unexpected behaviors:

- For boolean values, use `<input type="checkbox">` and set `data-type="bool"`.
- For numeric values, use `<input type="number">` and set `data-type="int"` or `data-type="float"`.
- For string values, use `<input type="text">` and `data-type` is optional.
- If using `<input type="radio">`, do not set `data-pref-key` and use the `name` attribute instead.
  All radio buttons in the same group should have their `name` attribute set to the preference key.

#### Custom bindings

If you need more control over the binding, you can use the JavaScript API to
bind the preference value to your element.
The same `get` and `set` methods are available in `window.iina.preferences`.

```html
<script>
  const { preferences } = window.iina;
  const inputs = document.querySelectorAll("input[data-pref-key]");
  Array.prototype.forEach.call(inputs, (input) => {
    const key = input.dataset.prefKey;
    preferences.get(key, (value) => {
      input.value = value;
    });
    input.addEventListener("change", () => {
      let value = input.value;
      preferences.set(key, value);
    });
  });
</script>
```
