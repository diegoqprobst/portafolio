# Guion de grabación: dieline y etiqueta de luminaria (versión referencia)

Adaptado del formato de Guion_grabacion.md. Misma regla, mismos bloques, otra tarea.

Regla de oro: cada acción (clic, tecla, texto, menú, abrir o cerrar ventana) lleva UNA frase con:
**qué haces + control exacto + dónde está + por qué.**
Narra todo en inglés. Habla de forma que alguien pueda seguir la tarea SIN ver la pantalla.
Mueve el ratón al menos cada 30-40 s. Dock a la derecha (si lo tienes a la izquierda, cambia "right" por "left").

## Cifras de referencia (todas ficticias; deben coincidir con tu hoja)
| Parámetro | Producto (mm) | Holgura total (mm) | Caja interior (mm) |
|---|---|---|---|
| Largo (ancho de caja, W) | 300 | 10 | **310** |
| Ancho (fondo de caja, D) | 60 | 8 | **68** |
| Alto (alto de caja, H) | 40 | 8 | **48** |

Solapa de pegado 15 mm, lengüeta de cierre 20 mm, sangrado 3 mm.
- Ancho del desarrollo = 15 + 2×310 + 2×68 = **771 mm**
- Alto del desarrollo = 20 + 68 + 48 + 68 + 20 = **224 mm**
- Mesa de trabajo en Illustrator: 801 × 254 mm (15 mm de margen por lado).
- Paneles: frontal y trasero 310 × 48, laterales 68 × 48, tapa 310 × 68.
- Etiqueta: 120 × 42 mm, centrada en el panel frontal.
- Datos de la etiqueta: LX-300 Linear Luminaire, 18 W, 2340 lm, 130 lm/W, IP65, 220-240 V, 4000 K, CRI 80.
- EAN-13 de prueba (uso interno, prefijo 20): 2000000000015. Revisa que el dígito de control coincida con el que da tu fuente.

## Antes de pulsar Start
- Cuenta de Google ANÓNIMA, Firefox limpio, sin menú de cuenta abierto.
- Brave cerrado (⌘Q). ⌘+Tab: solo Firefox, Illustrator, TaskRecorder, Accessibility Inspector.
- TaskRecorder: borra lo anterior. Goal pegado. Used Apps = Adobe Illustrator, Google Sheets.
- Google Doc con SOLO el Goal, letra grande, delante de TaskRecorder.
- Dock a un lado, reloj con segundos, No molestar, Insightful minimizado, Metadata.rtf cerrado.
- Fuente de código de barras ya instalada y con licencia comercial. Anota su nombre exacto: [NOMBRE DE LA FUENTE].
- Hoja preparada ANTES de grabar: pestaña "Dimensions", entradas en B5:C7 (producto y holgura), D5:D7 vacías, parámetros de solapa y lengüeta en B10:B11, resultados vacíos en B14:B15.
- Illustrator abierto SIN documento. Sin plantillas ni archivos previos en pantalla.

---

## 1. Inicio (máx. 20 s)
HACER: Start Recording, minimizar TaskRecorder. Con el Doc visible, di SOLO esto y espera 3-4 s:
> "I will begin the project shortly. Here is the workflow I have in mind."

HACER: cerrar el Doc.
> "I'm clicking the red close button at the top-left of the Google Docs window to close the task description, because I'm ready to start."

## 2. Abrir la hoja (≈1:00)
> "I'm clicking the Firefox icon in the Dock on the right side of the screen to open Google Sheets, where my product dimensions are."
> "I'm moving the pointer down the Product column and across the Clearance column, to show the data I'll use for the dieline."
> "This is a fictional linear luminaire, 300 by 60 by 40 millimeters. I added a clearance to each dimension so the product and its protection fit inside the box."

## 3. Cálculo de la caja (≈1:30)
> "I'm clicking cell D5, in the Box inner column, next to the length row, because that's where the box width will be calculated."
> "I'm typing equals B5 plus C5, because column B holds the product length and column C holds the clearance."
> "I'm pressing the Enter key to confirm the formula."
> "I'm double-clicking the small fill handle at the bottom-right corner of cell D5 to copy the formula down to the width and height rows."
> "The box is 310 wide, 68 deep and 48 high, in millimeters."

## 4. Medidas del desarrollo (≈1:30)
> "I'm clicking cell B14, in the Results block below the table, because that's where the flat dieline width goes."
> "I'm typing equals B10 plus 2 times D5 plus 2 times D6, because the flat layout has a glue flap, two wide panels and two side panels."
> "I'm pressing the Enter key, and the result is 771 millimeters."
> "I'm clicking cell B15, just below it, because that's where the flat dieline height goes."
> "I'm typing equals 2 times B11 plus 2 times D6 plus D7, because the height adds two tuck flaps, two lid panels and the box height."
> "I'm pressing the Enter key, and the result is 224 millimeters."
> "I'm pointing at both results, because these are the only two numbers I need to build the dieline."

## 5. Pasar a Illustrator (≈0:45)
> "I'm clicking the Illustrator icon in the Dock on the right side of the screen, to start building the dieline."
> "I'm clicking the File menu at the top-left of the screen and choosing New, because I need a document sized for the flat layout."
> "In the dialog I'm typing 801 in the Width field and 254 in the Height field, with Millimeters as the unit, because the layout plus a 15 millimeter margin on each side gives that size."
> "I'm setting the Bleed fields to 3 millimeters and clicking Create at the bottom right of the dialog."

## 6. Reglas y guías (≈1:30)
> "I'm clicking the View menu at the top and choosing Show Rulers, because I need the rulers to place guides."
> "I'm dragging from the left ruler into the artboard and releasing at 15 millimeters, because that's where the glue flap starts."
> "I'm clicking the guide, and in the Properties panel on the right I'm typing the exact X position, because dragging alone is not precise."
> "I'm repeating this for the vertical guides at 30, 340, 408, 718 and 786 millimeters, because each one marks a fold between panels."
> "Now I'm dragging from the top ruler to the horizontal guides at 15, 35, 103, 151 and 219 millimeters, because they mark the tuck, the lid, the body and the bottom lid."

## 7. Paneles con el Rectángulo (≈3:00)
> "I'm clicking the Rectangle tool in the Tools panel on the left side of the window, because I'll build every panel as a rectangle."
> "I'm clicking once on the artboard at the front panel position, which opens the Rectangle dialog."
> "I'm typing 310 in Width and 48 in Height and clicking OK at the bottom right, because this is the front panel."
> "I'm opening the Window menu at the top and choosing Transform, to open the Transform panel on the right."
> "In the Transform panel I'm checking W is 310 and H is 48, and typing 30 in X and 103 in Y, so the panel snaps to my guides."
> "I'm repeating the same steps for the side panel, 68 by 48, then the back panel, 310 by 48, and the second side panel, 68 by 48."
> "Now I'm drawing the two lid panels, 310 by 68, above the back panel and below the front panel, and the two tuck flaps, 310 by 20."
> "I'm drawing the glue flap, 15 by 48, at the left edge of the front panel."
> "I'm selecting all the panels with the Selection tool, by dragging a box around them, and checking in the Transform panel that the total width is 771 and the total height is 224."

## 8. Líneas de corte y plegado (≈1:30)
> "I'm clicking the Swatches icon in the panel group on the right, to choose the line colors."
> "I'm selecting the outer edges and clicking the magenta swatch in the Swatches panel, because magenta is my cut line."
> "I'm selecting the inner fold lines and clicking the cyan swatch, because cyan is my fold line."
> "In the Stroke panel on the right, I'm checking the Dashed Line box for the fold lines, because folds are dashed by convention."
> "I'm clicking the Layers panel on the right and naming two layers, Dieline and Artwork, because the printer needs them separated."

## 9. Símbolos técnicos (≈3:00)
> "I'm clicking the Ellipse tool in the Tools panel on the left, because the power symbol starts as a circle."
> "I'm dragging on the pasteboard, outside the artboard, while holding Shift to draw a perfect circle, and typing 10 by 10 in the Transform panel."
> "I'm clicking the Pen tool in the Tools panel on the left and clicking four points to draw a lightning bolt inside the circle, because the bolt means power."
> "I'm selecting the circle and the bolt together and clicking the Window menu at the top, then Symbols, to open the Symbols panel."
> "I'm dragging the selection into the Symbols panel on the right, and in the dialog I'm typing Power as the name and clicking OK, so I can reuse it."
> "Now I'm drawing a shield shape with the Pen tool, and clicking the Type tool in the Tools panel to type IP inside it, because this is the IP rating symbol."
> "I'm dragging that group into the Symbols panel, naming it IP Rating and clicking OK."
> "I'm drawing a bulb circle with small rays around it for the efficacy symbol, dragging it into the Symbols panel, and naming it Efficacy."
> "All three are generic symbols I drew myself, so there are no real certification marks."

## 10. Etiqueta y especificaciones (≈3:00)
> "I'm clicking the Rectangle tool on the left, then clicking the front panel and typing 120 by 42 millimeters, because that's the label size."
> "In the Transform panel I'm typing the X and Y values that center the label inside the front panel."
> "I'm dragging the Power symbol from the Symbols panel on the right onto the label, because it will sit next to the wattage."
> "I'm dragging the IP Rating symbol and then the Efficacy symbol below it, and aligning them using the Align panel on the right."
> "I'm clicking the Type tool in the Tools panel on the left and clicking inside the label at the top, typing LX-300 Linear Luminaire, because it's the product title."
> "I'm clicking beside each symbol and typing its value: 18 watts, IP65 and 130 lumens per watt."
> "I'm clicking in the left column of the label and typing the remaining specifications: 2340 lumens, 220 to 240 volts, 4000 Kelvin and CRI 80."
> "I'm selecting the text and choosing a clean sans-serif in the Character panel on the right, because small technical text must stay legible."

## 11. Código de barras (≈1:30)
> "I'm clicking the Type tool again in the Tools panel on the left and clicking in the right part of the label."
> "I'm typing the test number 2000000000015, because this is an internal-use EAN-13 number, not a real product code."
> "I'm selecting the number and choosing [NOMBRE DE LA FUENTE] in the font drop-down of the Character panel on the right, because this installed font turns the digits into bars."
> "I'm setting the size so the barcode fits inside the label, and checking that there is a quiet zone on both sides, because scanners need empty space."
> "I'm holding the Command key and clicking on empty pasteboard to deselect, and zooming in to confirm the bars are crisp."

## 12. Revisión final (≈1:30)
> "I'm clicking the View menu at the top and choosing Outline, to see only the paths and confirm the dieline has no loose or doubled lines."
> "I'm clicking the View menu again and choosing Preview, to go back to the normal view."
> "I'm clicking the Type menu at the top and choosing Find Font, to confirm every font is available and none is missing."
> "I'm clicking the Window menu, then Document Info, to check that the document uses CMYK and has no stray objects."
> "I'm clicking the front panel and checking in the Transform panel that it still measures 310 by 48, and then the whole layout at 771 by 224."
> "I'm moving the pointer over the label, the symbols and the barcode, to check alignment, spacing and contrast."

## 13. Guardar y exportar (≈2:00)
> "I'm clicking the File menu at the top-left and choosing Save As, to save the Illustrator file."
> "I'm typing artifact two layout in the name field and clicking Save at the bottom right, and then OK in the next window."
> "I'm clicking the File menu again and choosing Save As, because the PDF is created from here."
> "In the dialog, I'm clicking the Format drop-down at the bottom and choosing Adobe PDF, and typing final output one in the name field."
> "I'm clicking Save, and in the Adobe PDF Options window I'm choosing the High Quality Print preset."
> "I'm clicking Marks and Bleeds in the list on the left, checking Trim Marks, and checking Use Document Bleed Settings, because the printer needs trim marks and the 3 millimeter bleed."
> "I'm clicking Save PDF at the bottom right to create the file."
> "The work is finished and saved: the dimensions spreadsheet, the Illustrator file and the PDF."

## 14. Epílogo (3:00-3:45, ratón en movimiento suave)
Completa los corchetes con lo que de verdad te pasó.
> "Now I'll reflect on the work. For completion and outcome, I verified that the spreadsheet results, 771 by 224, match the Transform panel in Illustrator, that the barcode has its quiet zones, and that Find Font found no missing fonts. A limitation is that the product, the symbols and the barcode number are fictional."
> "My approach was to calculate everything in the spreadsheet first, so the dieline is built from numbers instead of by eye."
> "The hardest part was [lo que de verdad te costó]. I handled it by [lo que hiciste]."
> "I'm happy with [lo que quedó bien]. A weakness is [una debilidad real]."
> "With more time, I would [lo que mejorarías]."
> "One thing a less experienced person might overlook is that clearance must be added before calculating the box, and that bleed and quiet zones must be checked before export."

## 15. Detener
> "I'm clicking the TaskRecorder icon in the Dock on the right side of the screen to bring it back, and clicking Stop Recording."
Espera a Stopping > Archiving > Idle.

---

## Después de grabar
1. Mira el video completo en QuickTime: ¿aparece tu nombre o correo en algún sitio? ¿Hay pausas de ratón de más de 45 s?
2. metadata.json (carpeta de la grabación): el campo "apps" contiene Adobe Illustrator y Google Sheets.
3. Deliverables.zip con los archivos SUELTOS (sin subcarpetas):
   - artifact 1 - dimensions.xlsx
   - artifact 2 - layout.ai
   - final output 1 - dieline-label.pdf
4. Subir: video.mp4, recording_TIMESTAMP.zip, Deliverables.zip, Metadata.rtf (aparte).
5. Ejecutar los DOS AutoQC ("Run full AutoQC"), checklist manual y confirmación final.

## Notas de adaptación
- Si tu guion original exige un "input 1", añade un CSV con las dimensiones del producto (producto + holgura) y cámbialo en el paso 3 de "Después de grabar".
- Fuente de código de barras: algunas exigen un texto codificado (con caracteres de inicio, medio y fin) en lugar de los 13 dígitos. Si es tu caso, cambia el texto del paso 11 por el que la fuente indique.
- Los valores de guías (30, 340, 408, 718, 786 en X; 15, 35, 103, 151, 219 en Y) salen de 15 mm de margen + los anchos de panel. Si cambias la holgura, recalcúlalos desde la hoja.
