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

Vamos a emepzar a generar el contenido de @pdf-viewer.component.ts @pdf-viewer.component.html @pdf-viewer.component.scss , por ahora no vamos a conectarnos con servicios, solamente las funcionalidades correspondientes a este componente, las caracteristicas marcadas como futuras, esas las omitiremos por el momento,recuerda que todas las caractirísticas las tenemos en @PRD.md @template.md 

## Prompt 5

Vamos a iniciar por pedir el archivo pdf, para esto puse una imagen @upload-pdf.png, apégate a la imagen lo más que puedas, para que se vea lo más similar posible a la imagen.

## Prompt 6

Vamos a separar todo la lógica en pequeños componentes para no tener toda la lógica en un solo componente, dentro de @pdf-viewer únicamente vamos a tener la referencia a los componentes que vamos a crear.

## Prompt 7

Ahora vamos a crear la página web-viewer, la de este componente es pedir una url y mostrar el contenido de la url en un iframe, el componente se llamará web-viewer.component.ts @web-viewer.component.html @web-viewer.component.scss.

Toma como referencia la page @pdf-viewer para que se vea lo más similar posible en cuanto a la estructura de la página, estilos y funcionalidades.

Recuerdo apaegarte a las buenas prácticas de desarrollo de software, para que el código sea lo más limpio y fácil de entender posible.

## Prompt 8

Vamos a crear el componente de upload-pdf, el cual se encargará de subir el archivo pdf a la aplicación, el componente se llamará upload-pdf.component.ts @upload-pdf.component.html @upload-pdf.component.scss.


## Prompt 9

Vamos a crear la página principal dentro de @reader, el objetivo de esta página es darle la opción al usuario de seleccionar entre un pdf o una URL para después redireccionar a @pdf-viewer o @web-viewer.

El contenido de la página será el siguiente:

1. Título de la página "Easy reader" en una fuente que sea facíl de leer y que rasalte, ya sea con algún efecto de sombra o brillo.
2. Un pequeño eslogan de la aplicación, algo como "The easiest way to...."
3. Dos opciones para seleccionar:
   - Leer desde PDF
   - Ingresar un URL Web
4. Un botón para iniciar la lectura.

Todo esto en inglés y recuerda seguir usanndo buenas prácticas, antes de crear código dame la estructura de carpetas que propones y en cuanto a estilos, básate en los componente que ya hicimos dentro de  @reader 

## Prompt 10

Vamos a crear el componente de voice-reader, el cual se encargará de leer el contenido de un pdf o una URL en voz, el componente se llamará voice-reader.component.ts @voice-reader.component.html @voice-reader.component.scss.

## Prompt 11

Vamos a crear los controles para los modos de lectura, inicaindo por el control general que va a ser relativamente discreto en las vistas @pdf-viewer y @web-viewer, vamos a iniciar por ese componente, el cual se llamará reader-control, este componente se ubicará en la carpeta @reader/components/reader-control.

Este componente tendrá dos objetivos:

1. Mostrar las opciones dependiendo del modo de lectura que se esté utilizando.
2. Permitir al usuario cambiar al modo de lectura que desee.

En cuanto a estilos, básate en los componentes que ya hicimos dentro de  @reader. Pero este tiene que ser discreto y no tan obvio como los que ya tenemos. Podemos probar con un botón transparente o con un icono y al pasarle el cursor se vera el botón. 

## Prompt 12

Vamos a crear el componente de voice-reader, el cual se encargará de leer el contenido de un pdf o una URL en voz, el componente se llamará voice-reader.component.ts @voice-reader.component.html @voice-reader.component.scss.

