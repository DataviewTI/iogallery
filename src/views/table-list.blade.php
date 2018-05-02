	<div class = 'row dt-filters-container'>
		<div class="col-md-2 col-sm-12">
			<div class="form-group">
        <label for = 'subtitulo' class = 'bmd-label-static'><i class = 'ico ico-filter'></i> Palavra Chave</label>
        <input type = 'text' class = 'form-control form-control-lg' name ='ft_search' id = 'ft_search' />
			</div>
		</div>
		<div class="col-md-3 col-sm-12">
			<div class = 'row'>
				<div class="col-md-6 col-sm-12">
          <div class="form-group">
            <label for = 'ft_dtini' class = 'bmd-label-static'><i class = 'ico ico-filter'></i> Data Inicial</label>  
            <input type = 'text' name = 'ft_dtini' id = 'ft_dtini' class = 'form-control form-control-lg'>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <div class="form-group">
          <label for = 'ft_dtfim' class = 'bmd-label-static'><i class = 'ico ico-filter'></i> Data Final</label>  
          <input type = 'text' name = 'ft_dtfim' id = 'ft_dtfim' class = 'form-control form-control-lg'>
          </div>
        </div>
			</div>
		</div>
    <div class="col-md-2 col-sm-12">
      <div class="form-group">
        <label for = 'ft_category' class = 'bmd-label-static'><i class = 'ico ico-filter'></i> Categoria</label>
        <select id = 'ft_category' class = 'form-control form-control-lg'>
          @php
            $cats = Dataview\IntranetOne\Category::select('id','category','category_id')
            ->whereHas('maincategory',function($q){
                $q->where('category','Gallery');
            })->get();
          @endphp
          <option value = ''></option>
          @foreach($cats as $c)
            <option value = '{{$c->id}}'>{{$c->category}}</option>
            @endforeach
        </select>
      </div>
    </div>
    <div class="col-md-2 col-sm-12">
      <div class="form-group">
        <label for = 'ft_subcategory' class = 'bmd-label-static'><i class = 'ico ico-filter'></i> SubCategoria</label>
        <select id = 'ft_subcategory' disabled class = 'form-control form-control-lg'>
        </select>
      </div>
    </div>
    <div class="col-md-1 col-sm-12">
      <div class="form-group">
        <label for = 'subtitulo' class = 'bmd-label-static'><i class = 'ico ico-filter'></i> Destaque?</label>
        <select id = 'ft_featured' class = 'form-control form-control-lg'>
          <option value = ''></option>
          <option value = '1'>Sim</option>
          <option value = '0'>Não</option>
        </select>
      </div>
    </div>
    
  </div>
	@component('IntranetOne::io.components.datatable',[
	"_id" => "default-table",
	"_columns"=> [
			["title" => "#"],
			["title" => "C"],
			["title" => "Título"],
			["title" => "Dt Inicial"],
			["title" => "Dt_Final"],
			["title" => "S"],
			["title" => "Cats"],
			["title" => "F"],
			["title" => "Ações"],
		]
	])
@endcomponent