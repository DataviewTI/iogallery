# Galeria de imagens para IntranetOne 2

Galeria de imagens com opção de multiplas dimensões e recorte.

## Instalação

#### Composer installation

Laravel 7 or above, PHP >= 7.2.5

```sh
composer require dataview/iogallery dev-master
```

laravel 5.6 or below, PHP >= 7 and < 7.2.5

```sh
composer require dataview/iogallery 1.0.0
```

#### Laravel artisan installation

```sh
php artisan io-gallery:install
```

- necessária atualização dos packages npm

```sh
npm update
```

- Configure o webpack conforme abaixo

```js
...
let gallery = require('intranetone-gallery');
io.compile({
  services:[
    ...
    new gallery(),
    ...
  ]
});

```

- Compile os assets e faça o cache

```sh
npm run dev|prod|watch
php artisan config:cache
```
