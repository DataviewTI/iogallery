<form action = '/admin/gallery/create' id='default-form' method = 'post' class = 'form-fit'>
  @component('IntranetOne::io.components.wizard',[
    "_id" => "default-wizard",
    "_min_height"=>"435px",
    "_steps"=> [
        ["name" => "Dados Gerais", "view"=> "Gallery::form-general"],
        [
          "name" => "Categorias",
          "view"=> "IntranetOne::io.forms.form-categories",
          "params"=>[
            "cat"=>"Gallery"
          ]
        ],
        ["name" => "Imagens", "view"=> "IntranetOne::io.forms.form-images"],
        ["name" => "Videos","view"=> "IntranetOne::io.forms.form-videos"],
      ]
  ])
  @endcomponent
</form>