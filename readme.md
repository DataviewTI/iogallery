# Galeria de imagens para IntranetOne 1.1

Galeria de imagens com opção de multiplas dimensões e recorte.

## Conteúdo

## Instalação

```sh
composer require dataview/iogallery
```

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
