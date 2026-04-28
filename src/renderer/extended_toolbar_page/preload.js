console.log('[DRAWPEN]: Extended toolbar page preloading...');

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Renderer -> Main
  invokeCloseApp: () => ipcRenderer.invoke('close_app'),
  invokeDrawMode: () => ipcRenderer.invoke('toggle_draw_or_pointer_window'),
  invokeDrawModeAt: (screenX, screenY) => ipcRenderer.invoke('enter_draw_mode_from_extended_toolbar', screenX, screenY),
  dragBy: (dx, dy) => ipcRenderer.send('extended_toolbar_drag_by', dx, dy),
});
