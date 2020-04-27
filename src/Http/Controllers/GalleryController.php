<?php
namespace Dataview\IOGallery;
  
use Dataview\IntranetOne\IOController;
use Illuminate\Http\Response;
use Dataview\IntranetOne\Group;

use App\Http\Requests;
use Dataview\IOGallery\GalleryRequest;
use Dataview\IOGallery\Gallery;
use Dataview\IntranetOne\Video;
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
    $query = Gallery::select('id','title','description','featured','group_id','date_start','date_end')
    ->with([
      'categories'=>function($query){
        $query->select('categories.id','category','categories.category_id')
        ->with('maincategory');
      },
      'group'=>function($query){
        $query->select('groups.id','sizes');
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
      
    $obj = new Gallery($request->all());
    $obj->setAppend("sizes",$request->__dz_copy_params);
    $obj->save();

    $obj->categories()->sync($request->__cat_subcats_converted);
    $obj->group->manageImages(json_decode($request->__dz_images),json_decode($request->__dz_copy_params));
    $obj->save();

    if($request->videos_data != null){
      $_vdata = json_decode($request->videos_data);

      foreach ($_vdata as $index => $video) {
        $obj->group->videos()->save(new Video([
          'url' => $video->url,
          'order' => $video->order,
          'source' => $video->source,
          'title' => $video->infos->title,
          'description' => $video->infos->description,
          'thumbnail' => json_encode($video->thumbnail),
          'data' => json_encode($video),
        ]));

      }

    }

    return response()->json(['success'=>true,'data'=>null]);
	}

  public function view($id){
    $check = $this->__view();
    if(!$check['status'])
      return response()->json(['errors' => $check['errors'] ], $check['code']);	

    $query = Gallery::select('id','title','featured','description','date_start','date_end','group_id')
      ->with([
        'categories'=>function($query){
          $query->select('categories.id','main','category','categories.category_id')
          ->orderBy('main')
          ->orderBy('category')
          ->with('maincategory');
        },
        'group'=>function($query){
          $query->select('groups.id','sizes')
          ->with('files')
          ->with('videos');
        },
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
      
			$_old->categories()->sync($request->__cat_subcats_converted);
  
      if($_old->group != null){
        $_old->group->sizes = $_new->sizes;
        $_old->group->manageImages(json_decode($_new->__dz_images),json_decode($_new->__dz_copy_params));
        $_old->group->manageVideos(json_decode($_new->videos_data));
        $_old->group->save();
      }
      else
				if(count(json_decode($_new->__dz_images))>0){
					$_old->group()->associate(Group::create([
            'group' => "Fotos e Videos da Galeria ".$obj->id,
            'sizes' => $_new->__dz_copy_params
            ])
          );
					$_old->group->manageImages(json_decode($_new->__dz_images),json_decode($_new->__dz_copy_params));
          $_old->group->manageVideos(json_decode($_new->videos_data));
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
