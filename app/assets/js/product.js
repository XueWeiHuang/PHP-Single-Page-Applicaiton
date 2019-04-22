const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

// show list of products when 'product' clicked
$(document).on('click', '#product', function(){

    // bind product events

    // pagination controls click event
    $(document).off('click', '.pagination li');
    $(document).on('click', '.pagination li', function(){
        // get json url
        var json_url=$(this).find('a').attr('data-page');

        // show list of products
        showProducts(json_url);
    });

    showProducts();
    return false;
});

// show list of products when 'list products' clicked
$(document).on('click', '.read-products-button', function(){
    showProducts();
    return false;
});

// show html form when 'create product' clicked
$(document).on('click', '.create-product-button', function(){

    // populate category field
    $.getJSON("/api/category/read.php", function(data){
        if(data.records.length > 0){
            $.each(data.records, function(key, val) {
                //create_product_html+= "        <option " + (val.mgrid == mgrid ? "selected" : "") + " value=\"" + val.mgrid + "\">\"" + val.manager + "\"</option>\n";
                $("#categoryid").append("        <option value=\"" + val.categoryid + "\">" + val.categoryname + "</option>\n");
            });
        }
    });

    // populate supplier field
    $.getJSON("/api/supplier/read.php", function(data){
        if(data.records.length > 0){
            $.each(data.records, function(key, val) {
                //create_product_html+= "        <option " + (val.mgrid == mgrid ? "selected" : "") + " value=\"" + val.mgrid + "\">\"" + val.manager + "\"</option>\n";
                $("#supplierid").append("        <option value=\"" + val.supplierid + "\">" + val.companyname + "</option>\n");
            });
        }
    });

    var create_product_html =
        "<h2 class=\"float-left\">Create Product</h2>" +

        "<div class=\"right-button-margin clearfix\">" +
        "  <button type=\"button\" class=\"btn btn-outline-secondary float-right read-products-button\">List Products</button>" +
        "</div>" +

        "<form id=\"create-product-form\" method=\"post\" class=\"needs-validation\" novalidate>\n" +

        // name field
        "  <div class=\"form-group\">\n" +
        "    <label for=\"productname\">Name</label>\n" +
        "    <input type=\"text\" class=\"form-control\" id=\"productname\" name=\"productname\" placeholder=\"Product Name\">\n" +
        "  </div>\n" +

        // price field
        "  <div class=\"form-row\">\n" +
        "    <div class=\"form-group col-md-2\">\n" +
        "      <label for=\"unitprice\">Unit Price</label>\n" +
        "      <div class=\"input-group mb-2\">\n" +
        "        <div class=\"input-group-prepend\">\n" +
        "          <div class=\"input-group-text\">$</div>\n" +
        "        </div>\n" +
        "        <input type=\"number\" id=\"unitprice\"  name=\"unitprice\" min=\"0\" step=\"1.00\" data-number-to-fixed=\"2\" data-number-stepfactor=\"100\" class=\"form-control currency\"/>\n" +
        "      </div>" +
        "    </div>\n" +

        // supplier field
        "    <div class=\"form-group col-md-5\">\n" +
        "      <label for=\"supplierid\">Supplier</label>\n" +
        "      <select id=\"supplierid\" name=\"supplierid\" class=\"form-control\">\n" +
        "        <option selected>Select supplier...</option>\n" +
        "      </select>" +
        "    </div>\n" +
        
        // category field
        "    <div class=\"form-group col-md-5\">\n" +
        "      <label for=\"categoryid\">Category</label>\n" +
        "      <select id=\"categoryid\" name=\"categoryid\" class=\"form-control\">\n" +
        "        <option selected>Select category...</option>\n" +
        "      </select>" +
        "    </div>\n" +
        "  </div>\n" +

        // submit and cancel buttons
        "  <button type=\"submit\" class=\"btn btn-primary mr-2\">Submit</button>\n" +
        "  <button type=\"button\" class=\"btn btn-outline-secondary read-products-button\">Cancel</button>\n" +

        "</form>";

    // inject html to 'content' of index.html
    $("#content").html(create_product_html);

});

// will run if create product form is submitted
$(document).on('submit', '#create-product-form', function(){

    // get form data
    var form_data=JSON.stringify($(this).serializeObject());

    // submit form data to api
    $.ajax({
        url: '/api/product/create.php',
        type : 'POST',
        contentType : 'application/json',
        data : form_data,
        success : function(result) {
            // product was created, go back to product list
            showProducts();
            showAlert("success", "Product was created." );
        },
        error: function(xhr, resp, text) {
            // show error to console and inform user
            console.log(xhr, resp, text);
            showAlert("danger", "Product could not be created." );
        }
    });
    return false;
});

// handle read one button click
$(document).on('click', '.read-one-product-button', function(){

    // get product id
    var id = $(this).attr('data-id');

    // read product record based on given ID
    $.getJSON("/api/product/read_one.php?id=" + id, function(data){

        // populate category field
        $.getJSON("/api/category/read_one.php?id=" + data.categoryid, function(cat){
            if(cat.categoryname.length > 0){
                $("#categoryid").val(cat.categoryname);
            }
        });

        // populate supplier field
        $.getJSON("/api/supplier/read_one.php?id=" + data.supplierid, function(sup){
            if(sup.companyname.length > 0){
                $("#supplierid").val(sup.companyname);
            }
        });
        console.log("disc: " + data.discontinued);
        var read_one_product_html =
            "<h2 class=\"float-left\">Product Details</h2>\n" +

            "<div class=\"right-button-margin clearfix\">\n" +
            "  <button type=\"button\" class=\"btn btn-outline-secondary float-right read-products-button\">List Products</button>\n" +
            "</div>\n" +

            "<form class=\"bg-light p-3\">\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"empid\" class=\"col-sm-2 col-form-label\">ID</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"productid\" value=\"" + data.productid + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"titleofcourtesy\" class=\"col-sm-2 col-form-label\">Product Name</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"productname\" value=\"" + data.productname + "\">\n" +
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

            "<button type=\"button\" class=\"btn btn-primary m-3 read-products-button\">Cancel</button>\n";

        // inject html to 'content' of index.html
        $("#content").html(read_one_product_html);
    })
        .fail(function() {
            showAlert("danger", "Product not found." );
        });
});

// show html form when edit product button was clicked
$(document).on('click', '.update-product-button', function(){
    // get product id
    var id = $(this).attr('data-id');

    // read one record based on given product id
    $.getJSON("/api/product/read_one.php?id=" + id, function(data){

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

        // build 'update product' html form
        var update_product_html=
            "<h2 class=\"float-left\">Edit Product</h2>" +

            "<div class=\"right-button-margin clearfix\">" +
            "  <button type=\"button\" class=\"btn btn-outline-secondary float-right read-products-button\">List Products</button>" +
            "</div>" +

            "<form id=\"update-product-form\" method=\"post\" class=\"needs-validation\" novalidade>" +

            // hidden 'product id' to identify which record to update
            "  <input value=\"" + data.productid + "\" name=\"productid\" type=\"hidden\"/>" +

            // name field
            "  <div class=\"form-group\">\n" +
            "    <label for=\"productname\">Name</label>\n" +
            "    <input type=\"text\" value=\"" + data.productname + "\" class=\"form-control\" id=\"productname\" name=\"productname\" placeholder=\"Product Name\">\n" +
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
            "  <button type='button' class='btn btn-outline-secondary read-products-button'>Cancel</button>" +
            "</form>";

        // inject html to 'content' of index.html
        $("#content").html(update_product_html);
    })
        .fail(function() {
            showAlert("danger", "Product not found." );
        });
});

// will run if update product form is submitted
$(document).on('submit', '#update-product-form', function(){

    // get form data
    var form_data=JSON.stringify($(this).serializeObject());

    // submit form data to api
    $.ajax({
        url: "/api/product/update.php",
        type : "POST",
        contentType : 'application/json',
        data : form_data,
        success : function(result) {
            // product was updated, go back to products list
            showProducts();
            showAlert("success", "Product was updated." );
        },
        error: function(xhr, resp, text) {
            // show error to console and inform user
            console.log(xhr, resp, text);
            showAlert("danger", "Product could not be updated." );
        }
    });
    return false;
});

// will run if delete button is clicked
$(document).on('click', '.delete-product-button', function(){

    // get product id
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
                    url: "/api/product/delete.php",
                    type : "POST",
                    dataType : 'json',
                    data : JSON.stringify({ productid: id }),
                    success : function(result) {

                        // re-load list of products
                        showProducts();
                        showAlert("success", "Product was deleted." );
                    },
                    error: function(xhr, resp, text) {
                        console.log(xhr, resp, text);
                        showAlert("danger", "Product could not be deleted." );
                    }
                });
            }
        }
    });
});

// will run if search button is clicked
$(document).on('submit', '#search-product-form', function(){

    // get search keywords
    var keywords = $(this).find(":input[name='search']").val();

    // get data from the api based on search keywords
    $.getJSON("/api/product/search.php?s=" + keywords, function(data){
        readProductsTemplate(data, keywords);
    })
        .fail(function() {
            showAlert("danger", "Search for '" + keywords + "' did not return any results." );
        });

    // prevent whole page reload
    return false;
});

// product list html
function readProductsTemplate(data, keywords){

    var read_products_html = "";

    // check if data has any record
    if(data.records.length > 0){

        read_products_html =
            // heading and create product button
            "<h2 class='float-left'>Products</h2>" +
            "<div class='right-button-margin clearfix'>" +
            "  <button type='button' class='btn btn-outline-secondary float-right create-product-button'>Create Product</button>" +
            // search products form
            "  <form id='search-product-form' method='post' class='form-inline float-right mr-3'>" +
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
            "      <th scope='col'>Name</th>" +
            "      <th scope='col'>Supplier</th>" +
            "      <th scope='col'>Category</th>" +
            "      <th scope='col'>Unit Price</th>" +
            "      <th scope='col'>Discontinued</th>" +
            "      <th scope='col' class='text-center'>Action</th>" +
            "    </tr>" +
            "  </thead>" +
            "  <tbody>";

        // loop through returned array of data
        $.each(data.records, function(key, val) {

            // creating new table row per record
            read_products_html+=
                "<tr>" +
                "<th scope='row' class='align-middle'>" + val.productid + "</th>" +
                "<td class='align-middle'>" + val.productname + "</td>" +
                "<td class='align-middle'>" + val.companyname + "</td>" +
                "<td class='align-middle'>" + val.categoryname + "</td>" +
                "<td class='align-middle'>" + formatter.format(val.unitprice) + "</td>" +
                "<td class='align-middle'>" + (val.discontinued == 0 ? "NO" : "YES") + "</td>" +

                // action buttons
                "<td class='text-center'>" +
                "<div class='btn-group' role='group' aria-label='Action buttons'>" +
                // view button
                "<button type='button' class='btn btn-outline-secondary btn-sm read-one-product-button' data-id='" + val.productid + "'>Read</button>" +
                // edit button
                "<button type='button' class='btn btn-outline-secondary btn-sm update-product-button' data-id='" + val.productid + "'>Edit</button>" +
                // delete button
                "<button type='button' class='btn btn-outline-secondary btn-sm delete-product-button' data-id='" + val.productid + "'>Delete</button>" +
                "</div>" +
                "</td>" +
                "</tr>";
        });

        // end table
        read_products_html+=
            "</tbody>" +
            "</table>";

        // pagination
        if(data.paging){
            read_products_html+=
                "<nav aria-label=\"Page navigation example\">" +
                "  <ul class=\"pagination\">";

            // first page
            read_products_html+="    <li class='page-item " + ((data.paging.first==="") ? "disabled" : "") + "'><a class=\"page-link\" href=\"#\" data-page=\"" + data.paging.first + "\">First</a></li>";

            // loop through pages
            $.each(data.paging.pages, function(key, val) {
                read_products_html+="    <li class='page-item " + ((val.current_page==="yes") ? "active" : "") + "'><a class='page-link' data-page='" + val.url + "' href='#'>" + val.page + "</a></li>";
            });

            // last page
            read_products_html+="    <li class='page-item " + ((data.paging.last==="") ? "disabled" : "") + "'><a class=\"page-link\" href=\"#\" data-page=\"" + data.paging.last + "\">Last</a></li>";

            read_products_html+="  </ul>" +
                "</nav>";
        }

    } else {
        showAlert("info","There are no products.");
    }

    // inject to 'content' of app
    $("#content").html(read_products_html);
}

// function to show list of products
function showProducts(json_url){

    // get list of products from the API
    $.getJSON((json_url === undefined) ? "/api/product/read_paging.php" : json_url, function(data){
        readProductsTemplate(data, "");
    });
}