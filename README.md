# AutoCAD Layer Constructor

A high-productivity client-side web application for creating and standardizing AutoCAD layer configurations and exporting them as ready-to-run `.scr` AutoCAD command scripts.

## Product Goal

Define layers through an intuitive, high-density CAD spreadsheet interface:
- **Layer Name**: Full Cyrillic support, space-safe quoting, inline duplicate & character validation.
- **Color**: AutoCAD Color Index (ACI 1–255), standard color shortcuts (1–7), full 256-color palette picker, and swatch previews.
- **Lineweight**: Standard AutoCAD lineweights in millimeters (`Default`, `0.00` to `2.11 mm`).
- **Linetype**: Standard AutoCAD linetypes (`Continuous`, `CENTER`, `DASHED`, `HIDDEN`, `PHANTOM`, `DOT`, etc.) with SVG pattern previews. Automatically loads required non-continuous linetypes from `acad.lin`.
- **Plot**: Per-layer plot visibility toggle (`_Plot` / `_NoPlot`).

Export to:
1. **AutoCAD Script (`.scr`)**: Run natively in AutoCAD using the `SCRIPT` command.
2. **JSON Preset**: Save and share layer standards across projects.

---

## AutoCAD Command Compatibility & Technical Rationale

AutoCAD script files (`.scr`) execute sequential keystrokes as if entered directly into the command prompt:
- In AutoCAD command-line scripts, a **space** or **newline** acts as pressing <kbd>Enter</kbd>.
- To avoid GUI dialog boxes, command names are prefixed with hyphens (e.g. `_.-LAYER` and `_.-LINETYPE`).
- The leading underscore `_` ensures international compatibility across non-English language versions of AutoCAD.
- The dot `.` forces the standard built-in command even if redefined by third-party plugins.

### Safe Script Structure for Existing & New Drawings
The generated script uses an **`ensureLayer`** paradigm:
1. **Linetype Pre-Loading**: Before modifying layers, all unique non-continuous linetypes needed by the configuration are loaded via `_.-LINETYPE _Load <name> acad.lin`.
2. **Layer Creation & Updating**:
   - Each layer block starts with `_.-LAYER _New <name>`. If the layer already exists, AutoCAD continues without throwing a fatal script error.
   - Properties are explicitly assigned using `<name>`:
     - `_Color <aci> <name>`
     - `_LWeight <lw> <name>`
     - `_LType <lt> <name>`
     - `_Plot <_Plot|_NoPlot> <name>`
   - Each layer ends with an empty line (pressing <kbd>Enter</kbd>) to cleanly exit the `_.-LAYER` command sequence.
   - Names containing spaces are safely wrapped in double quotes (e.g. `"АР Стены"`).

### Example Output
```text
_.-LINETYPE
_Load
CENTER
acad.lin

_.-LAYER
_New
АР_Стены
_Color
7
АР_Стены
_LWeight
0.35
АР_Стены
_LType
Continuous
АР_Стены
_Plot
_Plot
АР_Стены

```

---

## How to Use in AutoCAD

1. Configure your layer standard in the web UI or load the example preset.
2. Click **Download .scr** to save `autocad-layers.scr`.
3. Open your drawing in AutoCAD.
4. Type `SCRIPT` in the AutoCAD command line and press <kbd>Enter</kbd>.
5. Select the downloaded `.scr` file.
6. Open **Layer Properties Manager** (`LAYER`) to inspect the created and updated layers.

---

## Technical Stack & Architecture

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS v4** (engineering CAD aesthetic)
- **Vitest** (automated unit tests)
- **Lucide Icons**

### Directory Layout
```text
src/
  domain/
    layer.ts                 # LayerDefinition, LineWeight, and configuration models
    validation.ts            # Duplicate detection, name rules, ACI range validation
    presets.ts               # Architectural starter presets
  autocad/
    colors.ts                # ACI 1-255 catalog, RGB preview mapping, quick standard colors
    lineweights.ts           # Standard AutoCAD lineweights (Default, 0.00-2.11 mm)
    linetypes.ts             # Supported linetypes catalog & SVG dash pattern metadata
    generateLayerScript.ts   # Pure TypeScript AutoCAD .scr generator module
  persistence/
    localStorage.ts          # Versioned local storage persistence
  importExport/
    json.ts                  # Configuration JSON export/import and schema validation
  components/
    Header.tsx               # App header, preset selector, and import/export toolbar
    LayerTable.tsx           # High-density CAD editable table
    LayerRow.tsx             # Layer row with inline validation and quick actions
    ColorPickerModal.tsx     # ACI palette & quick picker dialog
    LinetypePreview.tsx      # SVG preview for dash patterns
    ScriptPreviewPanel.tsx   # Monospace script preview with Copy & Download buttons
    HowToUseGuide.tsx        # Quick 5-step AutoCAD guide
    ImportJsonModal.tsx      # JSON upload & paste modal
```

---

## Development

### Install Dependencies
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```

### Run Automated Tests
```bash
npm test
```

### Build Production Bundle
```bash
npm run build
```

### Linting
```bash
npm run lint
```
