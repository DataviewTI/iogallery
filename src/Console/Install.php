<?php
namespace Dataview\IOGallery\Console;
use Dataview\IntranetOne\Console\IOServiceInstallCmd;
use Dataview\IOGallery\IOGalleryServiceProvider;
use Dataview\IOGallery\GallerySeeder;

class Install extends IOServiceInstallCmd
{
  public function __construct(){
    parent::__construct([
      "service"=>"gallery",
      "provider"=> IOGalleryServiceProvider::class,
      "seeder"=>GallerySeeder::class,
    ]);
  }

  public function handle(){
    parent::handle();
  }
}
