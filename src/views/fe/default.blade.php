<!DOCTYPE html>
@section('htmltype')
<html lang='pt-br' itemscope itemtype='https://schema.org/WebPage'>
@show
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta http-equiv="Cache-control" content="public">
		<meta http-equiv="pragma" content="no-cache" />
		<meta name="robots" content="all" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		
    <title>{{'DIOS MIO'}}</title>
    @yield('metatags')
    <link rel="stylesheet" type="text/css" href="{{ asset('css/bootstrap.min.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('fe/css/fe-mix.min.css') }}" />
    @yield('header_styles')

		@include('IntranetOne::base.layout.favicon')
</head>
<body class = 'h-100 pb-0' id = 'main'>
  {{-- <script async defer type="text/javascript" src="{{ asset('fe/js/fe-mix-async.min.js') }}"></script> --}}
  <script>
    (function(){
      window.FE =  @json(Config::get('site'));
    })();
  </script>
  @yield('after_body_open')
	<div class="container-fluid h-100 p-0 top-mask">

	</div>
  <script type = 'text/javascript' src="{{ asset('js/jquery.min.js') }}"></script>
  {{-- <script type = 'text/javascript' src="{{ asset('js/popper.min.js') }}"></script> --}}
	<script type = 'text/javascript' src="{{ asset('js/bootstrap.min.js') }}"></script>



  {{-- <script type="text/javascript" src="{{ asset('fe/js/fe-mix.min.js') }}"></script>
  <script type="text/javascript" src="{{ asset('fe/js/fe.min.js') }}"></script> --}}
  <script>$(document).ready(function(){
    console.log('hora vejam')
    //$('body').bootstrapMaterialDesign();
  });</script>
  @yield('footer_scripts')
  @yield('before_body_close')
</html>
