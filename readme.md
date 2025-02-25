# Proyecto Final - Juan Ignacio Armas

## Programación Backend II: Diseño y Arquitectura Backend - Comisión 70370

## Descripción del Proyecto

Se implementará en el proyecto ecommerce facilitado al inicio del curso un CRUD de usuarios, junto con un sistema de Autorización y Autenticación

## Objetivos generales

Profesionalizar el servidor desarrollado en la primera preentrega Objetivos específicos.

## Objetivos específicos

Aplicar una arquitectura profesional para nuestro servidor 
Aplicar prácticas como patrones de diseño, mailing, variables de entorno. etc.

## Se debe entregar

- Modificar nuestra capa de persistencia para aplicar los conceptos de DAO y DTO.
- Implementar el patrón Repository para trabajar con el DAO en la lógica de negocio.
- Modificar la ruta /current Para evitar enviar información sensible, enviar un DTO del usuario sólo con la información necesaria.
- Realizar un middleware que pueda trabajar en conjunto con la estrategia “current” para hacer un sistema de autorización y delimitar el acceso a dichos endpoints:
  - Sólo el administrador puede crear, actualizar y eliminar productos.
  - Sólo el usuario puede agregar productos a su carrito.
- Crear un modelo Ticket el cual contará con todas las formalizaciones de la compra. Éste contará con los campos:
  - Id (autogenerado por mongo)
  - code: String debe autogenerarse y ser único
  - purchase_datetime: Deberá guardar la fecha y hora exacta en la cual se formalizó la compra (básicamente es un created_at)
  - amount: Number, total de la compra.
  - purchaser: String, contendrá el correo del usuario asociado al carrito.
- Implementar, en el router de carts, la ruta /:cid/purchase, la cual permitirá finalizar el proceso de compra de dicho carrito.
  - La compra debe corroborar el stock del producto al momento de finalizarse
    - Si el producto tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces restarlo del stock del producto y continuar.
    - Si el producto no tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces no agregar el producto al proceso de compra.
    - Al final, utilizar el servicio de Tickets para poder generar un ticket con los datos de la compra.
    - En caso de existir una compra no completada, devolver el arreglo con los ids de los productos que no pudieron procesarse.
  - Una vez finalizada la compra, el carrito asociado al usuario que compró deberá contener sólo los productos que no pudieron comprarse. Es decir, se filtran los que sí se compraron y se quedan aquellos que no tenían disponibilidad.


##  Formato
 - Link al repositorio de Github con el proyecto completo, sin la carpeta de Node_modules.
 - Además, archivo .env para poder correr el proyecto

##  Postman
  - Se encuentra disponible el en Github el archivo *Backend EntregaFinal.postman_collection.json* para importar en Postman para tener una visión más clara de las rutas y los endpoints.

## Dependencias:

Este proyecto utiliza las siguientes dependencias:

```json
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "D": "^1.0.0",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.10.1",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "uuid": "^11.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
```
git clone https://github.com/neptunonet/Backend_2_EntregaFinal_JuanArmas.git

