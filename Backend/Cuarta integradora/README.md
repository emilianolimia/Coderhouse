# E-commerce API

## Descripción

Este proyecto es una API para una plataforma de e-commerce. Permite la gestión de productos, carritos de compras y usuarios, incluyendo funcionalidades avanzadas como la recuperación de contraseñas, roles de usuario, generación de tickets de compra, y un sistema de logging robusto. La API está documentada usando Swagger.

## Características Principales

- **Gestión de Productos**: Crear, actualizar, eliminar y listar productos. Los usuarios premium pueden crear productos y solo pueden eliminar sus propios productos.
- **Gestión de Carritos**: Agregar y eliminar productos en carritos de compras, finalizar compras con verificación de stock y generación de tickets.
- **Recuperación de Contraseñas**: Enviar correos para restablecer contraseñas con enlaces que expiran en 1 hora.
- **Roles de Usuario**: Los usuarios pueden ser "user" o "premium". Los usuarios premium tienen permisos adicionales para gestionar productos.
- **Logging**: Sistema de logging configurado con diferentes niveles para desarrollo y producción.
- **Documentación con Swagger**: La API está documentada y disponible en el endpoint `/api-docs`.

## Tecnologías Utilizadas

- Node.js
- Express.js
- MongoDB
- Mongoose
- Handlebars
- Nodemailer
- Winston
- Swagger

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/emilianolimia/Coderhouse/tree/main/Backend/ecommerce-api.git
cd ecommerce-api
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar las variables de entorno:

Crear un archivo `.env` en la raíz del proyecto y agregar las siguientes variables:

```
MONGODB_URI=<tu_uri_de_mongodb>
JWT_SECRET=<tu_secreto_jwt>
NODEMAILER_USER=<tu_usuario_de_email>
NODEMAILER_PASS=<tu_contraseña_de_email>
```

4. Iniciar el servidor:

```bash
npm start
```

El servidor se ejecutará en `http://localhost:8080`.

## Endpoints Principales

### Productos

- **GET /api/products**: Obtener todos los productos.
- **GET /api/products/:id**: Obtener un producto por ID.
- **POST /api/products**: Crear un nuevo producto.
- **PUT /api/products/:id**: Actualizar un producto por ID.
- **DELETE /api/products/:id**: Eliminar un producto por ID.

### Carritos

- **GET /api/carts**: Obtener todos los carritos.
- **GET /api/carts/:id**: Obtener un carrito por ID.
- **POST /api/carts**: Crear un nuevo carrito.
- **POST /api/carts/:cid/product/:pid**: Agregar un producto a un carrito.
- **DELETE /api/carts/:cid**: Eliminar un carrito por ID.
- **DELETE /api/carts/:cid/products/:pid**: Eliminar un producto de un carrito.
- **POST /api/carts/:cid/purchase**: Finalizar la compra de un carrito.

### Usuarios

- **POST /api/users/register**: Registrar un nuevo usuario.
- **POST /api/users/login**: Iniciar sesión.
- **POST /api/users/password-reset**: Solicitar restablecimiento de contraseña.
- **POST /api/users/password-reset/:token**: Restablecer contraseña usando el token recibido por email.
- **POST /api/users/premium/:uid**: Cambiar el rol de un usuario entre "user" y "premium".

## Uso

### Recuperación de Contraseña

Para recuperar la contraseña, el usuario debe enviar su correo a `/api/users/password-reset`. Recibirá un correo con un enlace para restablecer su contraseña. El enlace expira en 1 hora.

### Roles de Usuario

Un usuario puede cambiar su rol entre "user" y "premium" accediendo al endpoint `/api/users/premium/:uid`.

### Logging

El sistema de logging utiliza Winston. En desarrollo, se loguean todos los niveles a la consola. En producción, se loguean los niveles a partir de "info" a la consola y los niveles a partir de "error" también se guardan en un archivo `errors.log`.

### Documentación

La documentación de la API está disponible en el endpoint `/api-docs` gracias a Swagger.