<div class = 'row'>
  <div class="col-md-8 col-sm-12 pl-1">
    <div class="form-group">
      <label for = 'title' class="bmd-label-floating __required">Título da Galeria</label>
      <input name = 'title' type = 'text' class = 'form-control form-control-lg' />
    </div>
  </div>
  <div class="col-md-4 col-sm-12 ">
    <div class = 'row'>
      <div class="col-md-6 col-sm-12">
        <div class="form-group">
          <label for = 'date_start' class="bmd-label-floating __required">Data Inicial</label>
          <input name = 'date_start' id = 'date_start' type = 'text' class = 'form-control datepicker form-control-lg' />
        </div>
      </div>
      <div class="col-md-6 col-sm-12 pr-1">
        <div class="form-group">
          <label for = 'date_end' class="bmd-label-floating __required">Data Final</label>
          <input name = 'date_end' id = 'date_end' type = 'text' class = 'form-control datepicker form-control-lg' />
        </div>
      </div>
    </div>
  </div>
</div>

<div class = 'row'>
  <div class="col-md-9 col-sm-12 pl-1">
    <div class="form-group">
      <label for = 'description' class = 'bmd-label-floating'>Descrição</label>
      <input name = 'description' type = 'text' class = 'form-control form-control-lg' />
    </div>
  </div>
  <div class="col-md-3 col-sm-12">
    <div class="form-group">
      <label for = 'featured' class = 'bmd-label-static d-block' style = 'font-size:14px'>Galeria em Destaque?</label>
      <button type="button" class="float-right mt-3 btn btn-lg aanjulena-btn-toggle" data-toggle="button" aria-pressed="false" data-default-state='false' autocomplete="off" name = 'featured' id = 'featured'>
      <div class="handle"></div>
      </button>
      <input type = 'hidden' name = '__featured' id = '__featured' />
    </div>
  </div>
</div>
