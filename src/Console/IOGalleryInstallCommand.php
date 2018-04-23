<?php
namespace Dataview\IOGallery\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Dataview\IOGallery\IOGalleryServiceProvider;
use Dataview\IOGallery\GallerySeeder;
use Illuminate\Support\Facades\Schema;
use Dataview\IntranetOne\IntranetOne;

class IOGalleryInstallCommand extends Command
{
    protected $name = 'intranetone-gallery:install';

    protected $description = 'Instalação do serviço para IntranetOne - Gallery';
    public function handle()
    {
      $this->info('Publicando os arquivos...');
        
      IntranetOne::installMessages($this);

      Artisan::call('vendor:publish', [
          '--provider' => IOGalleryServiceProvider::class,
      ]);

      if(!Schema::hasTable('galleries')){
        $this->info('Executando migrações gallery service...');
        Artisan::call('migrate', [
          '--path' => 'vendor/dataview/iogallery/src/database/migrations',
        ]);
      }
      
      IntranetOne::installMessages($this);

      $this->info('registrando serviço...');
      Artisan::call('db:seed', [
        '--class' => GallerySeeder::class,
      ]);
    
      $this->info(' ');
      $this->info('IntranetOne - Gallery Instalado com sucesso! _|_');
    }
}
