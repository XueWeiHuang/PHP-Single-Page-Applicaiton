// show list of orders when 'order' clicked
$(document).on('click', '#order', function(){

    // bind order events

    // pagination controls click event
    $(document).off('click', '.pagination li');
    $(document).on('click', '.pagination li', function(){
        // get json url
        var json_url=$(this).find('a').attr('data-page');

        // show list of orders
        showOrders(json_url);
    });

    showOrders();
    return false;
});

// show list of orders when 'list orders' clicked
$(document).on('click', '.read-orders-button', function(){
    showOrders();
    return false;
});

// show html form when 'create order' clicked
$(document).on('click', '.create-order-button', function(){

    // populate customer field
    $.getJSON("/api/customer/read.php", function(data){
        if(data.records.length > 0){
            $.each(data.records, function(key, val) {
                //create_order_html+= "        <option " + (val.mgrid == mgrid ? "selected" : "") + " value=\"" + val.mgrid + "\">\"" + val.manager + "\"</option>\n";
                $("#custid").append("        <option value=\"" + val.custid + "\">" + val.companyname + "</option>\n");
            });
        }
    });

    // populate employee field
    $.getJSON("/api/employee/read.php", function(data){
        if(data.records.length > 0){
            $.each(data.records, function(key, val) {
                //create_order_html+= "        <option " + (val.mgrid == mgrid ? "selected" : "") + " value=\"" + val.mgrid + "\">\"" + val.manager + "\"</option>\n";
                $("#empid").append("        <option value=\"" + val.empid + "\">" + val.name + "</option>\n");
            });
        }
    });

    // populate shipper field
    $.getJSON("/api/shipper/read.php", function(data){
        if(data.records.length > 0){
            $.each(data.records, function(key, val) {
                //create_order_html+= "        <option " + (val.mgrid == mgrid ? "selected" : "") + " value=\"" + val.mgrid + "\">\"" + val.manager + "\"</option>\n";
                $("#shipperid").append("        <option value=\"" + val.shipperid + "\">" + val.companyname + "</option>\n");
            });
        }
    });

    // populate product field
    $.getJSON("/api/product/read.php", function(data){
        if(data.records.length > 0){
            $.each(data.records, function(key, val) {
                //create_order_html+= "        <option " + (val.mgrid == mgrid ? "selected" : "") + " value=\"" + val.mgrid + "\">\"" + val.manager + "\"</option>\n";
                $("#productid").append("        <option value=\"" + val.productid + "\" data-id=\"" + val.productid + "\" data-unitprice=\"" + val.unitprice + "\">" + val.productname + " (" + formatter.format(val.unitprice) + ")" + "</option>\n");
            });
        }
    });

    var create_order_html =
        "<h2 class=\"float-left\">Create Order</h2>" +

        "<div class=\"right-button-margin clearfix\">" +
        "  <button type=\"button\" class=\"btn btn-outline-secondary float-right read-orders-button\">List Orders</button>" +
        "</div>" +

        "<form id=\"create-order-form\" method=\"post\" class=\"needs-validation\" novalidate>\n" +

        // customer field
        "  <div class=\"form-row\">\n" +
        "    <div class=\"form-group col-md-7\">\n" +
        "      <label for=\"custid\">Customer</label>\n" +
        "      <select id=\"custid\" name=\"custid\" class=\"form-control\">\n" +
        "        <option selected>Select customer...</option>\n" +
        "      </select>\n" +
        "    </div>\n" +
        
        // employee field
        "    <div class=\"form-group col-md-5\">\n" +
        "      <label for=\"empid\">Employee</label>\n" +
        "      <select id=\"empid\" name=\"empid\" class=\"form-control\">\n" +
        "        <option selected>Select employee...</option>\n" +
        "      </select>" +
        "    </div>\n" +
        "  </div>\n" +

        // order date field
        "  <div class=\"form-row\">\n" +
        "    <div class=\"form-group col-md-4\">\n" +
        "      <label for=\"orderdate\">Order Date</label>\n" +
        "      <input type=\"date\" class=\"form-control\" id=\"orderdate\" name=\"orderdate\">\n" +
        "    </div>\n" +

        // required date field
        "    <div class=\"form-group col-md-4\">\n" +
        "      <label for=\"requireddate\">Required Date</label>\n" +
        "      <input type=\"date\" class=\"form-control\" id=\"requireddate\" name=\"requireddate\">\n" +
        "    </div>\n" +

        // shipped date field
        "    <div class=\"form-group col-md-4\">\n" +
        "      <label for=\"shippeddate\">Shipped Date</label>\n" +
        "      <input type=\"date\" class=\"form-control\" id=\"shippeddate\" name=\"shippeddate\">\n" +
        "    </div>\n" +
        "  </div>\n" +

        // product name field
        "  <div class=\"form-row\">\n" +
        "    <div class=\"form-group col-md-6\">\n" +
        "      <label for=\"productid\">Product</label>\n" +
        "      <select id=\"productid\" name=\"productid\" class=\"form-control\">\n" +
        "        <option selected>Select product...</option>\n" +
        "      </select>" +
        "    </div>\n" +

        // product quantity field
        "    <div class=\"form-group col-md-2\">\n" +
        "      <label for=\"productquantity\">Quantity</label>\n" +
        "      <input type=\"number\" min=\"1\" value=\"1\" class=\"form-control\" id=\"productquantity\" name=\"productquantity\">\n" +
        "    </div>\n" +

        // product discount field
        "    <div class=\"form-group col-md-2\">\n" +
        "      <label for=\"productdiscount\">Discount</label>\n" +
        "        <div class=\"input-group mb-3\">\n" +
        "          <input type=\"number\" min=\"0\" max=\"100\" step=\"1\" value=\"0\" class=\"form-control\" id=\"productdiscount\" name=\"productdiscount\">\n" +
        "            <div class=\"input-group-append\">\n" +
        "              <span class=\"input-group-text\">%</span>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +

        // add product button
        "    <div class=\"form-group col-md-2\">\n" +
        "      <label for=\"add-product-button\">&nbsp;</label>\n" +
        "      <button type=\"button\" class=\"form-control btn btn-primary mb-2\" id=\"add-product-button\" name=\"add-product-button\">Add</button>\n" +
        "    </div>\n" +
        "  </div>\n" +

        // products table
        "  <table class='table table-hover'>" +
        "    <thead class='thead-light'>" +
        "      <tr>" +
        "        <th scope='col'>Product</th>" +
        "        <th scope='col'>Unit Price</th>" +
        "        <th scope='col'>Quantity</th>" +
        "        <th scope='col'>Discount</th>" +
        "        <th scope='col'>Total</th>" +
        "        <th scope='col' class='text-center'>Action</th>" +
        "      </tr>" +
        "    </thead>" +
        "    <tbody class='tbody-product-order-table'>" +
        "    </tbody>" +
        "  </table>" +

        // different shipping address field
        "  <div class=\"form-group\">\n" +
        "    <div class=\"form-check\">\n" +
        "      <input class=\"form-check-input\" type=\"checkbox\" id=\"differentaddress\" name=\"differentaddress\" onclick=\"showShippingAddress()\">\n" +
        "      <label class=\"form-check-label\" for=\"differentaddress\">Ship to different address</label>\n" +
        "    </div>\n" +
        "  </div>" +

        // shipping to name field
        "<div id=\"shippingaddress\" style=\"display: none\">\n" +
        "  <div class=\"form-group\">\n" +
        "    <label for=\"shipname\">Ship To</label>\n" +
        "    <input type=\"text\" class=\"form-control\" id=\"shipname\" name=\"shipname\" placeholder=\"Name of recipient\">\n" +
        "  </div>\n" +

        // shipping address field
        "  <div class=\"form-group\">\n" +
        "    <label for=\"shipaddress\">Address</label>\n" +
        "    <input type=\"text\" class=\"form-control\" id=\"shipaddress\" name=\"shipaddress\" placeholder=\"1234 Main St\">\n" +
        "  </div>\n" +

        // shipping city field
        "  <div class=\"form-row\">\n" +
        "    <div class=\"form-group col-md-4\">\n" +
        "      <label for=\"shipcity\">City</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"shipcity\" name=\"shipcity\" placeholder=\"City\">\n" +
        "    </div>\n" +

        // shipping region field
        "    <div class=\"form-group col-md-2\">\n" +
        "      <label for=\"shipregion\">Region</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"shipregion\" name=\"shipregion\" placeholder=\"Region\">\n" +
        "    </div>\n" +

        // shipping postal code field
        "    <div class=\"form-group col-md-2\">\n" +
        "      <label for=\"shippostalcode\">Postal Code</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"shippostalcode\" name=\"shippostalcode\" placeholder=\"XXX XXX\">\n" +
        "    </div>\n" +

        // shipping country field
        "    <div class=\"form-group col-md-4\">\n" +
        "      <label for=\"shipcountry\">Country</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"shipcountry\" name=\"shipcountry\" placeholder=\"Country\">\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>\n" +

        // submit and cancel buttons
        "  <button type=\"submit\" class=\"btn btn-primary mr-2\">Submit</button>\n" +
        "  <button type=\"button\" class=\"btn btn-outline-secondary read-orders-button\">Cancel</button>\n" +

        "</form>";

    // inject html to 'content' of index.html
    $("#content").html(create_order_html);

});

// add product to order
$(document).on('click', '#add-product-button', function () {
    if ($('#productid').find(':selected').data('id') !== undefined && $('#productquantity').val() > 0){
        var productid = $('#productid').find(':selected').data('id');
        var productname = $('#productid').find(':selected').text();
        var unitprice = $('#productid').find(':selected').data('unitprice');
        var qty = $('#productquantity').val();
        var discount = $('#productdiscount').val();
        var total = (unitprice - (unitprice * discount/100)) * qty;

        var product_order_table_html =
        "      <tr data-productid=\"" + productid + "\"  data-unitprice=\"" + unitprice + "\" data-qty=\"" + qty + "\" data-discount=\"" + discount + "\">" +
        "        <td class='align-middle'>" + productname + "</td>" +
        "        <td class='align-middle'>" + formatter.format(unitprice) + "</td>" +
        "        <td class='align-middle'>" + qty + "</td>" +
        "        <td class='align-middle'>" + (discount > 0 ? discount + "%" : "") + "</td>" +
        "        <td class='align-middle'>" + formatter.format(total) + "</td>" +
        // action buttons
        "        <td class='text-center'>" +
        "          <div class='btn-group' role='group' aria-label='Action buttons'>" +
        // view button
        //"            <button type='button' class='btn btn-outline-secondary btn-sm read-one-order-button' data-id='" + productid + "'>+</button>" +
        // edit button
        //"            <button type='button' class='btn btn-outline-secondary btn-sm update-order-button' data-id='" + productid + "'>-</button>" +
        // delete button
        "            <button type='button' class='btn btn-outline-secondary btn-sm remove-product-button' data-id='" + productid + "'>Remove</button>" +
        "          </div>" +
        "        </td>" +
        "      </tr>";

        $('.tbody-product-order-table').append(product_order_table_html)

    }
});

// remove product from order
$(document).on('click', '.remove-product-button', function () {
    $(this).closest('tr').remove();
});

// will run if create order form is submitted
$(document).on('submit', '#create-order-form', function(){

    // get form data
    var form_data=JSON.stringify($(this).serializeObject2());

    //return false;
    // submit form data to api
    $.ajax({
        url: '/api/order/create.php',
        type : 'POST',
        contentType : 'application/json',
        data : form_data,
        success : function(result) {
            // order was created, go back to order list
            showOrders();
            showAlert("success", "Order was created." );
        },
        error: function(xhr, resp, text) {
            // show error to console and inform user
            console.log(xhr, resp, text);
            showAlert("danger", "Order could not be created." );
        }
    });
    return false;
});

// handle read one button click
$(document).on('click', '.read-one-order-button', function(){

    // get order id
    var id = $(this).attr('data-id');

    // read order record based on given ID
    $.getJSON("/api/order/read.php?id=" + id, function(data){

        // populate category field
        $.getJSON("/api/category/read_one.php?id=" + data.categoryid, function(cat){
            if(cat.categoryname.length > 0){
                $("#categoryid").val(cat.categoryname);
            }
        });

        // populate supplier field
        $.getJSON("/api/supplier/read.php?id=" + data.supplierid, function(sup){
            if(sup.companyname.length > 0){
                $("#supplierid").val(sup.companyname);
            }
        });

        var read_one_order_html =
            "<h2 class=\"float-left\">Order Details</h2>\n" +

            "<div class=\"right-button-margin clearfix\">\n" +
            "  <button type=\"button\" class=\"btn btn-outline-secondary float-right read-orders-button\">List Orders</button>\n" +
            "</div>\n" +

            "<form class=\"bg-light p-3\">\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"empid\" class=\"col-sm-2 col-form-label\">ID</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"orderid\" value=\"" + data.orderid + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"titleofcourtesy\" class=\"col-sm-2 col-form-label\">Order Name</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"ordername\" value=\"" + data.ordername + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"titleofcourtesy\" class=\"col-sm-2 col-form-label\">Unit Price</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"unitprice\" value=\"" + data.unitprice + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"firstname\" class=\"col-sm-2 col-form-label\">Supplier</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"supplierid\" value=\"" + data.supplierid + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"lastname\" class=\"col-sm-2 col-form-label\">Category</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"categoryid\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"lastname\" class=\"col-sm-2 col-form-label\">Discontinued</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"discontinued\" value=\"" + (data.discontinued == 0 ? "NO" : "YES" ) + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "</form>\n" +

            "<button type=\"button\" class=\"btn btn-primary m-3 read-orders-button\">Cancel</button>\n";

        // inject html to 'content' of index.html
        $("#content").html(read_one_order_html);
    })
        .fail(function() {
            showAlert("danger", "Order not found." );
        });
});

// show html form when edit order button was clicked
$(document).on('click', '.update-order-button', function(){
    // get order id
    var id = $(this).attr('data-id');

    // read one record based on given order id
    $.getJSON("/api/order/read.php?id=" + id, function(data){

        // populate category field
        $.getJSON("/api/category/read.php", function(categories){
            if(categories.records.length > 0){
                $.each(categories.records, function(key, val) {
                    $("#categoryid").append("        <option " + (val.categoryid == data.categoryid ? "selected" : "") + " value=\"" + val.categoryid + "\">" + val.categoryname + "</option>\n");
                });
            }
        });

        // populate supplier field
        $.getJSON("/api/supplier/read.php", function(suppliers){
            if(suppliers.records.length > 0){
                $.each(suppliers.records, function(key, val) {
                    $("#supplierid").append("        <option " + (val.supplierid == data.supplierid ? "selected" : "") + " value=\"" + val.supplierid + "\">" + val.companyname + "</option>\n");
                });
            }
        });

        // build 'update order' html form
        var update_order_html=
            "<h2 class=\"float-left\">Edit Order</h2>" +

            "<div class=\"right-button-margin clearfix\">" +
            "  <button type=\"button\" class=\"btn btn-outline-secondary float-right read-orders-button\">List Orders</button>" +
            "</div>" +

            "<form id=\"update-order-form\" method=\"post\" class=\"needs-validation\" novalidade>" +

            // hidden 'order id' to identify which record to update
            "  <input value=\"" + data.orderid + "\" name=\"orderid\" type=\"hidden\"/>" +

            // name field
            "  <div class=\"form-group\">\n" +
            "    <label for=\"ordername\">Name</label>\n" +
            "    <input type=\"text\" value=\"" + data.ordername + "\" class=\"form-control\" id=\"ordername\" name=\"ordername\" placeholder=\"Order Name\">\n" +
            "  </div>\n" +

            // price field
            "  <div class=\"form-row\">\n" +
            "    <div class=\"form-group col-md-2\">\n" +
            "      <label for=\"unitprice\">Unit Price</label>\n" +
            "      <div class=\"input-group mb-2\">\n" +
            "        <div class=\"input-group-prepend\">\n" +
            "          <div class=\"input-group-text\">$</div>\n" +
            "        </div>\n" +
            "        <input type=\"number\" value=\"" + data.unitprice + "\" id=\"unitprice\"  name=\"unitprice\" min=\"0\" step=\"0.01\" data-number-to-fixed=\"2\" data-number-stepfactor=\"100\" class=\"form-control currency\"/>\n" +
            "      </div>" +
            "    </div>\n" +

            // supplier field
            "    <div class=\"form-group col-md-5\">\n" +
            "      <label for=\"supplierid\">Supplier</label>\n" +
            "      <select id=\"supplierid\" name=\"supplierid\" class=\"form-control\">\n" +
            "      </select>" +
            "    </div>\n" +

            // category field
            "    <div class=\"form-group col-md-5\">\n" +
            "      <label for=\"categoryid\">Category</label>\n" +
            "      <select id=\"categoryid\" name=\"categoryid\" class=\"form-control\">\n" +
            "      </select>" +
            "    </div>\n" +
            "  </div>\n" +

            "<div class=\"form-group\">\n" +
            "    <div class=\"form-check\">\n" +
            "      <input " + (data.discontinued == 0 ? "" : "checked") + " class=\"form-check-input\" type=\"checkbox\" id=\"discontinued\" name=\"discontinued\">\n" +
            "      <label class=\"form-check-label\" for=\"discontinued\">\n" +
            "        Discontinued\n" +
            "      </label>\n" +
            "    </div>\n" +
            "  </div>" +

            "  <button type='submit' class='btn btn-primary mr-2'>Submit</button>" +
            "  <button type='button' class='btn btn-outline-secondary read-orders-button'>Cancel</button>" +
            "</form>";

        // inject html to 'content' of index.html
        $("#content").html(update_order_html);
    })
        .fail(function() {
            showAlert("danger", "Order not found." );
        });
});

// will run if update order form is submitted
$(document).on('submit', '#update-order-form', function(){

    // get form data
    var form_data=JSON.stringify($(this).serializeObject());

    // submit form data to api
    $.ajax({
        url: "/api/order/update.php",
        type : "POST",
        contentType : 'application/json',
        data : form_data,
        success : function(result) {
            // order was updated, go back to orders list
            showOrders();
            showAlert("success", "Order was updated." );
        },
        error: function(xhr, resp, text) {
            // show error to console and inform user
            console.log(xhr, resp, text);
            showAlert("danger", "Order could not be updated." );
        }
    });
    return false;
});

// will run if delete button is clicked
$(document).on('click', '.delete-order-button', function(){

    // get order id
    var id = $(this).attr('data-id');

    // bootbox for confirm pop up
    bootbox.confirm({

        message: "<h4>Are you sure?</h4>",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn btn-outline-danger'
            },
            cancel: {
                label: 'No',
                className: 'btn btn-primary'
            }
        },
        callback: function (result) {
            if(result==true){

                // send delete request to api
                $.ajax({
                    url: "/api/order/delete.php",
                    type : "POST",
                    dataType : 'json',
                    data : JSON.stringify({ orderid: id }),
                    success : function(result) {

                        // re-load list of orders
                        showOrders();
                        showAlert("success", "Order was deleted." );
                    },
                    error: function(xhr, resp, text) {
                        console.log(xhr, resp, text);
                        showAlert("danger", "Order could not be deleted." );
                    }
                });
            }
        }
    });
});

// will run if search button is clicked
$(document).on('submit', '#search-order-form', function(){

    // get search keywords
    var keywords = $(this).find(":input[name='search']").val();

    // get data from the api based on search keywords
    $.getJSON("/api/order/search.php?s=" + keywords, function(data){
        readOrdersTemplate(data, keywords);
    })
        .fail(function() {
            showAlert("danger", "Search for '" + keywords + "' did not return any results." );
        });

    // prevent whole page reload
    return false;
});

// order list html
function readOrdersTemplate(data, keywords){

    var read_orders_html = "";

    // check if data has any record
    if(data.records.length > 0){

        read_orders_html =
            // heading and create order button
            "<h2 class='float-left'>Orders</h2>" +
            "<div class='right-button-margin clearfix'>" +
            "  <button type='button' class='btn btn-outline-secondary float-right create-order-button'>Create Order</button>" +
            // search orders form
            "  <form id='search-order-form' method='post' class='form-inline float-right mr-3'>" +
            "    <div class='input-group mb-3'>" +
            "      <input type='text' value=\"" + keywords + "\" class='form-control' name='search' placeholder='Search' required>" +
            "      <div class='input-group-append'>" +
            "        <button class='btn btn-outline-secondary' type='submit'><span class='oi oi-magnifying-glass'></span></button>" +
            "      </div>" +
            "    </div>" +
            "  </form>" +
            "</div>" +

            // start table
            "<table class='table table-hover'>" +
            "  <thead class='thead-light'>" +
            "    <tr>" +
            "      <th scope='col'>ID</th>" +
            "      <th scope='col'>Customer</th>" +
            "      <th scope='col'>Employee</th>" +
            "      <th scope='col'>Order Date</th>" +
            "      <th scope='col'>Required Date</th>" +
            "      <th scope='col'>Shipped Date</th>" +
            "      <th scope='col'>Shipper</th>" +
            "      <th scope='col' class='text-center'>Action</th>" +
            "    </tr>" +
            "  </thead>" +
            "  <tbody>";

        // loop through returned array of data
        $.each(data.records, function(key, val) {

            // creating new table row per record
            read_orders_html+=
                "<tr>" +
                "<th scope='row' class='align-middle'>" + val.orderid + "</th>" +
                "<td class='align-middle'>" + val.customer + "</td>" +
                "<td class='align-middle'>" + val.employee + "</td>" +
                "<td class='align-middle'>" + val.orderdate + "</td>" +
                "<td class='align-middle'>" + val.requireddate + "</td>" +
                "<td class='align-middle'>" + val.shippeddate + "</td>" +
                "<td class='align-middle'>" + val.shipper + "</td>" +
                // action buttons
                "<td class='text-center'>" +
                "<div class='btn-group' role='group' aria-label='Action buttons'>" +
                // view button
                "<button type='button' class='btn btn-outline-secondary btn-sm read-one-order-button' data-id='" + val.orderid + "'>Read</button>" +
                // edit button
                "<button type='button' class='btn btn-outline-secondary btn-sm update-order-button' data-id='" + val.orderid + "'>Edit</button>" +
                // delete button
                "<button type='button' class='btn btn-outline-secondary btn-sm delete-order-button' data-id='" + val.orderid + "'>Delete</button>" +
                "</div>" +
                "</td>" +
                "</tr>";
        });

        // end table
        read_orders_html+=
            "</tbody>" +
            "</table>";

        // pagination
        if(data.paging){
            read_orders_html+=
                "<nav aria-label=\"Page navigation example\">" +
                "  <ul class=\"pagination\">";

            // first page
            read_orders_html+="    <li class='page-item " + ((data.paging.first==="") ? "disabled" : "") + "'><a class=\"page-link\" href=\"#\" data-page=\"" + data.paging.first + "\">First</a></li>";

            // loop through pages
            $.each(data.paging.pages, function(key, val) {
                read_orders_html+="    <li class='page-item " + ((val.current_page==="yes") ? "active" : "") + "'><a class='page-link' data-page='" + val.url + "' href='#'>" + val.page + "</a></li>";
            });

            // last page
            read_orders_html+="    <li class='page-item " + ((data.paging.last==="") ? "disabled" : "") + "'><a class=\"page-link\" href=\"#\" data-page=\"" + data.paging.last + "\">Last</a></li>";

            read_orders_html+="  </ul>" +
                "</nav>";
        }

    } else {
        showAlert("info","There are no orders.");
    }

    // inject to 'content' of app
    $("#content").html(read_orders_html);
}

function readOrderProducts(){

    var products = new Array();

    $('.tbody-product-order-table > tr').each(function() {
        var product = new Object();
        product.productid = $(this).data('productid');
        product.unitprice = $(this).data('unitprice');
        product.qty = $(this).data('qty');
        product.discount = $(this).data('discount');
        products.push(product);
    });
    return products;
}

// function to show list of orders
function showOrders(json_url){

    // get list of orders from the API
    $.getJSON((json_url === undefined) ? "/api/order/read_paging.php" : json_url, function(data){
        readOrdersTemplate(data, "");
    });
}

//function to show shipping address fields
function showShippingAddress() {

    var differentAddress = document.getElementById("differentaddress");
    var shippingAddress = document.getElementById("shippingaddress");

    if ( differentAddress.checked == true && shippingAddress.style.display === "none") {
        shippingAddress.style.display = "block";
    } else {
        shippingAddress.style.display = "none";
    }
}