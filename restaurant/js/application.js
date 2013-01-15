$(document).ready(function(){
  initListView(users,"#userList");
  initListView(restaurants,"#restaurantList");
  appendListItemClickFunction('#userList','#user');
  appendListItemClickFunction('#restaurantList','#restaurant');
  appendListItemClickFunction('#foodList','#food');
  appendButtonClickFunction('#confirm');
  $(document).bind( "pagebeforechange", beforeChange);
});
var orders = '[]';
function initListView(data, selector){
  $.each(data,function(i, dataItem){
    $(selector).append('<li><a class ="ui-link-inherit" href="#order">' + constructHtmlContent(dataItem) + '</a></li>');   
  });
  $("selector").listview("refresh");
}

function constructHtmlContent(dataItem) {
  var content = '';
  var price = dataItem.price;
  if(!isEmptyString(price)) {
    content += '<p class="ui-li-aside ui-li-desc">￥<strong>'+ price +'</strong></p>'
  }
  content += '<h3 class="ui-li-leading">' + dataItem.name + '</h3>';
  return content
}

function appendListItemClickFunction(listSelector,textSelector){
  $(listSelector).on('click', 'li', function() {
        $(textSelector).val(this.innerText);
    });
}
function appendButtonClickFunction(selector){
  $(selector).on('click', function() {
    if(isValidOrder()){
        orders += createOrderJsonString();
      }else{
        alert("订单不合法，请确认所有项都已选！")
      }
    });
}

function getFoodsData(data){
  var restaurant = $('#restaurant').val();
  return foods[jQuery.trim(restaurant)];
}

function createOrderJsonString() {
  var json = '{';
  json += 'user:'+ getFieldValue('#user')+',';
  json += 'restaurant:'+ getFieldValue('#restaurant') + ',';
  json += 'food:'+ getFieldValue('#food');
  json +="}"
  return json;
}

function getFieldValue(selector) {
  return $(selector).val();
}

function beforeChange(e,data){
  if ( typeof data.toPage === "string" ) {
    var u = $.mobile.path.parseUrl( data.toPage ),
    re = /^#foods/;
    if ( u.hash.search(re) !== -1 ) {
      var restaurant = getFieldValue('#restaurant');
      if(isEmptyString(restaurant)){
        alert("请先选择餐厅！")
        e.preventDefault();        
      }else{
        initListView(getFoodsData(restaurant),'#foodList');
      }
    }
  }
}

function isEmptyString(para) {
  return para == null || para == ""
}

function isValidOrder() {
  return !(isEmptyString($('#user').val()) || isEmptyString($('#restaurant').val()) || isEmptyString($('#food').val())); 
}
