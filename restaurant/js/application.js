$(document).ready(function(){
  initListView(users,"#userList");
  initListView(restaurants,"#restaurantList");
  appendClickFunction('#userList','#user');
  appendClickFunction('#restaurantList','#restaurant');
  appendButtonClickFunction('#choose-food');
});

function initListView(data, selector){
  $.each(data,function(i, dataItem){
    $(selector).append('<li><a href="#order">' + dataItem.name + '</a></li>');   
  });
  $("selector").listview("refresh");
}

function appendClickFunction(listSelector,textSelector){
  $(listSelector).on('click', 'li', function() {
        $(textSelector).val(this.innerText);
    });
}

function appendButtonClickFunction(selector) {
  $(selector).on('click', function() {
    initListView(getFoodsData(foods),"#foodList");
     var restaurant = $('#restaurant').val();
     if(restaurant == null || restaurant == ''){
        return false;
      }
      return false;  
    });
}

function getFoodsData(data){
  var restaurant = $('#restaurant').val();
  return foods[jQuery.trim(restaurant)];
}

