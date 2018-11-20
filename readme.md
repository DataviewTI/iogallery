
# Galeria de imagens para IntranetOne
Galeria de imagens com opção de multiplas dimensões e recorte.
## Conteúdo
 
## Instalação

```sh
composer require dataview/iogallery
```
```sh
php artisan io-gallery:install
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
