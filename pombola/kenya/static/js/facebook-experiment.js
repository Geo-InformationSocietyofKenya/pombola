var splitByOptgroup = function splitByOptgroup($originalSelect){
  // Convert a single <select> element with <optgroup>s into
  // two <select> elements, where you select a group from the
  // first one, and then a final <option> from the second.

  var originalSelectId = $originalSelect.attr('id');
  var groupSelectId = originalSelectId + '_group';

  // Create a select box for the optgroup labels.
  var $groupSelect = $('<select>');
  $groupSelect.attr('id', groupSelectId);
  $groupSelect.prepend('<option>');

  // Store the original orpgroups in a variable, so we can
  // remove them from the DOM and re-insert them when requested.
  var $originalOptgroups = $('optgroup', $originalSelect);

  // Selections made from the group select box should populate
  // the original select box with the correct options.
  $groupSelect.on('change', function(){
    var selectedGroup = $(this).val();
    $originalSelect.empty();

    if(selectedGroup == ''){
      // They have cleared their group selection.
      $originalSelect.hide();
    } else {
      // They have chosen a group. Unhide the original select box,
      // and populate it with the relevant options.
      $originalSelect.html(
        $originalOptgroups.filter('[label="' + selectedGroup + '"]').html()
      );
      $originalSelect.prepend('<option>');
      $originalSelect.show().focus();
    }

    // Trigger any "change" listeners that might be set
    // on the original select box.
    $originalSelect.trigger('change');
  });

  // Populate the new select box with the optgroup labels
  // from the original select box.
  $originalOptgroups.each(function(){
    var groupLabel = $(this).attr('label');
    var $option = $('<option>');
    $option.text(groupLabel);
    $option.val(groupLabel);
    $option.appendTo($groupSelect);
  });

  // Insert the new select box into the DOM, before
  // the original one.
  $groupSelect.insertBefore( $originalSelect );

  // Update any <label> elements that were pointing to
  // the original select box.
  $('label[for="' + originalSelectId + '"]').attr('for', groupSelectId);

  // Empty and hide the original select box for now
  // (it will be shown again once a group is chosen).
  $originalSelect.empty().hide();

}

$(function(){

  $('.js-split-by-optgroup').each(function(){
    splitByOptgroup( $(this) );
  });

  // Show the hidden page element (we don't show anything if no JS is available)
  $('#ctas').show();

  $('.js-find-mp').on('change', function(){
    var constituency = $(this).val();
    if(constituency != '') {
      $('.js-find-mp-result').html('<p>AJAX result will go here ' + Math.random() + '</p>');
    } else {
      $('.js-find-mp-result').empty();
    }
  });

  $('.js-find-reg-center').on('change', function(){
    var constituency = $(this).val();
    if(constituency != '') {
      $('.js-find-reg-center-result').html('<p>AJAX result will go here ' + Math.random() + '</p>');
    } else {
      $('.js-find-reg-center-result').empty();
    }
  });

  $('.js-compare-countries').on('click', function(){
    $('.js-compare-countries-result table').toggle();
  });

  $('.js-show-winners').on('change', function(){
    var year = $(this).val();
    if(year != '') {
      $('.js-show-winners-result #' + year).show().siblings().hide();
    } else {
      $('.js-show-winners-result table').hide();
    }
  });

});
