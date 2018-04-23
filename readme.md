
# Galeria de fotos para IntranetOne
Galeria de fotos...
IOGallery requires IntranetOne
## Conteúdo
 
- [Instalação](#instalação)
- [Assets](#assets) 

## Instalação

```sh
composer require dataview/iogallery
```
Instalar o IntranetOne com php artisan
```sh
php artisan intranetone-gallery:install
```


## Assets
  
 - Instalar pacote js da intranetone
 `bower install intranetone-gallery --save`


### Configurações Manuais

Abrir o package em "resources/vendors/dataview-intranetone-gallery/src" e inserir o conteúdo do arquivo "append_webpack.js" no webpack do projeto

 - Compilar os assets e fazer cache
 `npm run dev|prod|watch`
 `php artisan config:cache`
 