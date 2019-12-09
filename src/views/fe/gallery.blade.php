@extends("Gallery::fe.default")

@php
  use Dataview\IOGallery\Gallery;  
  if(blank($id))
    $gal = Gallery::orderBy('updated_at')->first();
  else
    $gal = Gallery::where('id',$id)->first();

  $img = $gal->group->main();
@endphp
<div class = 'row py-5 m-0 portfolio'>
  <div class = 'col-11 mx-auto'>
    <div class = 'row m-0'>
      @component('IntranetOne::base.components.photoswipe-gallery',[
        "id" => 'gallery-service',
        "visible" => 8, 
        "class" => "h-100 p-0 row justify-content-center",
        "big" => "big",
        "group" => $gal->group,
        "video" =>$gal->video,
        "sizes" =>[
          "normal"=>"big",
          "big" => "big"
        ],
        "main"=>[
          "a_class" => "image-effect",
          "figure_class" => "col-12 col-sm-6 col-md-4 col-lg-2 h-100 p-2",
          "img_class" => 'img-fluid h-100 m-0'
          ]
      ])
      @endcomponent
    </div>
  </div>
</div>

@section('after_body_open')
  @include("IntranetOne::base.social.google-youtube")
@endsection

@section('before_body_close')
  @include("IntranetOne::base.components.photoswipe")
@endsection


@section('header_styles')
  <link rel="stylesheet" type="text/css" href="{{ asset('io/services/io-gallery-ps.min.css') }}">
@endsection

@section('footer_scripts')
<script async defer type="text/javascript" src="{{ asset('vendors/photoswipe/photoswipe.min.js') }}"></script>
{{-- <script type="text/javascript" src="{{ asset('fe/js/fe-mix-portfolio.min.js') }}"></script>
<script type="text/javascript" src="{{ asset('fe/js/fe-portfolio.min.js') }}"></script> --}}

  <script>$(document).ready(function(){
  initPhotoSwipeFromDOM('.ps-gallery',{
    id:'testex',
    options:{
      index:0,
      escKey: false,
      closeEl:false,
      shareEl:false,
      closeElClasses: [],
    }
  }); 

  });</script>
  
@endsection