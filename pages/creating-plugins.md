This page introduces how to create and distribute plugins for IINA.

As described in [Getting Started](/pages/getting-started), a minimal plugin contains
only two files: `Info.json` and the entry JavaScript file, e.g., `main.js`.
For simple plugins, you can create them manually.
However, for more complex plugins, especially when you want to use a bundler
and create React or Vue interfaces, the IINA CLI tool can create plugin templates for you.

## The CLI Tool

Starting from 1.4.0, IINA provides a CLI tool `iina-plugin` to create and pack plugins.
The tool is located at `IINA.app/Contents/MacOS/iina-plugin`, and you may want to add it to your `PATH`:

```sh
ln -s /Applications/IINA.app/Contents/MacOS/iina-plugin /usr/local/bin/iina-plugin
```

#### Creating a Plugin

After adding the CLI tool to your path, you may create a plugin with the following command:

```sh
iina-plugin new <name>
```

which will create a folder named `<name>` in the current directory.
It can also generate templates for React and Vue interfaces.

#### Packing a Plugin

You may pack the plugin into a `.iinaplgz` file for distribution:

```sh
iina-plugin pack <dir>
```

The `.iinaplgz` file is essentially a zip file with a different extension.
Note that it is recommended to distribute your plugin as a GitHub repository,
so that users can easily update it.
See [Auto-Update Using GitHub](#auto-update-using-github) for more information.

## Distributing Plugins

To be recognized by IINA, a plugin should be a `.iinaplugin` package
located in IINA's plugin folder at `~/Library/Application Support/com.colliderli.iina/plugins`.
Usually, users don't need to put the package into the plugin folder manually,
as IINA will automatically create it when the plugin is installed.

A plugin can be installed from the following ways:

- Opening a packed `.iinaplgz` file with IINA.
- Installing from a GitHub repository by entering the repository URL in IINA.

#### Loading a development plugin

When developing a plugin, you may want to reload it without installing it again.
IINA can also load any local folder as a plugin, as long as it's symlinked to the
plugin folder at `~/Library/Application Support/com.colliderli.iina/plugins`,
and the symlink has an `.iinaplugin-dev` suffix.
This can be done manually or using the CLI tool:

```sh
# manually
ln -s /path/to/plugin ~/Library/Application\ Support/com.colliderli.iina/plugins/<name>.iinaplugin-dev

# using the CLI
iina-plugin link <dir>
iina-plugin unlink <dir>  # to remove the symlink
```

#### Auto-Update Using GitHub

IINA encourages you to publish your plugins on GitHub.
If your plugin has an associated GitHub repository,
users can install it by simply entering the repository URL in IINA,
and IINA can automatically check for updates for your plugin.

To enable auto-update, you need to specify the `ghRepo` and `ghVersion` field in `Info.json`.
`ghRepo` is the GitHub repository URL of your plugin, in the format of `username/repo`.
`ghVersion` should be an integer that is incremented every time you publish a new version of your plugin.
IINA will compare the `ghVersion` field in `Info.json` with the latest release version on GitHub,
if the latter is greater than the former, IINA will prompt the user to update the plugin.

Note that when using a bundler,
we recommend you to directly commit the bundled files (e.g., the `dist` folder) to your repository,
because IINA will download the repository contents directly from GitHub.
You may want to use a `.gitattributes` file to treat the bundled files as binary files.
Alternatively, you can put your source code in a separate branch (e.g., `develop`),
and put the bundled files in the `main` branch.

## The Next Step

You now know how to create and distribute plugins for IINA.
The [Development Guide](/pages/dev-guide) page contains more information about the plugin system,
and you are highly recommended to read it before writing your own plugin.

You may also go back to the [homepage](/modules) to see the documentation of each API module.
