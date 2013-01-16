$(document).ready(function () {
    loadPagesHasListView();
    initListView(users, "#userList");
    initListView(restaurants, "#restaurantList");
    initOrderListView();
    appendListItemClickFunction('#userList', '#user');
    appendListItemClickFunction('#restaurantList', '#restaurant');
    appendListItemClickFunction('#foodList', '#food');
    appendButtonClickFunction('#confirm');
    $(document).bind("pagebeforechange", beforeChange);

});

var orders = [];
var orderedUser = [];

function loadPagesHasListView() {
    $.mobile.loadPage('#restaurants');
    $.mobile.loadPage('#peoples');
    $.mobile.loadPage('#foods');
    $.mobile.loadPage('#orders');
}

function initListView(data, selector) {
    $(selector).empty();
    $.each(data, function (i, dataItem) {
        $(selector).append('<li><a class ="ui-link-inherit" href="#order">' + constructHtmlContent(dataItem) + '</a> </li>');
    });
    $(selector).listview("refresh");
}

function initOrderListView() {
    var selector = '#orderList';
    $(selector).empty();

    initOrderDivider(selector);
    initOrderItems(selector);
    initUnOrderedUserDivider(selector);
    initUnOrderedUserItems(selector);

    $(selector).listview("refresh");
}

function initOrderDivider(selector) {
    $(selector).append('<li data-role="list-divider" role="heading"><strong>' +
        orderedUser.length + '人已定</strong></li>');

}

function initOrderItems(selector) {
    $.each(orders, function (i, dataItem) {
        $(selector).append('<li>' + constructOrderItemContent(dataItem) + '</li>');
    });

}

function initUnOrderedUserDivider(selector) {
    var unOrderedUserCount = users.length - orderedUser.length;
    $(selector).append('<li data-role="list-divider" role="heading"><strong>' +
        unOrderedUserCount + '人未定</strong></li>');

}

function initUnOrderedUserItems(selector) {
    $.each(users, function (i, dataItem) {
        var test='';

        if ($.inArray(dataItem, orderedUser) == -1) {
            $(selector).append('<li>' + constructHtmlContent(dataItem) + '</li>');
        }
    });
}

function constructOrderItemContent(dataItem) {
    var content = '';
    content += '<p class="ui-li-aside ui-li-desc">￥<strong >' + dataItem.price + '</strong></p>';
    content += '<h3 class="ui-li-leading">' + dataItem.user + '</h3>';
    content += '<p class="ui-li-desc"><strong>' + dataItem.restaurant + ' ' + dataItem.food + '</strong></p>';
    return content;
}

function constructHtmlContent(dataItem) {
    var content = '';
    var price = dataItem.price;
    if (!isEmptyString(price)) {
        content += '<p class="ui-li-aside ui-li-desc"><strong>' + price + '</strong></p>';
    }
    content += '<h3 class="ui-li-leading">' + dataItem.name + '</h3>';
    return content
}

function appendListItemClickFunction(listSelector, textSelector) {
    $(listSelector).on('click', 'li', function () {
        $(textSelector).val(getListItemValue(this));
    });
}

function getListItemValue(item) {
    return jQuery.trim(item.innerText.replace("\n", " "));
}

function getFoodsData(data) {
    var restaurant = $('#restaurant').val();
    return foods[jQuery.trim(restaurant)];
}

function appendButtonClickFunction(selector) {
    $(selector).on('click', function () {
        if (isValidOrder()) {
            orders.push(createOrder());
            pushIfNotExist(orderedUser, createUser());
            alert('订餐成功！');
            cleanInput();
            initOrderListView();
            return;
        }
        alert("订单不合法，请确认所有项都已选！");
    });
}

function createUser() {
    var newUser = new Object();
    newUser.name = getFieldValue("#user");
    return newUser;
}

function pushIfNotExist(array, item) {
    if ($.inArray(item, array) == -1) {
        array.push(item);
    }
}

function createOrder() {
    var order = new Object();
    order.user = getFieldValue('#user');
    order.restaurant = getFieldValue('#restaurant');
    order.food = getFieldValue('#food').split(" ")[1];
    order.price = getFieldValue('#food').split(" ")[0];
    return order;
}

function getFieldValue(selector) {
    return $(selector).val();
}

function beforeChange(e, data) {
    if (isJumpToFoodsPage(data)) {
        if (!isRestaurantChose()) {
            alert("请先选择餐厅！");
            e.preventDefault();
        } else {
            initListView(getFoodsData(restaurant), '#foodList');
        }
    }
}

function isEmptyString(para) {
    return para == null || para == ""
}

function isValidOrder() {
    return !(isEmptyString($('#user').val()) || isEmptyString($('#restaurant').val()) || isEmptyString($('#food').val()));
}

function isJumpToFoodsPage(data) {
    if (typeof data.toPage === "string") {
        var u = $.mobile.path.parseUrl(data.toPage),
            re = /^#foods/;
        if (u.hash.search(re) !== -1) {
            return true;
        }
    }
    return false;
}

function isRestaurantChose() {
    var restaurant = getFieldValue('#restaurant');
    if (isEmptyString(restaurant)) {
        return false;
    }
    return true;
}

function cleanInput() {
    $('#restaurant').val("");
    $('#user').val("");
    $('#food').val("");
}