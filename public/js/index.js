$(document).ready(function() {
  $('#btnCreate').click(function() {
    window.location.href= "create/" + $('#txtName').val() ;
  });

  $('#btnJoin').click(function() {
    window.location.href = "/game/"+ $('#txtJoin').val() + '/' + $("#txtName").val();
  });
});
