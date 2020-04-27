<?php
namespace Dataview\IOGallery;

use Illuminate\Database\Seeder;
use Dataview\IntranetOne\Service;
use Sentinel;
use Dataview\IntranetOne\Category;
use Illuminate\Support\Str;

class GallerySeeder extends Seeder
{
    public function run(){
      //cria o serviço se ele não existe
      if(!Service::where('service','Gallery')->exists()){
        $service = Service::insert([
            'service' => "Gallery",
            'alias' =>'gallery',
            'trans' =>'Galeria',
            'ico' => 'ico-image',
            'description' => 'Galeria de Imagens',
            'order' => Service::max('order')+1
          ]);
      }
      else
       $service = Service::where('service', 'Gallery')->first();

      //seta privilegios padrão para o user odin
      $odinRole = Sentinel::findRoleBySlug('odin');
      $odinRole->addPermission('gallery.view');
      $odinRole->addPermission('gallery.create');
      $odinRole->addPermission('gallery.update');
      $odinRole->addPermission('gallery.delete');
      $odinRole->save();

      //seta privilegios padrão para o role admin
      $adminRole = Sentinel::findRoleBySlug('admin');
      $adminRole->addPermission('gallery.view');
      $adminRole->addPermission('gallery.create');
      $adminRole->addPermission('gallery.update');
      $adminRole->addPermission('gallery.delete');
      $adminRole->save();

      //Adiciona a categoria e subcategorias padrão
      if(!Category::where('Category','Gallery')->exists()){
        $gal = Category::create([
          'service_id' => $service->id,
          'category' => 'Gallery',
          'category_slug' => 'gallery',
           'description' => 'Main category for galleries',
           'erasable'=>false,
           'order' => 0
        ]);

        $cats = ['Geral'];
        foreach($cats as $c){
          Category::create([
            'service_id' => $service->id,
            'category_id' => $gal->id,
            'category' => $c,
            'erasable'=>false,
            'category_slug' => Str::slug($c),
            'order' => (Category::where('category_id',$gal->id)->max('order'))+1
          ]);
        }
      }
    }
} 
