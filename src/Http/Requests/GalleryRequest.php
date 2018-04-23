<?php

namespace Dataview\IOGallery;
use Dataview\IntranetOne\IORequest;

class GalleryRequest extends IORequest
{
  public function sanitize(){
    $input = parent::sanitize();

    $input['featured'] = (int)($input['__featured']=='true');
    $input['date_start'] = $input['date_start_submit'];
    $input['date_end'] =  $input['date_end_submit'];
    $input['sizes'] = $input['__dz_copy_params'];

    $arr = explode(',',$input['__cat_subcats']);
    $_cats=[];
    array_walk($arr,function($a,$b) use (&$_cats){
      $_cats[$a] = ['main'=>($b ? false : true)];
    });
    $input['__cat_subcats_converted'] = $_cats;

    $this->replace($input);
	}

  public function rules(){
    $this->sanitize();
    return [
      'title' => 'required|max:255',
    ];
  }
}
