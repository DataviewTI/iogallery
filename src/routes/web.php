<?php
/*
  funções declaradas dentro do web.php geram erro no artisan config:cache, mensagem de declaração duplicada
  sem existir, por isso foi usado o helper;
*/

use Dataview\IntranetOne\Category;

Route::get('teste',function(){
  
  $categories = Category::select('id','category','category_id')
  ->whereHas('maincategory',function($q){
      $q->where('category','Gallery');
  })
  ->get();

  //dd($categories);
  return $categories;
});

Route::get('gallery/{id?}',function($id=null){
  return view('Gallery::fe.gallery',['id'=>$id]);
});


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                                                                                                              
██╗     ██████╗              ██████╗      █████╗     ██╗         ██╗         ███████╗    ██████╗     ██╗   ██╗
██║    ██╔═══██╗            ██╔════╝     ██╔══██╗    ██║         ██║         ██╔════╝    ██╔══██╗    ╚██╗ ██╔╝
██║    ██║   ██║            ██║  ███╗    ███████║    ██║         ██║         █████╗      ██████╔╝     ╚████╔╝ 
██║    ██║   ██║            ██║   ██║    ██╔══██║    ██║         ██║         ██╔══╝      ██╔══██╗      ╚██╔╝  
██║    ╚██████╔╝            ╚██████╔╝    ██║  ██║    ███████╗    ███████╗    ███████╗    ██║  ██║       ██║   
╚═╝     ╚═════╝              ╚═════╝     ╚═╝  ╚═╝    ╚══════╝    ╚══════╝    ╚══════╝    ╚═╝  ╚═╝       ╚═╝   
                                                                                                              
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

Route::group(['prefix' => 'admin', 'middleware' => ['web','admin'], 'as' => 'admin.'],function(){
    Route::group(['prefix' => 'gallery'], function () {
    Route::get('/','GalleryController@index');
    Route::post('create', 'GalleryController@create');
    Route::get('teste', 'GalleryController@teste');
    Route::get('list', 'GalleryController@list');
    Route::get('view/{id}', 'GalleryController@view');
    Route::post('update/{id}', 'GalleryController@update');
    Route::get('delete/{id}', 'GalleryController@delete');			
  });
});
