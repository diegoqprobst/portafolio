# Dibujos de línea para la raíz

Especificación para los grabados que vas a dibujar tú. Si los entregas así,
entran en la página sin retoques y se tiñen solos con la tinta del sistema.

## Formato

**SVG**, siempre que puedas. Es lo que deja que el dibujo escale y que yo le
cambie el color y el grosor desde CSS sin tocar el archivo.

- `fill="none"` en todo. Solo trazos, nada de relleno.
- `stroke="currentColor"`. Así hereda la tinta: crema sobre el campo,
  periwinkle sobre el papel, sin duplicar archivos.
- Nada de `style=""` con colores dentro, ni gradientes, ni sombras, ni
  máscaras, ni imágenes rasterizadas embebidas.
- `viewBox` ajustado al dibujo, sin lienzo de sobra alrededor.
- Sin `width`/`height` fijos (si los trae, los quito yo).
- Dos grosores como mucho: línea principal y línea de detalle.
- Remates a inglete o rectos (`miter` / `butt`), no redondeados: el colibrí
  es redondeado porque es la marca, pero el dibujo técnico es de escuadra.
- Sin texto dentro del SVG. Las cotas y etiquetas van como texto vivo en la
  página, para que funcionen en inglés y español y se puedan seleccionar.

Si te sale más cómodo en PNG: fondo transparente, negro puro, mínimo 1600 px
de ancho. Pierdo el control del grosor, pero funciona.

## Grosor de línea

El truco es pensarlo relativo al `viewBox`, no en píxeles:

```
stroke-width principal ≈ ancho del viewBox ÷ 350
stroke-width de detalle ≈ ancho del viewBox ÷ 700
```

Con un `viewBox` de 1000 de ancho: **2.9** para la línea principal y **1.4**
para el detalle. Así lee a 1.5 px en pantalla sin desaparecer en el móvil.

Regla de supervivencia: si una línea baja de 0.75 px cuando el dibujo se ve a
360 px de ancho, sobra. Dibuja menos detalle, no más fino.

## Las piezas y sus proporciones

| Archivo | Proporción | Dónde va | Ancho en pantalla |
|---|---|---|---|
| `cover-building.svg` | ~3:2 apaisado | Plancha de portada, en crema sobre la tinta | 420–560 px |
| `frieze.svg` | 10:1 a 14:1 | Banda al pie de las secciones de tinta, como los frisos interiores | hasta 1240 px |
| `plate-01.svg` … | 8:5 | Sustituye o acompaña a las láminas de trabajo | hasta 620 px |
| `watermark.svg` | libre | Muy tenue detrás del papel, como un plano impreso por debajo | variable |

No hacen falta todas. Con la de portada ya se nota.

## Dónde ponerlos

```
public/assets/drawings/
```

Nómbralos como la tabla. En cuanto estén ahí los cableo.

## Lo que necesito de ti con cada uno

Una línea diciendo **qué es** el dibujo: va al `alt`, que es lo que lee quien
usa lector de pantalla y lo que leen los motores de respuesta. Por ejemplo
«elevación de la luminaria DSDP25 con sus cotas» o «alzado del pabellón».

## Una nota sobre qué dibujar

El Guggenheim queda espectacular en este lenguaje, pero es un edificio de
Gehry: en tu portafolio puede leerse como un proyecto tuyo. Tus propias
elevaciones de luminaria —las que ya están dentro de los submittals— dicen lo
que haces y son tuyas de verdad. Si el edificio es por el gusto visual, y no
por atribución, funciona igual; solo conviene que el pie lo deje claro.
