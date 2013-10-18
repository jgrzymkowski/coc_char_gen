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
//= require jquery-1.10.2.min.js
//= require jquery-ui.min.js
//= require underscore-min.js
//= require jquery_ujs
//= require_tree .

if( !('CoC' in window ) ) { CoC = {}; }

CoC.humanize_sym =  function(string) {
  var pieces = string.split('_');
  var capitalized = _.map(pieces, function(s) {
    return s.length > 0 ? s[0].toUpperCase() + s.slice(1) : s;
  } );
  return capitalized.join(' ');
};

CoC.submitForm = function() {
  $('form').submit();
}