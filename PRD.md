# Easy Reader - Product Requirements Document (PRD)

## 1. Objetivo del Producto
Easy Reader es una aplicación web diseñada para mejorar la experiencia de lectura en dispositivos móviles. Permite a los usuarios cargar archivos PDF o ingresar enlaces a páginas web para visualizar contenido con desplazamiento automático. Los usuarios podrán elegir entre diferentes modos de lectura que facilitan la navegación sin necesidad de interacción manual, mejorando la accesibilidad y comodidad.

## 2. Alcance del Producto
Easy Reader está dirigido a un público general, con especial énfasis en mejorar la accesibilidad para personas con discapacidades motoras o visuales. La aplicación ofrecerá:
- Carga de archivos PDF y lectura de enlaces web.
- Modos de lectura con desplazamiento automático:
  - **Acelerómetro**: Control del scroll mediante la inclinación del dispositivo.
  - **Detección de rostro**: Identificación de patrones de movimiento del rostro para desplazamiento.
  - **Gestos de manos** (futuro): Posible implementación de control por gestos para accesibilidad.
- Configuración de la velocidad de desplazamiento con un valor predeterminado.
- Uso sin registro con almacenamiento local y opción de registro para guardar PDFs y enlaces.



## 3. Requisitos Funcionales
- El usuario podrá subir un archivo PDF o ingresar una URL.
- La aplicación ofrecerá tres modos de lectura (acelerómetro, detección de rostro, gestos de manos en el futuro).
- Opción de ajustar la velocidad de desplazamiento.
- Almacenamiento local para usuarios sin cuenta y almacenamiento en la nube para usuarios registrados.
- Interfaz responsiva optimizada para dispositivos móviles.

## 4. Requisitos No Funcionales
- Debe funcionar en navegadores modernos en dispositivos móviles.
- Debe garantizar un rendimiento fluido para evitar retrasos en el desplazamiento.
- Seguridad en el almacenamiento de archivos para usuarios registrados.
- Código modular y escalable para futuras mejoras (PWA en el futuro).

## 5. Casos de Uso Principales
### Caso de uso 1: Lectura sin registro
**Actor:** Usuario sin cuenta
**Flujo:**
1. El usuario carga un PDF o ingresa una URL.
2. Selecciona un modo de lectura.
3. La aplicación inicia el desplazamiento automático.
4. El usuario ajusta la velocidad si es necesario.
5. Cierra la aplicación sin necesidad de guardar datos.

### Caso de uso 2: Lectura con cuenta registrada
**Actor:** Usuario registrado
**Flujo:**
1. El usuario inicia sesión.
2. Carga un PDF o ingresa una URL.
3. Selecciona un modo de lectura.
4. Configura la velocidad de desplazamiento.
5. La aplicación guarda el archivo o enlace para futuras sesiones.

## 6. Tecnologías y Arquitectura Inicial
- **Frontend:** Angular.
- **Backend:** Node.js con Prisma ORM.
- **Base de datos:** PostgreSQL (para usuarios registrados).
- **Almacenamiento de PDFs:** Local en el cliente en modo libre; almacenamiento en la nube para usuarios registrados.

---

Este documento servirá como base para el desarrollo de **Easy Reader**, guiando la creación de modelos de datos, arquitectura y desarrollo de funcionalidades.

