 Farmacia Es Vedrà

Aplicación web de farmacia online desarrollada como proyecto de prácticas. Permite gestionar productos por categorías, realizar pedidos, y administrar usuarios según roles.

 Tecnologías utilizadas

- Frontend**: Angular 17, Firebase Hosting
- Backend**: FastAPI (Python), desplegado en Google Cloud Run
- Base de datos**: Firestore (NoSQL)
- Autenticación**: Firebase Auth (con roles `admin` e `iuser`)
- Almacenamiento de imágenes**: Firebase Storage

 Funcionalidades

- Registro de usuarios con rol y foto
- Login con email y Google
- Vista personalizada según rol (admin / usuario)
- Gestión de productos por categoría
- Añadir productos al carrito
- Realización y visualización de pedidos
- Exportación de pedidos a CSV (solo admin)

 Cómo ejecutarlo en local

 Frontend

```bash
cd farmacia-web

ng serve
