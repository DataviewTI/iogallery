<?php
namespace Dataview\IOGallery;

use Dataview\IntranetOne\IOModel;
use Dataview\IntranetOne\File as ProjectFile;
use Dataview\IntranetOne\Group;
use Illuminate\Support\Facades\Storage;

class Gallery extends IOModel
{
  protected $fillable = ['title','description','featured','date_start','date_end','group_id'];

  public function group(){
    return $this->belongsTo('Dataview\IntranetOne\Group');
  }

	public function getMainCategory(){
		$main = $this->categories()->where('main',true)->first();
		return blank($main) ? $this->categories()->first() : $main; 
	}

	public function categories(){
		return $this->belongsToMany('Dataview\IntranetOne\Category','gallery_category')->withPivot('id');
  }
  
  public static function boot(){ 
    parent::boot(); 

    static::created(function (Gallery $obj) {
      $group = new Group([
        'group' => "Album da Galeria ".$obj->id,
        'sizes' => $obj->getAppend("sizes")
      ]);
      $group->save();
      $obj->group()->associate($group)->save();
    });
    
  }
}
