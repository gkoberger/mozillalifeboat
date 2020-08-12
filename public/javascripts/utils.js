$.page = function(page, cb) {
  $(function() {
    if(!$('#pg-'+page).length) return;
    cb();
  });
};
