var finalTable = $('table');
$('form').submit(function(){
  var str= ""
  input.value.split(',').forEach(function(e){
    str += finalTable.find('td:contains('+e+')').parent().text();

  })
  result.innerText = str;
  return false;
});
