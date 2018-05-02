<?php
namespace Dataview\IOGallery;
  
use Dataview\IntranetOne\IOController;
use Illuminate\Http\Response;
use Dataview\IntranetOne\Group;

use App\Http\Requests;
use Dataview\IOGallery\GalleryRequest;
use Dataview\IOGallery\Gallery;
use Validator;
use DataTables;
use Session;
use Sentinel;

class GalleryController extends IOController{

	public function __construct(){
    $this->service = 'gallery';
	}

  public function index(){
		return view('Gallery::index');
	}
	
	public function list(){
    $query = Gallery::select('id','title','description','featured','group_id','date_start','date_end','sizes')
    ->with([
      'categories'=>function($query){
        $query->select('categories.id','category','categories.category_id')
        ->with('maincategory');
      }
    ])
    ->get();
  
    return Datatables::of(collect($query))->make(true);
  }

  public function teste(){
	}


	public function create(GalleryRequest $request){
    $check = $this->__create($request);
    if(!$check['status'])
      return response()->json(['errors' => $check['errors'] ], $check['code']);	
      
    $obj = Gallery::create($request->all());
    $obj->categories()->sync($request->__cat_subcats_converted);
    $obj->group->manageImages(json_decode($request->__dz_images),json_decode($request->__dz_copy_params));
    $obj->save();

    return response()->json(['success'=>true,'data'=>null]);
	}

  public function view($id){
    $check = $this->__view();
    if(!$check['status'])
      return response()->json(['errors' => $check['errors'] ], $check['code']);	

    $query = Gallery::select('id','title','featured','description','date_start','date_end','group_id','sizes')
      ->with([
        'categories'=>function($query){
          $query->select('categories.id','main','category','categories.category_id')
          ->orderBy('main','category')
          ->with('maincategory');
        },
        'group.files'
      ])
      ->orderBy('date_start','desc')
      ->where('id',$id)
      ->get();
				
			return response()->json(['success'=>true,'data'=>$query]);
	}
	
	public function update($id,GalleryRequest $request){
    $check = $this->__update($request);
    if(!$check['status'])
      return response()->json(['errors' => $check['errors'] ], $check['code']);	

      $_new = (object) $request->all();
			$_old = Gallery::find($id);
			
      $_old->title = $_new->title;
      $_old->date_start = $_new->date_start;
      $_old->date_end = $_new->date_end;
      $_old->description = $_new->description;
			$_old->featured = $_new->featured;
			$_old->sizes = $_new->sizes;
      
			$_old->categories()->sync($request->__cat_subcats_converted);
  
      if($_old->group != null)
				$_old->group->manageImages(json_decode($_new->__dz_images),json_decode($_new->__dz_copy_params));
			else
				if(count(json_decode($_new->__dz_images))>0){
					$_old->group()->associate(Group::create([
						'group' => "Album da Galeria ".$obj->id,
            ])
          );
					$_old->group->manageImages(json_decode($_new->__dz_images),json_decode($_new->__dz_copy_params));
				}
		
			$_old->save();
			return response()->json(['success'=>$_old->save()]);
	}

	public function delete($id){
    $check = $this->__delete();
    if(!$check['status'])
      return response()->json(['errors' => $check['errors'] ], $check['code']);	

      $obj = Gallery::find($id);
			$obj = $obj->delete();
			return  json_encode(['sts'=>$obj]);
  }

}
