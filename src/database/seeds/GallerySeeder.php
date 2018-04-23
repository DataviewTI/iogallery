<?php
namespace Dataview\IOGallery;

use Illuminate\Database\Seeder;
use Dataview\IntranetOne\Service;
use Sentinel;
use Dataview\IntranetOne\Category;

class GallerySeeder extends Seeder
{
    public function run(){
      //cria o serviço se ele não existe
      if(!Service::where('service','Gallery')->exists()){
        Service::insert([
            'service' => "Gallery",
            'ico' => 'ico ico-save',
            'description' => 'Galeria de Imagens',
            'order' => Service::max('order')+1
          ]);
      }
      //seta privilegios padrão para o user admin
      $user = Sentinel::findById(1);
      $user->addPermission('gallery.view');
      $user->addPermission('gallery.create');
      $user->addPermission('gallery.update');
      $user->addPermission('gallery.delete');
      $user->save();

      //Adiciona a categoria e subcategorias padrão
      if(!Category::where('Category','Gallery')->exists()){
        $gal = Category::create([
          'category' => 'Gallery',
          'category_slug' => 'gallery',
           'description' => 'Main category for galleries',
           'erasable'=>false,
           'order' => 0
        ]);

        $cats = ['Geral'];
        foreach($cats as $c){
          Category::create([
            'category_id' => $gal->id,
            'category' => $c,
            'erasable'=>false,
            'category_slug' => str_slug($c),
            'order' => (Category::where('category_id',$gal->id)->max('order'))+1
          ]);
        }
      }
    }
} 
