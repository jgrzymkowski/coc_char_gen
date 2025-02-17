// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require jquery-ui
//= require turbolinks
//= require react
//= require react_ujs
//= require components
//= require_tree .
//= require lodash
//= require foundation

$(document).on('turbolinks:load', function() {
    $(function(){ $(document).foundation(); });
});

if( !('CoC' in window ) ) { CoC = {}; }

CoC.humanize_sym =  function(string) {
  var pieces = string.split('_');
  var capitalized = _.map(pieces, function(s) {
    return s.length > 0 ? s[0].toUpperCase() + s.slice(1) : s;
  } );
  return capitalized.join(' ');
};

CoC.submitForm = function() {
  var errors = _.map($('[errorMessage]'), function(element) {
    return $(element).attr('errorMessage');
  });
  if( errors.length > 0 ) {
    var message = _.reduce(errors, function(memo, error) {
      return memo + "\n* " + error;
    }, "There are errors on the page.");
    alert(message);
  } else {
    $('form').submit();
  }
}
