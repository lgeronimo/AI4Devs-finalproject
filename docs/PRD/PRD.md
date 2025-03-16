# Easy Reader - Product Requirements Document (PRD)

## 1. Objetivo del Producto
Easy Reader es una aplicación web diseñada para mejorar la experiencia de lectura en dispositivos móviles. Permite a los usuarios cargar archivos PDF o ingresar enlaces a páginas web para visualizar contenido con desplazamiento automático. Los usuarios podrán elegir entre diferentes modos de lectura que facilitan la navegación sin necesidad de interacción manual, mejorando la accesibilidad y comodidad.

## 2. Alcance del Producto
Easy Reader está dirigido a un público general, con especial énfasis en mejorar la accesibilidad para personas con discapacidades motoras o visuales. La aplicación ofrecerá:
- Carga de archivos PDF y lectura de enlaces web.
- Modos de lectura con desplazamiento automático:
  - **Acelerómetro**: Control del scroll mediante la inclinación del dispositivo.
  - **Detección de rostro**: Identificación de patrones de movimiento del rostro para desplazamiento.
- Uso sin registro con almacenamiento local y opción de registro para guardar PDFs y enlaces.

### **Funcionalidades futuras**  
1. **Modos de lectura con desplazamiento automático:**
   - **Gestos de manos**: Posible implementación de control por gestos para accesibilidad.
   - **Acelerómetro**: Posibilidad para configurar la velocidad de desplazamiento.
1. **Modo oscuro y claro:** El usuario podrá cambiar entre un tema **dark** o **light**.  
2. **Ajuste de brillo:** Se podrá modificar el brillo de la pantalla para mejorar la experiencia de lectura.  
3. **Notas y subrayado:**  
   - Los usuarios podrán **agregar notas** y **subrayar texto** en los documentos.  
   - Estas notas se **almacenarán localmente** en primera instancia.  
   - Para usuarios registrados, las notas y subrayados podrán **guardarse en la base de datos** para acceder a ellos en diferentes sesiones y dispositivos.  

## 3. Requisitos del Producto  

### 3.1. Requisitos Funcionales
- El usuario podrá subir un archivo **PDF** o ingresar una **URL**.
- El sistema le pedirá al usuario seleccionar un **modo de lectura automática**. 
- Dependiendo del modo de lectura automático seleccionado, **el sistema detectará la inclinación del dispositivo o la orientación del rostro para mover el scroll de forma automática**.
- **Usuarios no registrados:** Solo podrán visualizar archivos de forma local.  
- **Usuarios registrados:** Podrán guardar y gestionar sus archivos y enlaces. 


### 3.2. Requisitos No Funcionales
- **Responsividad:** La aplicación debe funcionar en distintos tamaños de pantalla.  
- **Compatibilidad:** Soporte para navegadores modernos (Chrome, Firefox, Safari, Edge).  
- **Privacidad:** Los archivos de usuarios no registrados no se almacenarán en el servidor.  
- **Escalabilidad:** Arquitectura preparada para una futura conversión a **PWA**.  




## 4. Casos de Uso Principales  


### Caso de uso 1: Lectura sin registro
**Actor:** Usuario sin cuenta.

**Descripción:** Proceso de visualización y lectura automatizada de documentos PDF o contenido web mediante los modos de desplazamiento inteligente del sistema.

**Precondiciones:** 
- El usuario tiene acceso a la aplicación web
- El usuario dispone de un archivo PDF o URL para cargar

**Flujo principal:**
1. El usuario abre la aplicación y selecciona la opción "Cargar PDF" o "Ingresar URL"
2. El sistema valida el formato del archivo o accesibilidad de la URL
3. El sistema solicita al usuario seleccionar un modo de lectura automática:
   - Detección de rostro
   - Acelerómetro 
4. El usuario selecciona el modo deseado
5. El sistema solicita los permisos necesarios según el modo elegido:
   - Permiso de cámara (modo detección de rostro)
   - Permiso de acelerómetro (modo acelerómetro)
6. El sistema inicia el desplazamiento automático según:
   - La inclinación del dispositivo (modo acelerómetro)
   - La dirección de la mirada (modo detección de rostro)

**Flujos alternativos:**
1. Si el archivo no es un PDF válido o la URL no es accesible:
   - El sistema muestra un mensaje de error
   - Permite al usuario intentar nuevamente
2. Si los permisos son denegados:
   - El sistema notifica al usuario que no podrá usar ese modo
   - Solicita seleccionar un modo alternativo
3. Durante la lectura:
   - El usuario puede pausar el desplazamiento automático
   - El usuario puede ajustar la velocidad de desplazamiento
   - El usuario puede cambiar entre modos de lectura

**Postcondiciones:**
- El documento o página web se visualiza correctamente
- El desplazamiento automático funciona según el modo seleccionado
- Los datos de lectura se mantienen solo en la sesión actual (session storage)

### Caso de uso 2: Lectura con cuenta registrada
**Actor:** Usuario registrado

**Descripción:** Proceso de lectura con funcionalidades adicionales para usuarios registrados, incluyendo guardado y gestión de documentos.

**Precondiciones:**
- El usuario tiene una cuenta registrada
- El usuario ha iniciado sesión en la aplicación

**Flujo principal:**
1. El usuario inicia sesión en la aplicación
2. El sistema muestra el dashboard con documentos guardados
3. El usuario puede:

   a. Seleccionar un documento guardado previamente

   b. Cargar un nuevo PDF o ingresar URL

4. El sistema procede con el flujo de lectura (similar al caso 1)
5. La aplicación guarda automáticamente el progreso de lectura

**Flujos alternativos:**
1. Gestión de documentos:
   - El usuario puede editar el nombre del documento
   - El usuario puede eliminar documentos guardados
   - El usuario puede compartir documentos (futuro)
2. Gestión de cuenta:
   - El usuario puede actualizar sus datos de perfil
   - El usuario puede configurar preferencias de lectura
3. Durante la lectura:
   - El usuario puede agregar marcadores (futuro)
   - El usuario puede hacer anotaciones (futuro)
   - El sistema va guardando el progreso de lectura

**Postcondiciones:**
- Los documentos y configuraciones se guardan en la base de datos
- El progreso de lectura se mantiene entre sesiones
- Las preferencias del usuario se aplican automáticamente en futuras lecturas

## 6. Tecnologías y Arquitectura Inicial
- **Frontend:** Angular.
- **Backend:** Node.js con Prisma ORM.
- **Base de datos:** PostgreSQL (para usuarios registrados).
- **Almacenamiento de PDFs:** Local en el cliente en modo libre; almacenamiento en la nube para usuarios registrados.

---

Este documento servirá como base para el desarrollo de **Easy Reader**, guiando la creación de modelos de datos, arquitectura y desarrollo de funcionalidades.

