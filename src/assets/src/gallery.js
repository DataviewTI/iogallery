new IOService({
    name:'Gallery',
  },
  function(self){
    self.loadedVideo = null;

    $('button#save_video').click(function(event) {
      event.preventDefault();
      HoldOn.open({message:"Aguarde...",theme:'sk-bounce'});

      // self.loadedVideo.dbId = "";

      self.loadedVideo.infos.title = $( "input#video_title" ).val();
      self.loadedVideo.infos.description = $( "input#video_description" ).val();

      if(self.loadedVideo.dbId != null){
        $( ".video-box" ).each(function( index ) {

          var video = $(this).data('video-data');
          if(video.dbId == self.loadedVideo.dbId){
            $(this).attr('data-video-data',JSON.stringify(self.loadedVideo));
          }
        });
      }else{
        addVideoToList(self.loadedVideo, self);
      }

      videoUnload(self);

      HoldOn.close();
    });

    //mututor observer for attributes
    $('#featured').attrchange(function(attrName) {
      if(attrName == 'aria-pressed'){
        $('#__featured').val($(this).attr('aria-pressed'));
      }
    });

    $('#img_original').attrchange(function(attrName) {
      if(attrName == 'aria-pressed'){
        $('#__img_original').val($(this).attr('aria-pressed'));
        self.dz.copy_params.original = $(this).attr('aria-pressed')=='true';
      }
    });

    $('#add_dimension').on("click",function(e){
      e.preventDefault();
      self.fv.caller = 'dimensions';
      self.dimensionsFv.enableValidator('img_prefix');

      self.dimensionsFv.validate().then(function(status) {
        if(status === 'Valid')
          addDimension(
          {
            self:self,
            prefixo:$('#img_prefix').val(),
            largura:$('#img_largura').val(),
            altura:$('#img_altura').val(),
          })
      });
    });

    Sortable.create(document.getElementById('custom-dropzone'),{
      animation: 250,
      handle: ".dz-reorder",
    });

    Sortable.create(document.getElementById('video-list'),{
      animation: 250,
      handle: ".dz-reorder",
    });

    ['__sl-box-left-1','__sl-box-left-2','__sl-box-left-3','__sl-main-group'].forEach(function(obj){
      if(document.getElementById(obj)!=null)
        Sortable.create(document.getElementById(obj),{
          handle: ".__sl-handle",
          animation: 250,
          group:"sl-categories",
          onAdd: function (evt) {
            var item = evt.item;
            self.fv[1].revalidateField('__cat_subcats');
          },
          sort:false,
        });
    });

    //pickadate objects initialization
    $('#date_start').pickadate({
      formatSubmit: 'yyyy-mm-dd 00:00:00',
      min: new Date(),
      onClose:function(){
        //$("[name='date_end']").focus();
      }
    }).pickadate('picker').on('set', function(t){
      $('#date_end').pickadate().pickadate('picker').clear();

      if(t.select!==undefined)
        $('#date_end').pickadate().pickadate('picker').set('min',new Date(t.select));
      else
        $('#date_end').pickadate().pickadate('picker').set('min',new Date())

        self.fv[0].revalidateField('date_start');
    });

    $('#date_end').pickadate({
      formatSubmit: 'yyyy-mm-dd 00:00:00',
      min: new Date(),
      onClose:function(){
        $("[name='description']").focus();
      }
    }).pickadate('picker').on('render', function(){
      self.fv[0].revalidateField('date_end');
    });

    //Datatables initialization
    self.dt = $('#default-table').DataTable({
      aaSorting:[ [0,"desc" ]],
      ajax: self.path+'/list',
      initComplete:function(){
        //parent call
        let api = this.api();
        this.teste = 10;
        $.fn.dataTable.defaults.initComplete(this);

        //pickadate objects initialization
        $('#ft_dtini').pickadate({
        }).pickadate('picker').on('set', function(t){
          $('#ft_dtfim').pickadate().pickadate('picker').clear();
          if(t.select!==undefined)
            $('#ft_dtfim').pickadate().pickadate('picker').set('min',new Date(t.select));
          else
            $('#ft_dtfim').pickadate().pickadate('picker').set('min',false)
            api.draw()
        });

        $('#ft_dtfim').pickadate().pickadate('picker').on('render', function(){
          api.draw()
        });

        api.addDTBetweenDatesFilter({
          column:'date_start',
          min: $('#ft_dtini'),
          max: $('#ft_dtfim')
        });

        api.addDTSelectFilter([
          {el:$('#ft_featured'),column:'featured'},
          //verificar cats e subcats durante os filtros, tem que fazer outras N verificações
          {el:$('#ft_category'),column:'categories',format:"|{{value}}|"},
          {el:$('#ft_subcategory'),column:'categories',format:"|{{value}}|"},
        ]);

        $("#ft_category").change(function(e){
          if($(this).val()=='')
            $("#ft_subcategory").prop('disabled','disabled').find('option').remove().end();
          else
            $.ajax({
              url:'/categories/list/'+$(this).val(),
              dataType: "json",
              success: function(data){
              if(data.length>0){
                  $("#ft_subcategory").removeAttr('disabled');
                  let arr = [{value:'',text:''}];
                  $.each(data, function (i, item) {
                    arr.push({value:item.id,text:item.category});
                  });
                  refreshSelect($("#ft_subcategory"),arr);
                }
                else
                  $("#ft_subcategory").prop('disabled','disabled').find('option').remove();
              }
            });
        });

      },
      footerCallback:function(row, data, start, end, display){
      },
      columns: [
        { data: 'id', name: 'id'},
        { data: 'null', name: 'null'},
        { data: 'title', name: 'title'},
        { data: 'date_start', name: 'date_start'},
        { data: 'date_end', name: 'date_end'},
        { data: 'group', name: 'group'},
        { data: 'categories', name: 'categories'},
        { data: 'featured', name: 'featured'},
        { data: 'actions', name: 'actions'},
      ],
      columnDefs:
      [
        {targets:'__dt_',width: "3%",class:"text-center",searchable: true,orderable:true},
        {targets:'__dt_c',width:"2%",searchable: true, orderable:false,className:"text-center",render:function(data,type,row){
          var data = row['categories'];
          var cats=[];
          data.forEach(function(c){
            cats.push(c.category);
            if(c.parent!='' && c.parent!= null && !cats.includes(c.maincategory.category))
              cats.push(c.maincategory.category)
          });

          return self.dt.addDTIcon({ico:'ico-structure-2',title:"<span class = 'text-left'>"+(cats.join('<br>'))+"</span>",value:1,pos:'right',_class:'text-primary text-normal',html:true}
            );
        }
      },
      {targets:'__dt_titulo',searchable: true,orderable:true},
      {targets:'__dt_dt-inicial',type:'date-br',width: "9%",orderable:true,className:"text-center",
        render:function(data,type,row){
          return moment(data).format('DD/MM/YYYY');
        }
      },
      {targets:'__dt_dt-final',type:'date-br',width: "9%",orderable:true,className:"text-center",
      render:function(data,type,row){
        if(data!==null)
          return moment(data).format('DD/MM/YYYY');
        else
          return "";
      }
    },
    {targets:'__dt_s',width: "2%",orderable:false,className:"text-center",render:function(data,type,row){
      if(data.sizes!=''){
        data = JSON.parse(data.sizes.replace(/&quot;/g,'"'));
        let __sizes = [];
        let s;
        for(s in data.sizes){
          __sizes.push(s+': '+data.sizes[s].w+'x'+data.sizes[s].h);
        }
        return self.dt.addDTIcon({ico:'ico-structure',
        title:"<span class = 'text-left'>"+(__sizes.join('<br>'))+"</span>",
        value:1,pos:'right',_class:'text-primary text-normal',html:true});
      }
      else
        return "";
      }
    },
    {targets:'__dt_cats',visible:false,render:function(data,type,row){
        var cats=[];
        data.forEach(function(c){
          cats.push(c.id);
          if(c.parent!='' && c.parent!= null && !cats.includes(c.parent.id))
            cats.push(c.parent.id)
        });
        return  '|'+cats.join('|')+'|';
      }
    },
    {targets:'__dt_f',width: "2%",orderable:true,className:"text-center",render:function(data,type,row){
        if(data)
          return self.dt.addDTIcon({ico:'ico-star',value:1,title:'galeria destaque',pos:'left',_class:'text-info'});
        else
          return self.dt.addDTIcon({value:0,_class:'invisible'});
      }
    },
    {targets:'__dt_acoes',width:"7%",className:"text-center",searchable:false,orderable:false,render:function(data,type,row,y){
            return self.dt.addDTButtons({
              buttons:[
                // {ico:'ico-eye',_class:'text-primary',title:'preview'},
                {ico:'ico-edit',_class:'text-info',title:'editar'},
                {ico:'ico-trash',_class:'text-danger',title:'excluir'},
            ]});
          }
        }
      ]
    }).on('click',".btn-dt-button[data-original-title=editar]",function(){
      var data = self.dt.row($(this).parents('tr')).data();
      self.view(data.id);
    }).on('click','.ico-trash',function(){
      var data = self.dt.row($(this).parents('tr')).data();
      self.delete(data.id);
    }).on('click','.ico-eye',function(){
      var data = self.dt.row($(this).parents('tr')).data();
      preview({id:data.id});
    }).on('draw.dt',function(){
      $('[data-toggle="tooltip"]').tooltip();
    });


    self.dimensions_dt = $('#__dimensions').DataTable({
      "paging":   false,
      "info":false,
      "ordering":false,
      initComplete:function(){
        let api = this.api();
        api.row.add([
          'thumb',
          '240',
          '180',
          null
          ],
        ).draw(true);

       let img_dim = getDimension(self);
       self.dz.options.thumbnailHeight = img_dim.thumb.h ||180;
       self.dz.options.thumbnailWidth = img_dim.thumb.w || 240;
      },
      columnDefs:
      [
        {targets:'__dt_prefixo',class:"text-center", orderable:false},
        {targets:'__dt_largura',width: "10%",class:"text-center"},
        {targets:'__dt_altura',width: "10%",class:"text-center"},
        {targets:'__dt_acoes',width:"7%",className:"text-center",searchable:false,
        orderable:false,render:function(data,type,row,y){
            if(row[0] !== 'thumb')
              return self.dt.addDTButtons({
                buttons:[
                  {ico:'ico-trash',_class:'text-danger',title:'excluir'},
                ]});
              else
              return self.dt.addDTButtons({
                buttons:[
                  {ico:'ico-edit',_class:'text-info',title:'editar'},
                ]});
          }
        }
      ]
    })
    .on('click','.ico-trash',function(){
      self.dimensions_dt.row($(this).parents('tr')).remove().draw();
    })
    .on('click','.ico-edit',function(){
      var data = self.dimensions_dt.row($(this).parents('tr')).data();
      $('#add_dimension').addClass('d-none');
      $('#img_prefix').val(data[0]).attr('disabled','disabled');
      $('#thumb_edit').removeClass('d-none');
      $('#cancel_thumb_edit').removeClass('d-none');
      $('#img_altura').val(data[2]);
      $('#img_largura').val(data[1]).focus();
    });

    $('#cancel_thumb_edit').on("click",function(){
      $('#add_dimension').removeClass('d-none');
      $('#img_prefix').val('').removeAttr('disabled');
      $('#thumb_edit').addClass('d-none');
      $('#cancel_thumb_edit').addClass('d-none');
      $('#img_largura').val('');
      $('#img_altura').val('');
      $('#img_prefix').focus();
      self.dimensionsFv.updateFieldStatus('img_largura', 'NotValidated');
      self.dimensionsFv.updateFieldStatus('img_altura', 'NotValidated');
      self.dimensionsFv.updateFieldStatus('img_prefix', 'NotValidated');
    });

    $('#thumb_edit').on("click",function(e){
      e.preventDefault();
      self.fv.caller = 'dimensions';
      self.dimensionsFv.updateFieldStatus('img_prefix', 'NotValidated');
      self.dimensionsFv.disableValidator('img_prefix');
      self.dimensionsFv.validate().then(function(status) {

        if(status === 'Valid')
          self.dz.copy_params.sizes.thumb.w = $('#img_largura').val();
          self.dz.copy_params.sizes.thumb.h = $('#img_altura').val();
          self.dz.options.thumbnailHeight = $('#img_altura').val();
          self.dz.options.thumbnailWidth = $('#img_largura').val();
          let data = self.dimensions_dt.row(0).data();
          data[1] = $('#img_largura').val();
          data[2] = $('#img_altura').val();
          self.dimensions_dt.row(0).data(data);
          $('#cancel_thumb_edit').trigger('click');
      });
    });

    let form = document.getElementById(self.dfId);
    let fv1 = FormValidation.formValidation(
      form.querySelector('.step-pane[data-step="1"]'),
      {
        fields: {
          title:{
            validators:{
              notEmpty:{
                message: 'O título da galeria é obrigatório!'
              }
            }
          },
          date_start:{
            validators:{
              notEmpty:{
                message: 'O data inicial é obrigatória'
              },
              date:{
                format: 'DD/MM/YYYY',
                message: 'Informe uma data válida!'
              }
            }
          },
          date_end:{
            validators:{
              date:{
                format: 'DD/MM/YYYY',
                message: 'Informe uma data válida!'
              }
            }
          },
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          submitButton: new FormValidation.plugins.SubmitButton(),
          // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
          bootstrap: new FormValidation.plugins.Bootstrap(),
          icon: new FormValidation.plugins.Icon({
            valid: 'fv-ico ico-check',
            invalid: 'fv-ico ico-close',
            validating: 'fv-ico ico-gear ico-spin'
          }),
        },
    }).setLocale('pt_BR', FormValidation.locales.pt_BR)
    .on('core.validator.validated', function(event) {
      // console.log(event);
    });

    const checkPrefix = function() {
      return {
        validate: function(input){
          let prfs = self.dimensions_dt.columns(0).data().toArray()[0];

          if(prfs.includes(input.value.toLowerCase()))
            return {
              valid: false,
              message: 'O Prefixo já existe'
            }

            return {
              valid: true,
            }
        }
      };
    };

    const thumbPrefix = function() {
      return {
        validate: function(input){
          let prfs = self.dimensions_dt.columns(0).data().toArray()[0];
          if(!prfs.includes("thumb"))
          return {
              valid: false,
              message: 'Prefixo thumb é obrigatório'
          }
            return {
              valid: true,
            }
        }
      };
    };

    self.dimensionsFv = FormValidation.formValidation(
      form.querySelector('#dimension_container'),
      {
        fields: {
          img_prefix: {
            validators:{
                checkPrefix:{
                  enabled: true,
                },
                thumbPrefix:{
                  enabled: true,
                },
                notEmpty:{
                  enabled: true,
                  message: 'Informe o prefíxo da imagem!'
                }
            }
          },
          img_altura: {
            validators:{
              notEmpty:{
                enabled: true,
                message: 'Informe a Altura'
              },
              greaterThan: {
                enabled: true,
                min: 1,
                message: 'Alt. Mínima 1px',
              },
              lessThan: {
                enabled: true,
                max: 4000,
                message: 'Alt. Máxima 4000px',
              }
            }
          },
          img_largura: {
            validators:{
              notEmpty:{
                enabled: true,
                message: 'Informe a Largura'
              },
              greaterThan: {
                enabled: true,
                min: 1,
                message: 'Larg. Mínima 1px',
              },
              lessThan: {
                enabled: true,
                max: 4000,
                message: 'Larg. Máxima 4000px',
              }
            }
          }
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          submitButton: new FormValidation.plugins.SubmitButton(),
          // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
          bootstrap: new FormValidation.plugins.Bootstrap(),
          icon: new FormValidation.plugins.Icon({
            valid: 'fv-ico ico-check',
            invalid: 'fv-ico ico-close',
            validating: 'fv-ico ico-gear ico-spin'
          }),
        },
    }).setLocale('pt_BR', FormValidation.locales.pt_BR)
    .registerValidator('checkPrefix', checkPrefix)
    .registerValidator('thumbPrefix', thumbPrefix);

    let fv2 = FormValidation.formValidation(
      form.querySelector('.step-pane[data-step="2"]'),
      {
        fields: {
          __cat_subcats:{
            validators:{
              callback:{
                message: 'A galeria deve ter no mínimo uma categoria vinculada!',
                callback: function(value, validator, $field){
                  return $('#__sl-main-group button.list-group-item').length > 0;
                }
              }
            }
          },
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          submitButton: new FormValidation.plugins.SubmitButton(),
          // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
          bootstrap: new FormValidation.plugins.Bootstrap(),
          icon: new FormValidation.plugins.Icon({
            valid: 'fv-ico ico-check',
            invalid: 'fv-ico ico-close',
            validating: 'fv-ico ico-gear ico-spin'
          }),
        },
    }).setLocale('pt_BR', FormValidation.locales.pt_BR);

    let fv3 = FormValidation.formValidation(
      form.querySelector('.step-pane[data-step="3"]'),
      {
        fields: {
          has_images:{
            validators:{
              callback:{
                enabled: false,
                message: 'A galeria deve ter no mínimo uma imagem!',
                callback: function(value, validator, $field){

                  if(self.dz.files.length>0)
                    return true

                  toastr["error"]("A galeria deve conter no mínimo uma imagem!")

                  return false;
                }
              }
            }
          },
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          submitButton: new FormValidation.plugins.SubmitButton(),
          // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
          bootstrap: new FormValidation.plugins.Bootstrap(),
          icon: new FormValidation.plugins.Icon({
            valid: 'fv-ico ico-check',
            invalid: 'fv-ico ico-close',
            validating: 'fv-ico ico-gear ico-spin'
          }),
        },
    }).setLocale('pt_BR', FormValidation.locales.pt_BR);

    let fv4 = FormValidation.formValidation(
      form.querySelector('.step-pane[data-step="4"]'),
      {
        fields: {
          imageorvideo:{
            validators:{
              callback:{
                message: 'O popup deve conter uma imagem ou um vídeo!',
                callback: function(input){

                  if(self.dz.files.length==0 && $('.video-box').length == 0){
                    toastr["error"]("O popup deve conter uma imagem ou um vídeo!")
                    return false;
                  }
                  return true
                }
              }
            }
          },
          video_url:{
            validators:{
              promise:{
                promise: function(input){

                  let dfd   = new $.Deferred(),
                      video = getVideoInfos($('#video_url').val()),
                      prom;

                      if(video.source != null){
                    $('#embed-container-video').addClass('loading');
                    switch(video.source){
                      case 'youtube':
                        prom = getYoutubeVideoPromise(video,self);
                        break;
                      case 'facebook':
                        prom = getFacebookVideoPromise(video,self);
                        break;
                    }

                    prom.then(resolve=>{
                      resolve.callback(resolve);
                      $('#video_title').val(video.infos.title);
                      $('#video_description').val(video.infos.description);
                      $('#video_start_at').removeAttr('disabled');
                      $('#btn-get-current-time').removeClass('__disabled mouse-off');

                      makeVideoThumbs(video,self);
                      if(self.loadedVideo == null)
                        self.loadedVideo = video;

                      $('#loaded-video').val(JSON.stringify(video));
                      // $('#video_data').val(JSON.stringify(video));
                      dfd.resolve({ valid: true });

                      if($('#video_url').attr('data-loaded')!==undefined){
                        let vdata = JSON.parse($('#video_url').attr('data-loaded'));
                        //what need to call twice??
                        let vthumb = JSON.parse(JSON.parse($('#video_url').attr('data-thumb')));
                        $('#video_title').val(vdata.title);
                        $('#video_description').val(vdata.description);
                        $($('.container-video-thumb .video-thumb')[vthumb.pos]).css({
                          'backgroundImage': "url('"+vthumb.url+"')"
                        }).trigger('click');

                        $('#video_url').removeAttr('data-loaded').removeAttr('data-thumb');
                      }
                      self.fv[3].revalidateField('imageorvideo');
                      return dfd.promise();
                    }).
                    catch(reject=>{
                      console.log(reject);
                      reject.callback(reject);
                      let msg = reject.data != null ? reject.data : "Este link não corresponde a nenhum vídeo válido"
                      dfd.reject({
                        valid:false,
                        message: msg
                      });
                    });
                  }
                  else{
                    videoUnload(self);
                    if($('#video_url').val()=='')
                      dfd.resolve({ valid: true });
                    else
                    dfd.reject({
                      valid:false,
                      message: "Este link não corresponde a nenhum vídeo válido"
                    });

                  }
                  return dfd.promise();
                },
                message: 'O link do vídeo informado é inválido',
              },
            }
          },
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          submitButton: new FormValidation.plugins.SubmitButton(),
          // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
          bootstrap: new FormValidation.plugins.Bootstrap(),
          icon: new FormValidation.plugins.Icon({
            valid: 'fv-ico ico-check',
            invalid: 'fv-ico ico-close',
            validating: 'fv-ico ico-gear ico-spin'
          }),
        },
    }).setLocale('pt_BR', FormValidation.locales.pt_BR);

    self.fv = [fv1, fv2, fv3, fv4];

    //Dropzone initialization
    Dropzone.autoDiscover = false;
    self.dz = new DropZoneLoader({
      id:'#custom-dropzone',
      autoProcessQueue	: false,
      thumbnailWidth: 240,
      thumbnailHeight: 180,
      copy_params:{
        original:true,
        sizes:{
         }
      },
      removedFile:function(file){
        self.fv[2].updateFieldStatus('has_images', 'NotValidated');
      },
      onSuccess:function(file,ret){
        // self.fv[2].revalidateField('has_images');
      }
    });

    //need to transform wizardActions in a method of Class
    self.wizardActions(function(){
      let img_dim = getDimension(self);
      self.dz.copy_params.sizes = img_dim;
      self.dz.options.thumbnailHeight = img_dim.thumb.h;
      self.dz.options.thumbnailWidth = img_dim.thumb.w;

      $("[name='__dz_images']").val(JSON.stringify(self.dz.getOrderedDataImages()));
      $("[name='__dz_copy_params']").val(JSON.stringify(self.dz.copy_params));

      var vdata = Array();
      $( ".video-box" ).each(function( index ) {
        var video = JSON.parse($(this).attr('data-video-data'));
        video.order = index;
        vdata.push(video);
        console.log(video);

      });
      $('#videos_data').val(JSON.stringify(vdata))

      var cats = getCatAndSubCats();
      $('#__cat_subcats').val(cats);
      $(document.createElement('input')).prop('type','hidden').prop('name','main_cat').val(cats[0]).appendTo(self.df);
    });

    self.callbacks.view = view(self);
    self.callbacks.update.onSuccess = function(){
      self.tabs['listar'].tab.tab('show');
    }

    self.callbacks.create.onSuccess = function(){
      self.tabs['listar'].tab.tab('show');
    }

    self.callbacks.unload = function(self){
      $(".aanjulena-btn-toggle").aaDefaultState();

      self.dz.removeAllFiles(true);
      videoUnload(self);
      $('#video-list .video-box').remove();

    }

});//the end ??


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  ██╗      ██████╗  ██████╗ █████╗ ██╗         ███╗   ███╗███████╗████████╗██╗  ██╗ ██████╗ ██████╗ ███████╗
  ██║     ██╔═══██╗██╔════╝██╔══██╗██║         ████╗ ████║██╔════╝╚══██╔══╝██║  ██║██╔═══██╗██╔══██╗██╔════╝
  ██║     ██║   ██║██║     ███████║██║         ██╔████╔██║█████╗     ██║   ███████║██║   ██║██║  ██║███████╗
  ██║     ██║   ██║██║     ██╔══██║██║         ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██║   ██║██║  ██║╚════██║
  ███████╗╚██████╔╝╚██████╗██║  ██║███████╗    ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║╚██████╔╝██████╔╝███████║
  ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function addDimension(p){
  p.self.dimensions_dt.row.add([
      p.prefixo,
      p.largura,
      p.altura,
      null
    ],
  ).draw(true);

  $('#img_largura').val('');
  $('#img_altura').val('');
  $('#img_prefix').val('').focus();
  p.self.dimensionsFv.updateFieldStatus('img_largura', 'NotValidated');
  p.self.dimensionsFv.updateFieldStatus('img_altura', 'NotValidated');
  p.self.dimensionsFv.updateFieldStatus('img_prefix', 'NotValidated');
}

function getDimension(self){
  let rows = self.dimensions_dt.rows().data().toArray();
  let sizes = {};
  rows.forEach(function(obj,i){
    sizes[obj[0]] = {'w':obj[1],'h':obj[2]}
  });
  return sizes;
}


function getCatAndSubCats(){
	var arr=[];
	$('#__sl-main-group button').each(function(a,b){
		var cat = $(b).attr('__val');
		var subcat = $(b).attr('__cat');
		arr.push(cat);
	});
	return arr;
}

function getCategories(param){
  $.ajax({
    url:'categories/list/'+(param.id||''),
    dataType: "json",
    success: function(ret){
      param.callback(ret)
    }
  });
}

function gcd(a, b) {
  return (b == 0) ? a : gcd (b, a%b);
}

function makeVideoThumbs(video,self){

  let container = $('.container-video-thumb');
  container.find('.video-thumb').remove();
  let new_div = $(document.createElement("div")).addClass('video-thumb col-12')
                .append($(document.createElement("img")));

  //se existe alguma foto na galeria, add a primeira
  if(self.dz.files.length){

    var $videoThumb = (
      new_div.clone().on('click',function(){
        $(".video-thumb").removeClass('active');
        $(this).addClass('active');
      })
      .attrchange(function(attrName){
        if(attrName == 'class'){
          if($(this).hasClass('active')){
            self.loadedVideo.thumbnail = {pos:$(this).attr('data-pos'), url:($(self.dz.files[0].previewTemplate).find('[data-dz-thumbnail]').attr('src'))};
          }
        }
      })
    );
    $videoThumb.find('img').attr('src', $(self.dz.files[0].previewTemplate).find('[data-dz-thumbnail]').attr('src')).css({'width':'100%', 'height':'auto'});
    container.append($videoThumb);

  }

  //cria as thumbs de acordo com o retorno de data.thumbs
   //$('#video_start_at').attr('data-video-duration',null);
  video.thumbs.forEach(function(url,i){
    var $videoThumb = (
      new_div.clone().on('click',function(){
        $(".video-thumb").removeClass('active');
        $(this).addClass('active');
      })
      .attrchange(function(attrName){
        if(attrName == 'class'){
          if($(this).hasClass('active')){
            self.loadedVideo.thumbnail = {pos:$(this).attr('data-pos'), url:url};
          }
        }
      })
    );
    $videoThumb.find('img').attr('src', url).css({'width':'100%', 'height':'auto'});
    container.append($videoThumb);
  });

  container.find('.video-thumb').first().addClass('active');
  container.find('.video-thumb').each(function(i,obj){
    $(obj).attr('data-pos',i);
  });
}

function getYoutubeVideoPromise(video,self){
  let _resolve = function(res){
    let player = $('#'+video.source+'-player');
    player.removeClass('d-none').attr('src',video.embed);

    let _ytp = new YT.Player('youtube-player',{
      events: {
        'onReady': function(_t){
          self.VPlayer = _t.target;
          self.VPlayer.__getCurrent = _t.target.getCurrentTime;
          self.VPlayer.__play = _t.target.playVideo;
          self.VPlayer.__pause = _t.target.pauseVideo;
        }
      }
    });

    video.infos = {
      title:res.data.items[0].snippet.title,
      description:res.data.items[0].snippet.description,
      duration:moment.duration(res.data.items[0].contentDetails.duration,'seconds').format('hh:mm:ss',{trim:false}),
    }
    for(let i=0;i<3;i++)
      video.thumbs.push('https://img.youtube.com/vi/'+video.id+'/'+i+'.jpg');
  }

  let _reject = function(res){
    videoUnload(self);
  }
  return new Promise((resolve,reject) => {
      //$('#embed-container-video').addClass('loading');
      $.ajax({
        url: ['https://www.googleapis.com/youtube/v3/videos',
              '?key=AIzaSyB2-i5P7MPuioxONBQOZwgC7vWEeJ4PnIo',
              '&part=snippet,contentDetails',
              '&id='+video.id
        ].join(''),
        type:'GET',
        success: function(ret){
            if(ret.items.length)
              resolve({state:true,data:ret,callback:_resolve});
            else
              reject({state:false,data:'o link informado está quebrado ou é inválido!',callback:_reject});
            },
            error: function(ret){
              reject({state:false,data:'o link informado está quebrado ou é inválido!',callback:_reject});
            }
          }).done(function(){
        });
      });
  }

function getFacebookVideoPromise(video,self){
  let _resolve = function(res){
    let player = $('#'+video.source+'-player');
    player.removeClass('d-none').attr('data-href',video.url);
    FB.XFBML.parse(document.getElementById('facebook-player').parentNode);
    self.VPlayer = null;
    FB.Event.subscribe('xfbml.ready', function(msg) {
      if (msg.type === 'video') {
        self.VPlayer = msg.instance;
        self.VPlayer.__getCurrent = msg.instance.getCurrentPosition;
        self.VPlayer.__play = msg.instance.play;
        self.VPlayer.__pause = msg.instance.pause;
      }
    });
    video.infos = {
      title:res.data.title,
      description:res.data.description,
      duration:moment.duration(parseInt(res.data.length),'seconds').format('hh:mm:ss'),
    }

    video.embed = video.embed+'&width='+res.data.format[0].width
    let max_video_number = (res.data.thumbnails.data.length>=3) ? 3 : res.data.thumbnails.data.length;
    for(let i=0;i<max_video_number;i++)
      video.thumbs.push(res.data.thumbnails.data[i].uri);
  }

  let _reject = function(res){
    videoUnload(self);
  }

  return new Promise((resolve,reject) => {
    FB.api(
      "/"+video.id+'?fields=thumbnails,description,length,embeddable,embed_html,format,title&access_token='+window.IntranetOne.social_media.facebook.long_token,
      function (ret){
        if(ret && !ret.error){
          resolve({state:true,data:ret,callback:_resolve});
        }
        else{
          if(ret.error.code == 100)
            reject({state:false,data:"O video deste link não permite sua utilização",callback:_reject});
          console.log('entrou no erro');
          reject({state:false,data:null,callback:_reject});
        }
      });

  });

}

function videoUnload(self){
  self.fv[3].revalidateField('imageorvideo');

  $('#embed-container-video').removeClass('loading');
  $('.vplayer').attr('src','').addClass('d-none');
  $('.vplayer').attr('data-href','').addClass('d-none');

  self.VPlayer = null;
  $('.container-video-thumb .video-thumb').remove();
  $('#video_title, #video_description, #videos_data, #video_url').val('');
  self.fv[3].resetField('video_url');
  self.fv[3].resetField('imageorvideo');

  $('#btn-get-current-time').addClass('__disabled mouse-off');

  self.loadedVideo = null;
}

function getVideoInfos(url){
  let rgx_youtube = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  let rgx_facebook = /^http(?:s?):\/\/(?:www\.|web\.|m\.)?facebook\.com\/([A-z0-9\.]+)\/videos(?:\/[0-9A-z].+)?\/(\d+)(?:.+)?$/

  if(rgx_youtube.test(url))
    return {
      source:'youtube',
      id:url.match(rgx_youtube)[1],
      url:url,
      embed:[
        'https://www.youtube.com/embed/'+url.match(rgx_youtube)[1],
        '?enablejsapi=1',
        '&origin='+document.location.origin
      ].join(''),
      thumbs:[]
  }

  if(rgx_facebook.test(url)){
    let url_match = url.match(rgx_facebook);
    return {
        source:'facebook',
        id:url_match[2],
        url:url,
        embed:[
          'https://www.facebook.com/plugins/video.php',
          '?href=https%3A%2F%2Fwww.facebook.com%2F',
          url_match[1]+'%2Fvideos%2F'+url_match[2]
        ].join(''),
        thumbs:[]
      }
  }

    return {source:null,id:null,thumbs:[],embed:null,url:null};
}

function preview(param){
  alert('futuramente implementar uma vizualização com photoswipe');
  //var win = window.open(document.location.origin+'/reader/'+param.id+'/teste-preview', '_blank');
  //win.focus();
}
//CRUD CallBacks
function view(self){
  return{
    onSuccess:function(data){

      $("[name='title']").val(data.title);
      $("[name='description']").val(data.description);
      $("[name='date_start']").pickadate('picker').set('select',new Date(data.date_start));

      if(data.date_end!=null)
        $("[name='date_end']").pickadate('picker').set('select',new Date(data.date_end));

      $("#featured").aaToggle(data.featured);

      //reload imagens
      self.dz.removeAllFiles(true);

      //zera as categorias no unload
      let attrcats = [];
      data.categories.forEach(function(obj){
        attrcats.push(obj.id)
      });

      attrcats.forEach(function(i){
        $('.__sortable-list').not('#__sl-main-group').find(".list-group-item[__val='"+i+"']")
        .appendTo($('#__sl-main-group'));
      });
      self.fv[1].revalidateField('__cat_subcats');

      //zera a tabela de dimensões e atualiza
      let __sizes = JSON.parse(data.group.sizes.replace(/&quot;/g,'"'));
      self.dimensions_dt.clear().draw();
      for(let s in __sizes.sizes){
        addDimension(
          {
            self:self,
            prefixo:s,
            largura:__sizes.sizes[s].w,
            altura:__sizes.sizes[s].h,
          })
      };

      if(data.group!=null){
        self.dz.reloadImages(data);

        data.group.videos.forEach(function (item, index) {
          item.data = JSON.parse(item.data);
          item.data.dbId = item.id;
          addVideoToList(item.data, self);
        });

      }
    },
      onError:function(self){
        console.log('executa algo no erro do callback');
    }
  }
}

function addVideoToList(video, self){
  // console.log(video);

  var $newVideo = $(`
    <div class="video-box col-2" data-video-data='`+JSON.stringify(video)+`'>
      <div class='dz-buttons-container d-flex justify-content-end mr-1'>
        <span class="dv-btn-circle dz-delete ml-1 bg-danger text-white" data-dz-delete="" data-toggle='tooltip' data-placement='top' title='Remover'>
          <i class='ico ico-trash'></i>
        </span>
        <span class="dv-btn-circle dz-reorder ml-1 bg-info text-white" data-dz-reorder data-toggle='tooltip' data-placement='top' title='Mover'>
          <i class='ico ico-move'></i>
        </span>
        <span class="dv-btn-circle ml-1 dz-edit bg-danger text-white" data-toggle="tooltip" data-placement="top" title="" data-original-title="Editar">
          <i class="ico ico-edit"></i>
        </span>
      </div>
      <img src="`+video.thumbnail.url+`" alt="" style="width: 100%">
    </div>
  `)
  .appendTo('#video-list');

  $newVideo.find('.dz-delete').on( "click", function() {
    swal({
      title:"Apagar Video",
      text:"Tem certeza que deseja remover o vídeo acima?",
      imageUrl: video.thumbnail.url,
      imageAlt: '',
      showCancelButton: true,
    }).then((result) => {
      if(result.value==true) {
        $( this ).parents('.video-box').remove();
      }
    })
  });

  $newVideo.find('.dz-edit').on( "click", function() {
    var video_data = JSON.parse($( this ).parents('.video-box').attr('data-video-data'));
    $('#video_url').val(video_data.url);
    self.fv[3].revalidateField('video_url').then(function () {
      $('#video_title').val(video_data.infos.title);
      $('#video_description').val(video_data.infos.description);

      $(".video-thumb").removeClass('active');
      $('.video-thumb[data-pos="'+video_data.thumbnail.pos+'"]').addClass('active');
      self.loadedVideo = video_data;
    });

  });

}
