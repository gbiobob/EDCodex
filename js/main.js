
jQuery(function() {
 EDCodex.initPage();
 autocompleteSearch('.search input');
});

var EDCodex = {

  'fullDetails' : true,

  'config' : { },


  /**
   * Fulltext Search
   */
  'textSearch' : function() {
    $('#fullSearch').submit(function(e){
      e.preventDefault();

      history.pushState({key : 'value'}, 'alt', '?m=search');

      $('#main').html('<div id="loader">'+svgLoader+'</div>');

      var valSearch = $('#searchTxt').val();
      $('body').attr('id','page_search');
      $('#menu-1 .selected').removeClass('selected');
      $('.ui-autocomplete').hide();

      $.ajax({
        type: "POST",
        url: "?m=search&render=json",
        data: $('#fullSearch').serialize(),
        dataType: 'json',
        success: function(data) {
          EDCodex.parseList(data, '#main');
          $('<h1/>', { 'html': data.title + ' : <em>"' + valSearch + '"</em>' }).prependTo('#main');
        }
      });
    });
  },

  /**
   * Initial page launch
   */
  'initPage' : function() {

    var menu = $('body').attr('id');
    var page = $('body').attr('data-page');


    //-- Check theme
    checkTheme();

    //-- Manage fulltext search
    EDCodex.textSearch();

    //-- Init dropdown menu
    EDCodex.initDropdownNav();

    //--


    initRemove();
    initDialog();

    /* Toggle view more revision for an entry */
    $('#view_more').click(function() {
      $(this).parent().hide();
      $('.revisions .old').show();
    });

    /* Forms */
    if(page=='new') EDCodex.initForm();
    if(page=='edit') EDCodex.initForm();

    /* Admin */
    if(menu=='page_admin') EDCodex.initAdmin();
  },

  /**
   * Dropdown navigation
   */
  'initDropdownNav' : function() {

    /*  Change view */

    $('.tog_view').click(function() {
      $('.fold,.tog_view').toggle();
      EDCodex.fullDetails = Math.abs(EDCodex.fullDetails-1);
    });

    /* Build dropdown */

    $(".dropmenu .selected").each(function() {
      $(this).parent().parent().prev('.item_sel').html($(this).html());
      $(this).hide();
    });
    $(".dropmenu ul a").each(function() {
      var url = $(this).attr('href');
      $(this).attr('href','#');

      $(this).click(function(e) {

        e.preventDefault();
        history.pushState({key : 'value'}, 'alt', url);

        $('#entries').html('<div id="loader">'+svgLoader+'</div>');
        $('.dropmenu ul').hide();


        $.ajax({
          type: 'GET',
          url: url+'&render=json',
          dataType: 'json',
          success: function(data) {
            EDCodex.parseList(data);

          }
        });
      });
    });


  },


  /**
   * Render entries list from JSON
   */
  'parseList' : function (data, target) {

    if(target == undefined) target = '#entries';

    $(target).empty();

    document.title = data.title;

    $('h1').html(data.catname + ' (' + data.nb + ')');
    if (data.description == '') {
      $('#description').hide();
    } else {
      $('#description').show();
      $('#description').html( data.description );
    }
    $(data.entries).each(function() {

      if(this.LIST_ICON != null) {
        var iconCats = this.LIST_ICON.split(",");
        var htmlIcons = '<ul class="types">';
        $(iconCats).each(function() {
          var iconParams = this.split("#");
          htmlIcons += '  <li><i class="fa fa-' + iconParams[1] + ' fa-fw" data-help="' + iconParams[0] + '"></i></li>';
        });
        htmlIcons += '</ul>';
      }

      $('<div/>', {
          'class':'app',
          'html':

        '<div class="columns large-9 medium-9">'+
        '  <h2><a href="' + this.URL + '">' + this.TITLE + '</a></h2>'+
        '  <p class="fold">' + this.SUB_TITLE + '</p>'+
        '  <em class="fold">' + this.LIST_CATS + '</em>'+

        '</div>'+
        '<div class="columns large-3 medium-3 detail">'+
        htmlIcons +
        '  <div class="fold">' + this.LIST_OWNERS + '<br>Updated : ' + this.DATE_UPDATE + '</div>'+
        '</div>'+
        '<br class="clear"/>'


      }).appendTo(target);
    });


    //-- TODO : replace this with a JS parser
    $('#filter').html(data.filters);
    EDCodex.initDropdownNav();

    if(!EDCodex.fullDetails) $('.fold,.tog_view').toggle();

  },

  /**
   *
   */
/*  'refreshToolbarSeach' : function () {
    $('.dropmenu a').each(function () {
      EDCodex.replaceUrlParam(this,'cat',2);
    });
  },

  'replaceUrlParam' : function (element, paramName, paramValue){
    var url = $(element).attr('href');
    var pattern = new RegExp('('+paramName+'=).*?(&|$)')
    var newUrl=url
    if(url.search(pattern)>=0){
        newUrl = url.replace(pattern,'$1' + paramValue + '$2');
    }
    else{
        newUrl = newUrl + (newUrl.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue
    }
    return newUrl
  },*/

  /**
   * Load requirements for admin
   */
  'initAdmin' : function() {

    EDCodex.initForm();
    $(".tabSort").tablesorter();

  },

  /**
   * Load requirements for submit / edit
   */
  'initForm' : function() {

    var page = $('body').attr('data-page');

    var formType = $('#entry_edit').attr('data-form');
    if(formType=='add') {
      $('#edit_type').show();
      $('#edit_datas').hide();
    } else {
      $('#edit_type').hide();
      $('#edit_datas').show();
      refreshFieldsAvaible();
    }

    $('#type_list a').click(function() {
      $('#type_list a').removeClass('selected');
      $(this).addClass('selected');
      var toolType = $(this).attr('data-type');
      $('#tool_type').val(toolType);
      $('#entry_edit').attr('data-type',toolType);
      $('#edit_type').hide();
      $('#edit_datas').show();
      refreshFieldsAvaible();
      if(formType=='add' && $('.links li').length==0) {
        addLink(1);
      }
      $('#change_type').show();

    });

    /* Toggle desc api */
    toggleDescApi();
    $('#with_api, #use_api').click(function() {
      toggleDescApi();
    });

    /* Change type of an entry */
    $('#change_type').click(function() {
      $(this).hide();
      $('#edit_type').show();
      $('#edit_datas').hide();
    });

    /* Add a link to an entry */
    var nbLink = 2;
    $('#add_link').click(function() {
      addLink(nbLink);
      nbLink++;
    });

    /* Sumo select */

    $('.multiple_sel').SumoSelect({csvDispCount: 9});


    /* JQuery UI datepicker */

    $(".datepick").datepicker({dateFormat: "yy-mm-dd"});

    /* CKEditor launch */

    CKEDITOR.config.extraAllowedContent = 'div(row,columns,large-12,large-6,large-3)';

    var toolbarConf = [
        ['Source'],
        ['Undo','Redo','RemoveFormat'],
        ['Bold','Italic','Strike','Underline'],
        ['NumberedList','BulletedList'],
        ['Link','Unlink']
      ];
    if(page=='pages') toolbarConf.push(['Format']);

    $('.wysiwyg').ckeditor({
      toolbar: toolbarConf,
      contentsCss : ['template/default.css?v=3']
    });
  }
};


function getStorageJson(element) {

  if(!element.length) return;

  var element = $(element);

  version = $('body').attr('data-version');

  var urlJson = 'datas/search.json';

  if(!simpleStorage.canUse()) return [];

  var versionCur = simpleStorage.get('version');
  if(versionCur != version) {
    simpleStorage.flush();
    simpleStorage.set('version',version);
  }


  // Check if "key" exists in the storage
  var value = simpleStorage.get('search');
  if(!value) {
    // if not - load the data from the server
    value = null;
    $.ajax({
      url: urlJson,
      dataType: "json"
    }).fail(function(jqXHR, textStatus, errorThrown) {
      return null;
    }).done(function( data ) {
      simpleStorage.set('search',data);
      autocompleteSearch(element);
    });
  }
  return value;
}

function autocompleteSearch(element) {

  var element = $(element);
  if(element.length){
    var datas = getStorageJson(element);
    if(datas == null) return false;
    $( element ).autocomplete({
      source: datas,
      select: function(event, ui) { $('#searchTxt').val(ui.item.value); $("#fullSearch").submit(); }
    });
  }

}


function toggleDescApi () {

  if( $('#use_api').is(':checked') ){
    $('.api_desc_use').show();
  } else {
    $('.api_desc_use').hide();
  }

  if( $('#with_api').is(':checked') ){
    $('.api_desc').show();
  } else {
    $('.api_desc').hide();
  }
}


function initRemove() {

  $('.btn_remove,.btn_trash').click(function() {
    var msg = $(this).attr('data-title');
    var op = $(this).hasClass('btn_trash') ? 'DELETE' : 'disable';
    var r = confirm(
      "Do you really want to "+op+" "+
      (msg!='' ? '"'+msg+'"' : '')+
      " ?"
    );
    if (r == true) {
      $(this).parent().children('input').val('');
      $(this).parent().hide();
    } else {
      return false;
    }
  });

}

function initDialog() {

  $('.btn_export').each(function(){
    var url = $(this).attr('href');
    $(this).attr('data-url',url);
  });

  $('.btn_export').attr('href','#');
  $('.btn_export').click(function() {
    var loadUrl = $(this).attr('data-url');
    $.ajax({
      url: loadUrl,
      success: function(data) {
        $("#dialog").html('<textarea style="width:100%;height:400px;">'+data+'</textarea>').dialog({modal:true}).dialog('open');
      }
    });
  });
}

function addLink (nbLink) {
  var idNew     = '#url_a_n'+nbLink;
  var entryType = $('#entry_edit').attr('data-type');
  var model     = $("#link_model").clone().html();

  model = model.replace(/NBLINK/gi,nbLink);
  $(".links").append('<li>'+model+'</li>');

  switch(entryType) {
    case 'video':
      $(idNew).val('videos');
      break;
    case 'thread':
      $(idNew).val('thread');
      break;
  }

  initRemove();
}

function refreshFieldsAvaible() {

  var formType = $('#entry_edit').attr('data-type');
  $(".tool, .thread, .video, .news").hide();
  $("."+formType).show();
  if(formType=='tool') {
    $("#tool_links").appendTo("#links_bottom");
  } else {
    $("#tool_links").appendTo("#links_top");
  }

}

function getTheme() {
return [];;

  if(!simpleStorage.canUse()) {
    $('.theme').hide();
    return [];
  }

  var theme = simpleStorage.get('theme');
  if(theme == undefined) theme = 'light';
  if(theme == 'dark') {
    $('body').addClass('dark');
  }
}

function checkTheme() {

  if(!simpleStorage.canUse()) {
    $('.theme').hide();
    return [];
  }

  var theme = simpleStorage.get('theme');
  if(theme == undefined) theme = 'light';

  $('.theme').each(function() {
    if($(this).attr('data-theme') == theme) $(this).hide();
    else $(this).show();
  });

  $('.theme').click(function() {
    var theme = $(this).attr('data-theme');
    simpleStorage.set('theme',theme);
    $('body').removeClass();
    $('body').addClass(theme);

    $('.theme').toggle();

    //-- Define a cookie
    document.cookie = "theme="+theme;
  });

}

/**
 * SVG Loader
 */
var svgLoader = '<svg width="100" height="100" viewbox="0 0 40 40"><path d="m5,8l5,8l5,-8z"   class="l1 d1" /><path d="m5,8l5,-8l5,8z"   class="l1 d2" /><path d="m10,0l5,8l5,-8z"  class="l1 d3" /><path d="m15,8l5,-8l5,8z"  class="l1 d4" /><path d="m20,0l5,8l5,-8z"  class="l1 d5" /><path d="m25,8l5,-8l5,8z"  class="l1 d6" /><path d="m25,8l5,8l5,-8z"  class="l1 d7" /><path d="m30,16l5,-8l5,8z" class="l1 d8" /><path d="m30,16l5,8l5,-8z" class="l1 d9" /><path d="m25,24l5,-8l5,8z" class="l1 d10" /><path d="m25,24l5,8l5,-8z" class="l1 d11" /><path d="m20,32l5,-8l5,8z" class="l1 d13" /><path d="m15,24l5,8l5,-8z" class="l1 d14" /><path d="m10,32l5,-8l5,8z" class="l1 d15" /><path d="m5,24l5,8l5,-8z"  class="l1 d16" /><path d="m5,24l5,-8l5,8z"  class="l1 d17" /><path d="m0,16l5,8l5,-8z"  class="l1 d18" /><path d="m0,16l5,-8l5,8z"  class="l1 d19" /><path d="m10,16l5,-8l5,8z" class="l2 d0" /><path d="m15,8l5,8l5,-8z"  class="l2 d3" /><path d="m20,16l5,-8l5,8z" class="l2 d6"  /><path d="m20,16l5,8l5,-8z" class="l2 d9" /><path d="m15,24l5,-8l5,8z" class="l2 d12" /><path d="m10,16l5,8l5,-8z" class="l2 d15" /></svg>';

/**
 * Simple storage lib : https://github.com/andris9/simpleStorage
 */

(function(a,b){if(typeof define==="function"&&define.amd){define(b)}else{a.simpleStorage=b()}}(this,function(){var o="0.1.3",f=false,g=0,k=false,j=null;function i(){window.localStorage.setItem("__simpleStorageInitTest","tmpval");window.localStorage.removeItem("__simpleStorageInitTest");a();n();h();if("addEventListener" in window){window.addEventListener("pageshow",function(p){if(p.persisted){c()}},false)}k=true}function h(){if("addEventListener" in window){window.addEventListener("storage",c,false)}else{document.attachEvent("onstorage",c)}}function c(){try{a()}catch(p){k=false;return}n()}function a(){var q=localStorage.getItem("simpleStorage");try{f=JSON.parse(q)||{}}catch(p){f={}}g=l()}function d(){try{localStorage.setItem("simpleStorage",JSON.stringify(f));g=l()}catch(p){return p}return true}function l(){var p=localStorage.getItem("simpleStorage");return p?String(p).length:0}function n(){var v,s,p,r,t,u=Infinity,q=0;clearTimeout(j);if(!f||!f.__simpleStorage_meta||!f.__simpleStorage_meta.TTL){return}v=+new Date();t=f.__simpleStorage_meta.TTL.keys||[];r=f.__simpleStorage_meta.TTL.expire||{};for(s=0,p=t.length;s<p;s++){if(r[t[s]]<=v){q++;delete f[t[s]];delete r[t[s]]}else{if(r[t[s]]<u){u=r[t[s]]}break}}if(u!=Infinity){j=setTimeout(n,Math.min(u-v,2147483647))}if(q){t.splice(0,q);b();d()}}function e(s,q){var u=+new Date(),r,p,t=false;q=Number(q)||0;if(q!==0){if(f.hasOwnProperty(s)){if(!f.__simpleStorage_meta){f.__simpleStorage_meta={}}if(!f.__simpleStorage_meta.TTL){f.__simpleStorage_meta.TTL={expire:{},keys:[]}}f.__simpleStorage_meta.TTL.expire[s]=u+q;if(f.__simpleStorage_meta.TTL.expire.hasOwnProperty(s)){for(r=0,p=f.__simpleStorage_meta.TTL.keys.length;r<p;r++){if(f.__simpleStorage_meta.TTL.keys[r]==s){f.__simpleStorage_meta.TTL.keys.splice(r)}}}for(r=0,p=f.__simpleStorage_meta.TTL.keys.length;r<p;r++){if(f.__simpleStorage_meta.TTL.expire[f.__simpleStorage_meta.TTL.keys[r]]>(u+q)){f.__simpleStorage_meta.TTL.keys.splice(r,0,s);t=true;break}}if(!t){f.__simpleStorage_meta.TTL.keys.push(s)}}else{return false}}else{if(f&&f.__simpleStorage_meta&&f.__simpleStorage_meta.TTL){if(f.__simpleStorage_meta.TTL.expire.hasOwnProperty(s)){delete f.__simpleStorage_meta.TTL.expire[s];for(r=0,p=f.__simpleStorage_meta.TTL.keys.length;r<p;r++){if(f.__simpleStorage_meta.TTL.keys[r]==s){f.__simpleStorage_meta.TTL.keys.splice(r,1);break}}}b()}}clearTimeout(j);if(f&&f.__simpleStorage_meta&&f.__simpleStorage_meta.TTL&&f.__simpleStorage_meta.TTL.keys.length){j=setTimeout(n,Math.min(Math.max(f.__simpleStorage_meta.TTL.expire[f.__simpleStorage_meta.TTL.keys[0]]-u,0),2147483647))}return true}function b(){var p=false,r=false,q;if(!f||!f.__simpleStorage_meta){return p}if(f.__simpleStorage_meta.TTL&&!f.__simpleStorage_meta.TTL.keys.length){delete f.__simpleStorage_meta.TTL;p=true}for(q in f.__simpleStorage_meta){if(f.__simpleStorage_meta.hasOwnProperty(q)){r=true;break}}if(!r){delete f.__simpleStorage_meta;p=true}return p}try{i()}catch(m){}return{version:o,canUse:function(){return !!k},set:function(q,s,p){if(q=="__simpleStorage_meta"){return false}if(!f){return false}if(typeof s=="undefined"){return this.deleteKey(q)}p=p||{};try{s=JSON.parse(JSON.stringify(s))}catch(r){return r}f[q]=s;e(q,p.TTL||0);return d()},get:function(p){if(!f){return false}if(f.hasOwnProperty(p)&&p!="__simpleStorage_meta"){if(this.getTTL(p)){return f[p]}}},deleteKey:function(p){if(!f){return false}if(p in f){delete f[p];e(p,0);return d()}return false},setTTL:function(q,p){if(!f){return false}e(q,p);return d()},getTTL:function(q){var p;if(!f){return false}if(f.hasOwnProperty(q)){if(f.__simpleStorage_meta&&f.__simpleStorage_meta.TTL&&f.__simpleStorage_meta.TTL.expire&&f.__simpleStorage_meta.TTL.expire.hasOwnProperty(q)){p=Math.max(f.__simpleStorage_meta.TTL.expire[q]-(+new Date())||0,0);return p||false}else{return Infinity}}return false},flush:function(){if(!f){return false}f={};try{localStorage.removeItem("simpleStorage");return true}catch(p){return p}},index:function(){if(!f){return false}var p=[],q;for(q in f){if(f.hasOwnProperty(q)&&q!="__simpleStorage_meta"){p.push(q)}}return p},storageSize:function(){return g}}}));

getTheme();