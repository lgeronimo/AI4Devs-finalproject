# Chatbot: Cursor - Claude Sonnet 3.5

## Prompt 1

Haz un análisis de toda la documentación @PRD.md @template.md, avísame cuando hayas terminado.


## Prompt 2

Vamos a generar la estructura del proyecto frontend, para esto asume el rol de arquitecto de software y desarrollador frontend, con basto conocimiento de angular, typescript, html, css, scss y que se apega en todo momento a las buenas prácticas de desarrollo de software. 

El proyecto ya lo generé ocupando angular CLI y este proyecto sigue la arquitectura clean architecture y por ahora únicamente es el cascarón del proyecto, no tiene funcionalidades.

Sabiendo eso, vamos a generar  las carpetas principales (core, features y shared) junto con sus carpetas internas tal cual están en archivo @template.md, en la sección 2.3  Descripción de alto nivel del proyecto y estructura de ficheros.

Recueda, unicamente vamos a generar las carpetas principales y sus carpetas internas, no vamos a generar los archivos de cada carpeta, eso lo vamos a hacer en pasos posteriores.

## Prompt 3

Vamos a proceder a crear el feature de reader, iniciando por la carpeta pages, luego components, services y models.

Vamos a ir pasos a paso, conforme te lo vaya indicando.

## Prompt 4

Vamos a emepzar a generar el contenido de @pdf-viewer.component.ts @pdf-viewer.component.html @pdf-viewer.component.scss , por ahora no vamos a conectarnos con servicios, solamente las funcionalidades correspondientes a este componente, las caracteristicas marcadas como futuras, esas las omitiremos por el momento,recuerda que todos las caractirísticas las tenemos en @PRD.md @template.md 

## Prompt 5

Vamos a iniciar por pedir el archivo pdf, para esto puse una imagen @upload-pdf.png, vamos a generar el componente de carga de archivo pdf, para esto vamos a usar el componente de carga de archivos de angular, el cual se llama FileUploadComponent, vamos a usarlo para cargar el archivo pdf.

