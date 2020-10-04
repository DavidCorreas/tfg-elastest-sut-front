# TFG-ELASTEST-SUT-FRONT
En este repositorio se encuentra la aplicación Angular de la [aplicación hecha con
 stack MEAN][tfg-elastest]. Es un proyecto generado con 
 [Angular CLI](https://github.com/angular/angular-cli) versión 9.1.5. 

## Objetivos
Provee un frontend web hecho con Angular el cual se conectará con el [backend de está 
apliación][tfg-elastest-sut-back].

Está disenada para ser desplegado junto al resto de la apliación, ya que buscará el 
_endpoint_ del backend por `localhost:3000`.

## Componentes
Se trata de una aplicación Angular estandar por lo que su estructura será igual
a cualquier proyecto Angular. Únicamente se comentará configuraciones que se puedan
modificar para modificar la apliación.

### Variables de entorno
Puede ser necesario cambiar alguna variable de entorno para poder modificar el 
comportamiento de la aplicación. Este es el caso de querer modificar el endpoint 
del backend, si ha sido desplegado en otra máquina que no haya sido la local.

Estos ficheros de configuración de las variables de entorno se encuentran en el
directorio `./src/environments`. Se encuentran dos ficheros:
- environment.prod.ts:Para que el proyecto se despliegue con estas variables
es necesaro desplegarlo con el comando: `ng build --configuration production`
- environment.ts: Para que el proyecto se despliegue con las variables por defecto. 
Estas son las variables que se usarán cuando se construya la aplicación y definen el 
backend en `localhost:3000`

## Despliegue
Se mostrarán varias formas de desplegar la aplicación Angular.

### Docker
Para desplegar la aplicación con docker se ha proporcionado un dockerfile en la raíz
del proyecto. Para desplegarlo:

`cd tfg-elastest-front`

`docker build -t angular-front .`

`docker run -p 4200:4200 angular-front`

### Servidor de desarrollo
Para que node nos despliegue un servidor automáticamente en nuestra máquina para proporcionarnos
la página:

`ng serve` 

Navegar a `http://localhost:4200/`. La aplicacións se recargará automáticamente en cuanto se modifiquen
ficheros

### Construcción

`ng build` para construir el proyecto.

Los artefactos de la aplicación se guardarán en `dist/`. Usa el `--prod` para construirlo en
modo producción.

[tfg-elastest]: https://github.com/DavidCorreas/tfg-elastest
[tfg-elastest-sut-back]: https://github.com/DavidCorreas/tfg-elastest-sut-back.git
