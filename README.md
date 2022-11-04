<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar

```
yarn install
```

3. Tener Nest CLI instalado

```
npm i g @nestjs/cli
```

4. Levantar base de datos (Docker desktop)

```
docker-compose up -d
```

5. Clonar el archivo `.env.template` y renombrar la copia a `.env`

6. Llenar la variables de entorno definidas en el `.env`

7. Ejecutar la aplicación de dev:

```
yarn start:dev
```
