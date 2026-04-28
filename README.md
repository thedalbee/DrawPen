<p align="center">
  <img src="https://github.com/DmytroVasin/DrawPen/blob/main/assets/static/icon.png?raw=true" height="200">
  <h3 align="center">DrawPen · Frosted (personal fork)</h3>
  <p align="center">UI-only fork of <a href="https://github.com/DmytroVasin/DrawPen">DmytroVasin/DrawPen</a></p>
</p>

> ## ⚠️ This is a personal fork
>
> All credit for DrawPen goes to **[@DmytroVasin](https://github.com/DmytroVasin)** and the upstream contributors. This fork only restyles the toolbar and tweaks a few interactions (drag-anywhere, custom letter shortcuts, full-display bounds so the toolbar can be dragged into Stage Manager / Dock margins). The MIT license carries through unchanged.
>
> **For the real, maintained app, use upstream:** https://github.com/DmytroVasin/DrawPen
>
> Issues and feature requests should be filed upstream, not here.
>
> ### What's different in this fork
>
> | Area | Change |
> |---|---|
> | Toolbar look | Frosted HUD — dark translucent panel, white SF-style icons, larger radius, native `vibrancy: 'hud'` on the extended toolbar window |
> | Drag | JS pointer-based drag everywhere on the toolbar (5px threshold separates click from drag); main and extended windows accept first-mouse |
> | Display bounds | `display.bounds` instead of `display.workArea` so the overlay covers the whole screen (Stage Manager / Dock no longer clip drag area) |
> | Letter shortcuts | `v` brush, `c` shapes, `t` text, `h` highlighter, `r` laser, `z` eraser (collide-safe with cmd+v/c/z clipboard / undo) |
> | Visual guides | Removed light-green zone border |

---

<p align="center">
  <h3 align="center">Original README below</h3>
</p>

<p align="center">
  <a href='https://github.com/DmytroVasin/DrawPen/releases/latest/download/DrawPen.Setup.exe'>
    <img alt='Get it on Windows' width="134px" src='https://github.com/DmytroVasin/DrawPen/blob/main/assets/static/BadgeWindows.png?raw=true'/>
  </a>
  <a href='https://github.com/DmytroVasin/DrawPen/releases/latest/download/DrawPen-0.0.47-arm64.dmg'>
    <img alt='Get it on macOS' width="134px" src='https://github.com/DmytroVasin/DrawPen/blob/main/assets/static/BadgeMacOS.png?raw=true'/>
  </a>
  <a href='https://github.com/DmytroVasin/DrawPen/releases/latest/download/drawpen_0.0.47_amd64.deb'>
    <img alt='Get it on Linux' width="134px" src='https://github.com/DmytroVasin/DrawPen/blob/main/assets/static/BadgeLinux.png?raw=true'/>
  </a>
</p>

---

![DrawPen](https://github.com/DmytroVasin/DrawPen/blob/main/assets/static/main.png?raw=true)

![DrawPen - Usage](https://github.com/DmytroVasin/DrawPen/blob/main/assets/static/main.gif?raw=true)

![DrawPen - Pointer Mode](https://github.com/DmytroVasin/DrawPen/blob/main/assets/static/pointer-mode.gif?raw=true)

### Installation

You can download DrawPen for **free** from [releases](https://github.com/DmytroVasin/DrawPen/releases)

Or install via **package managers**:

```bash
# macOS (Homebrew)
brew install --cask drawpen

# Windows (Scoop)
scoop bucket add extras
scoop install extras/drawpen
```

### Known issues

On some Linux setups running **Wayland** (e.g. [Fedora KDE Plasma](https://github.com/DmytroVasin/DrawPen/issues/82), [Zorin](https://github.com/DmytroVasin/DrawPen/issues/81)), DrawPen may start with a **segmentation fault**. [Explanation In Details](https://github.com/IsmaelMartinez/teams-for-linux/blob/1c28e146ca78bcb0ec4df317d7f0684984adf205/docs-site/docs/development/research/wayland-x11-ozone-platform-investigation.md)

#### Workaround:

- Run DrawPen with X11 backend: `drawpen --ozone-platform=x11`
- Use DrawPen `drawpen-x11` package available in [releases](https://github.com/DmytroVasin/DrawPen/releases/latest/)

### Keybindings

| Command                                 | Keybindings                                                  | Comment |
| --------------------------------------- | ------------------------------------------------------------ | - |
| Enable Draw/Pointer Mode                | <kbd>CMD/CTRL + SHIFT + A</kbd> | Global shortcut |
| Activate Pen                            | <kbd>P</kbd> or <kbd>1</kbd> | |
| Activate/Switch Shapes (Arrow/Square/etc.)   | <kbd>A</kbd>, <kbd>R</kbd>, <kbd>O</kbd> or <kbd>2</kbd> | |
| Activate Text                           | <kbd>T</kbd> or <kbd>3</kbd> | |
| Activate Highlighter                    | <kbd>H</kbd> or <kbd>4</kbd> | |
| Activate Laser                          | <kbd>L</kbd> or <kbd>5</kbd> | |
| Activate Eraser                         | <kbd>E</kbd> or <kbd>6</kbd> | |
| Switch Color                            | <kbd>7</kbd> | |
| Switch Thickness (Width)                | <kbd>8</kbd> | |
| Show/Hide ToolBar                       | <kbd>CMD/CTRL + T</kbd> | In-app shortcut |
| Show/Hide Whiteboard                    | <kbd>CMD/CTRL + E</kbd> | In-app shortcut |
| Clear Desk                              | <kbd>CMD/CTRL + K</kbd> | In-app shortcut |
| Settings Page                           | <kbd>CMD/CTRL + ,</kbd> | |
| Reset to original                       | | Resets all app settings <br /> (keys, colors, toolbar position, etc.)  |

### Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information.

### License

DrawPen is licensed under the MIT Open Source license.
For more information, see [LICENSE](LICENSE).
