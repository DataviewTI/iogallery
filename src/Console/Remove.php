<?php
namespace Dataview\IOGallery\Console;
use Dataview\IntranetOne\Console\IOServiceRemoveCmd;
use Dataview\IOGallery\IOGalleryServiceProvider;
use Dataview\IntranetOne\IntranetOne;


class Remove extends IOServiceRemoveCmd
{
  public function __construct(){
    parent::__construct([
      "service"=>"gallery",
      "tables" =>['gallery_category','galleries'],
    ]);
  }

  public function handle(){
    parent::handle();
  }
}
