# Portfolio — Diego Quinde | Instrucciones

## Estructura de Carpetas

```
/
├── index.html                    ← Todo el frontend (HTML + CSS + JS vanilla)
├── cv.pdf                        ← Tu CV descargable (cuando lo tengas listo)
├── assets/
│   ├── projects/
│   │   ├── 1.jpg               ← Imágenes de CRE Reporting (automation showcase)
│   │   ├── 2.jpg               ← Imágenes de CRE Reporting (problem statement)
│   │   ├── 3.jpg               ← Imágenes de CRE Reporting (workflow diagram)
│   │   ├── 4.jpg               ← Imágenes de resultados (opcional, no usado aún)
│   │   ├── submittal-sample.png ← Ejemplo de submittal técnico (Boris Lighting)
│   │   ├── Boris Saratoga_v1.pdf   ← PDF del submittal (descargable en futuro)
│   │   └── Geometrio Ceiling Lamp.pdf ← Spec técnica (descargable en futuro)
│   └── certs/
│       └── (futuros certificados con imagen)
├── README.md                    ← Este archivo
└── CLAUDE.md                    ← Documentación del proyecto
```

## Cómo Agregar Imágenes a Proyectos

### Ejemplo: Agregar imagen al proyecto Luxarmonie

1. Sube tu screenshot/imagen a `/assets/projects/`
2. Nombra el archivo: `luxarmonie-validator.jpg` (o similar, sem espacios)
3. En el HTML, dentro del `project-details` del proyecto, agrega:

```html
<div class="mt-4 pt-4 border-t border-gray-600">
    <img src="/assets/projects/luxarmonie-validator.jpg" alt="Descripción de la imagen" class="project-image">
</div>
```

Las imágenes se adaptarán automáticamente al ancho del contenedor.

## Cómo Desplegar en Vercel

### Primera vez:
```bash
cd /mnt/d/portafolio
vercel
# Sigue el prompt, elige "create new project", cuando pregunte por framework di "Other"
```

### Futuras actualizaciones:
```bash
vercel --prod    # Para deploy a producción
# o simplemente
vercel          # Para preview
```

## Archivos Importantes

- **index.html** — Único archivo HTML, contiene todo el código
- **cv.pdf** — Sube tu CV aquí cuando esté listo (link descargable en hero)
- **/assets** — Todas las imágenes y documentos

## Cómo Editar el Portfolio

Todo el código está en `index.html`. Secciones principales:

1. **Hero** — Título principal + typewriter
2. **About** — "Orden en el caos" (tu identidad)
3. **Certifications** — Cards de certificaciones
4. **Projects** — 6 proyectos expandibles (donde van las imágenes)
5. **Stack** — Grid de tecnologías
6. **Experience** — Timeline vertical
7. **Contact** — Email copiable + LinkedIn

## Números Reales Integrados

Del material de Upwork (1.jpg, 2.jpg, 3.jpg):

- **95% Efficiency Gain** — Reclaim billable hours
- **99% Absolute Accuracy** — Audit-ready documents
- **+200 Instant Scaling** — 200+ reports capability

Estos números están ya en la sección CRE Reporting del portfolio.

## Dominio Futuro

Cuando tengas dinero para `diegoquinde.com`:

1. Compra en Namecheap/Porkbun (~$10/año)
2. En Vercel > Settings > Domains, agrega el dominio
3. Copia los 2 registros DNS en Namecheap
4. Propagar en 24h

## Checklist Deployment

- [ ] `vercel` funciona sin errores
- [ ] Portfolio accesible en `diego-quinde.vercel.app`
- [ ] Imagen CRE Reporting carga bien
- [ ] Imagen submittal carga bien
- [ ] Email copy-to-clipboard funciona
- [ ] Accordion de proyectos funciona
- [ ] Links a LinkedIn funcionan
- [ ] Mobile responsive se ve bien

## Próximos Pasos

1. **CV.pdf** — Sube cuando esté listo
2. **Screenshots adicionales** — Agrega más imágenes a otros proyectos
3. **Cover letter** — Redacta para North Highland
4. **LinkedIn** — Actualiza con nuevas narrativas
5. **Dominio** — Cuando tengas presupuesto

---

**Construido con:** HTML + Tailwind CSS (CDN) + Google Fonts + JavaScript Vanilla  
**Deploy:** Vercel (gratis, automático en cada push a GitHub)
