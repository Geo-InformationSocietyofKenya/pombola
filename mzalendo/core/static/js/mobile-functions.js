// Mobile boilerplate helper function (https://github.com/h5bp/mobile-boilerplate/blob/master/js/mylibs/helper.js)
// Hide URL Bar for iOS and Android by Scott Jehl
// https://gist.github.com/1183357
function hideUrlBar() {
  var win = window,
    doc = win.document;

  // If there's a hash, or addEventListener is undefined, stop here
  if( !location.hash || !win.addEventListener ){

    //scroll to 1
    window.scrollTo( 0, 1 );
    var scrollTop = 1,

    //reset to 0 on bodyready, if needed
    bodycheck = setInterval(function(){
      if( doc.body ){
        clearInterval( bodycheck );
        scrollTop = "scrollTop" in doc.body ? doc.body.scrollTop : 1;
        win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
      } 
    }, 15 );

    win.addEventListener( "load", function(){
      setTimeout(function(){
        //reset to hide addr bar at onload
        win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
      }, 0);
    }, false );
  }
}


//generic re-usable hide or show with class states
function hideShow(elem, trig) {
  $(elem).toggleClass(function() {
    if ($(this).is('.open')) {
      $(this).hide().removeClass('open');
      trig.removeClass('active');
      return 'closed';
    } else {
      $(this).show().removeClass('closed');
      trig.addClass('active');
      return 'open';
    }
  });
}

$(function(){
  /*
   * General stuff
   */
  // add appropriate stuff to head
  // <!-- Mobile viewport optimization http://goo.gl/b9SaQ -->
  $('head').append('<meta name="HandheldFriendly" content="True">').append('<meta name="MobileOptimized" content="320">');
  
  $('.social-and-tools').append('<ul><li><a href="/" class="m-fb">Share page via Facebook</a></li><li><a href="/" class="m-twitter">Share page via Twitter</a></li></ul>');

  /*
   * Main non AJAX interactions
   */
  // prep
  $('#main-menu, #search, #site-user-tools, #mc-embedded-subscribe-form').hide();
  $('#search').before('<menu id="m-top-tools"><button class="nav-trigger m-icon-nav">menu</button><button class="search-trigger icon-search">search</button></menu>');

  // nav
  $('.nav-trigger').live('click', function(){
    //add states to trigger elem
    hideShow('#main-menu, #site-user-tools', $(this));
  });

  // search
  $('.search-trigger').live('click', function(){
    hideShow('#search', $(this));
  });

  // search
  $('.subscribe-box > h2').on('click', function(){
    hideShow('#mc-embedded-subscribe-form', $(this));
  });

  /*
   * Get appearances
   */
  var appearances_url = $('#appearances').attr('data-tab-content-source-url');

  $('#appearances').hide();

  $('.appearances-trigger').on('click', function(e){
    e.preventDefault();
    hideShow('#appearances', $(this));

    //only get data if its not already been got and there
    //is a 'data-tab-content-source-url' attribute
    if ( appearances_url && $('#appearances.has-data').length === 0) {
      $('#appearances').load(appearances_url, function(){
        $('#appearances').addClass('has-data');
        $('#appearances > h2').hide();
      });
    }
  });

  /*
   * Get the sub-menu links if on a page with child items
   */
  //if .page-title has a data-sub-menu-id attr
  //clone the relavent ul#data-sub-menu-id from in the menu
  //stick below .page-title
  //show button inside .page-title that toggles the ul#data-sub-menu-id
  var sub_menu_id = '#'+$('.page-title').attr('data-sub-menu-id'),
      $page_title = $('.page-title');
  if(sub_menu_id){
    $page_title.addClass('has-sub-menu').append('<button class="m-sub-menu-trigger">Show sub menu</button>');
    $(sub_menu_id).hide().insertAfter($page_title).addClass('m-sub-menu');
  }

  $('.m-sub-menu-trigger').on('click', function(e){
    e.preventDefault();
    hideShow(sub_menu_id, $(this));
  });
});