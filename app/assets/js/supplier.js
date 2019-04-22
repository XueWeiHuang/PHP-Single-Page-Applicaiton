// show list of suppliers when 'supplier' clicked
$(document).on('click', '#supplier', function(){

    // bind supplier events

    // pagination controls click event
    $(document).off('click', '.pagination li');
    $(document).on('click', '.pagination li', function(){
        // get json url
        var json_url=$(this).find('a').attr('data-page');

        // show list of suppliers
        showSuppliers(json_url);
    });

    showSuppliers();
    return false;
});

// show list of suppliers when 'list suppliers' clicked
$(document).on('click', '.read-suppliers-button', function(){
    showSuppliers();
    return false;
});

// show html form when 'create supplier' clicked
$(document).on('click', '.create-supplier-button', function(){

    var create_supplier_html =
        "<h2 class=\"float-left\">Create Supplier</h2>" +

        "<div class=\"right-button-margin clearfix\">" +
        "  <button type=\"button\" class=\"btn btn-outline-secondary float-right read-suppliers-button\">List Suppliers</button>" +
        "</div>" +

        "<form id=\"create-supplier-form\" method=\"post\" class=\"needs-validation\" novalidate>\n" +

        // company name field
        "  <div class=\"form-group\">\n" +
        "    <label for=\"companyname\">Name</label>\n" +
        "    <input type=\"text\" class=\"form-control\" id=\"companyname\" name=\"companyname\" placeholder=\"Name\">\n" +
        "  </div>\n" +

        // contact name field
        "  <div class=\"form-row\">\n" +
        "    <div class=\"form-group col-md-6\">\n" +
        "      <label for=\"contactname\">Contact Name</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"contactname\" name=\"contactname\" placeholder=\"Contact Name\">\n" +
        "    </div>\n" +

        // contact title field
        "    <div class=\"form-group col-md-6\">\n" +
        "      <label for=\"contacttitle\">Contact Title</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"contacttitle\" name=\"contacttitle\" placeholder=\"Contact Title\">\n" +
        "    </div>\n" +
        "  </div>\n" +

        // address field
        "  <div class=\"form-group\">\n" +
        "    <label for=\"address\">Address</label>\n" +
        "    <input type=\"text\" class=\"form-control\" id=\"address\" name=\"address\" placeholder=\"1234 Main St\">\n" +
        "  </div>\n" +

        // city field
        "  <div class=\"form-row\">\n" +
        "    <div class=\"form-group col-md-4\">\n" +
        "      <label for=\"city\">City</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"city\" name=\"city\" placeholder=\"City\">\n" +
        "    </div>\n" +

        // region field
        "    <div class=\"form-group col-md-2\">\n" +
        "      <label for=\"region\">Region</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"region\" name=\"region\" placeholder=\"Region\">\n" +
        "    </div>\n" +

        // postal code field
        "    <div class=\"form-group col-md-2\">\n" +
        "      <label for=\"postalcode\">Postal Code</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"postalcode\" name=\"postalcode\" placeholder=\"XXX XXX\">\n" +
        "    </div>\n" +

        // country field
        "    <div class=\"form-group col-md-4\">\n" +
        "      <label for=\"country\">Country</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"country\" name=\"country\" placeholder=\"Country\">\n" +
        "    </div>\n" +
        "  </div>\n" +

        // phone field
        "  <div class=\"form-row\">\n" +
        "    <div class=\"form-group col-md-3\">\n" +
        "      <label for=\"phone\">Phone</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"phone\" name=\"phone\" placeholder=\"000-000-0000\">\n" +
        "    </div>\n" +

        // fax field
        "    <div class=\"form-group col-md-3\">\n" +
        "      <label for=\"fax\">Fax</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"fax\" name=\"fax\" placeholder=\"000-000-0000\">\n" +
        "    </div>\n" +
        "  </div>\n" +

        // submit and cancel buttons
        "  <button type=\"submit\" class=\"btn btn-primary mr-2\">Submit</button>\n" +
        "  <button type=\"button\" class=\"btn btn-outline-secondary read-suppliers-button\">Cancel</button>\n" +

        "</form>";

    // inject html to 'content' of index.html
    $("#content").html(create_supplier_html);

});

// will run if create supplier form is submitted
$(document).on('submit', '#create-supplier-form', function(){

    // get form data
    var form_data=JSON.stringify($(this).serializeObject());

    // submit form data to api
    $.ajax({
        url: '/api/supplier/create.php',
        type : 'POST',
        contentType : 'application/json',
        data : form_data,
        success : function(result) {
            // supplier was created, go back to supplier list
            showSuppliers();
            showAlert("success", "Supplier was created." );
        },
        error: function(xhr, resp, text) {
            // show error to console and inform user
            console.log(xhr, resp, text);
            showAlert("danger", "Supplier could not be created." );
        }
    });
    return false;
});

// handle read one button click
$(document).on('click', '.read-one-supplier-button', function(){

    // get supplier id
    var id = $(this).attr('data-id');

    // read supplier record based on given ID
    $.getJSON("/api/supplier/read_one.php?id=" + id, function(data){

        var read_one_supplier_html =
            "<h2 class=\"float-left\">Supplier Details</h2>\n" +

            "<div class=\"right-button-margin clearfix\">\n" +
            "  <button type=\"button\" class=\"btn btn-outline-secondary float-right read-suppliers-button\">List Suppliers</button>\n" +
            "</div>\n" +

            "<form class=\"bg-light p-3\">\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"supplierid\" class=\"col-sm-2 col-form-label\">ID</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"supplierid\" value=\"" + data.supplierid + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"companyname\" class=\"col-sm-2 col-form-label\">Name</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"companyname\" value=\"" + data.companyname + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"contactname\" class=\"col-sm-2 col-form-label\">Contact Name</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"contactname\" value=\"" + data.contactname + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"contacttitle\" class=\"col-sm-2 col-form-label\">Contact Title</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"contacttitle\" value=\"" + data.contacttitle + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"address\" class=\"col-sm-2 col-form-label\">Address</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"address\" value=\"" + data.address + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"city\" class=\"col-sm-2 col-form-label\">City</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"city\" value=\"" + data.city + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"region\" class=\"col-sm-2 col-form-label\">Region</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"region\" value=\"" + data.region + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"postalcode\" class=\"col-sm-2 col-form-label\">Postal Code</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"postalcode\" value=\"" + data.postalcode + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"country\" class=\"col-sm-2 col-form-label\">Country</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"country\" value=\"" + data.country + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"phone\" class=\"col-sm-2 col-form-label\">Phone</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"phone\" value=\"" + data.phone + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"fax\" class=\"col-sm-2 col-form-label\">Fax</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"fax\" value=\"" + data.fax + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "</form>\n" +

            "<button type=\"button\" class=\"btn btn-primary m-3 read-suppliers-button\">Cancel</button>\n";

        // inject html to 'content' of index.html
        $("#content").html(read_one_supplier_html);
    })
        .fail(function() {
            showAlert("danger", "Supplier not found." );
        });
});

// show html form when edit supplier button was clicked
$(document).on('click', '.update-supplier-button', function(){
    // get supplier id
    var id = $(this).attr('data-id');

    // read one record based on given supplier id
    $.getJSON("/api/supplier/read_one.php?id=" + id, function(data){

        // build 'update supplier' html form
        var update_supplier_html=
            "<h2 class=\"float-left\">Edit Supplier</h2>" +

            "<div class=\"right-button-margin clearfix\">" +
            "  <button type=\"button\" class=\"btn btn-outline-secondary float-right read-suppliers-button\">List Suppliers</button>" +
            "</div>" +

            "<form id=\"update-supplier-form\" method=\"post\" class=\"needs-validation\" novalidade>" +

            // hidden 'supplier id' to identify which record to update
            "  <input value=\"" + data.supplierid + "\" name=\"supplierid\" type=\"hidden\"/>" +

            // name field
            "  <div class=\"form-group\">" +
            "    <label for=\"companyname\">Name</label>" +
            "    <input type=\"text\" value=\"" + data.companyname + "\" class=\"form-control\" id=\"companyname\" name=\"companyname\" placeholder=\"Name\" required>" +
            "  </div>" +

            // contact name field
            "  <div class=\"form-row\">\n" +
            "    <div class=\"form-group col-md-6\">\n" +
            "      <label for=\"contactname\">Contact Name</label>\n" +
            "      <input type=\"text\" value=\"" + data.contactname + "\" class=\"form-control\" id=\"contactname\" name=\"contactname\" placeholder=\"Contact Name\" required>\n" +
            "    </div>\n" +

            // contact title field
            "    <div class=\"form-group col-md-6\">\n" +
            "      <label for=\"contacttitle\">Contact Title</label>\n" +
            "      <input type=\"text\" value=\"" + data.contacttitle + "\" class=\"form-control\" id=\"contacttitle\" name=\"contacttitle\" placeholder=\"Contact Title\" required>\n" +
            "    </div>\n" +
            "  </div>\n" +

            // address field
            "  <div class=\"form-group\">\n" +
            "    <label for=\"address\">Address</label>\n" +
            "    <input type=\"text\" value=\"" + data.address + "\" class=\"form-control\" id=\"address\" name=\"address\" placeholder=\"1234 Main St\">\n" +
            "  </div>\n" +

            // city field
            "  <div class=\"form-row\">\n" +
            "    <div class=\"form-group col-md-4\">\n" +
            "      <label for=\"city\">City</label>\n" +
            "      <input type=\"text\" value=\"" + data.city + "\" class=\"form-control\" id=\"city\" name=\"city\" placeholder=\"City\">\n" +
            "    </div>\n" +

            // region field
            "    <div class=\"form-group col-md-2\">\n" +
            "      <label for=\"region\">Region</label>\n" +
            "      <input type=\"text\" value=\"" + data.region + "\" class=\"form-control\" id=\"region\" name=\"region\" placeholder=\"Region\">\n" +
            "    </div>\n" +

            // postal code field
            "    <div class=\"form-group col-md-2\">\n" +
            "      <label for=\"postalcode\">Postal Code</label>\n" +
            "      <input type=\"text\" value=\"" + data.postalcode + "\" class=\"form-control\" id=\"postalcode\" name=\"postalcode\" placeholder=\"XXX XXX\">\n" +
            "    </div>\n" +

            // country field
            "    <div class=\"form-group col-md-4\">\n" +
            "      <label for=\"country\">Country</label>\n" +
            "      <input type=\"text\" value=\"" + data.country + "\" class=\"form-control\" id=\"country\" name=\"country\" placeholder=\"Country\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            // phone field
            "  <div class=\"form-row\">\n" +
            "    <div class=\"form-group col-md-3\">\n" +
            "      <label for=\"phone\">Phone</label>\n" +
            "      <input type=\"text\" value=\"" + data.phone + "\" class=\"form-control\" id=\"phone\" name=\"phone\" placeholder=\"000-000-0000\">\n" +
            "    </div>\n" +

            // fax field
            "    <div class=\"form-group col-md-3\">\n" +
            "      <label for=\"fax\">Fax</label>\n" +
            "      <input type=\"text\" value=\"" + data.fax + "\" class=\"form-control\" id=\"fax\" name=\"fax\" placeholder=\"000-000-0000\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <button type='submit' class='btn btn-primary mr-2'>Submit</button>" +
            "  <button type='button' class='btn btn-outline-secondary read-suppliers-button'>Cancel</button>" +
            "</form>";

        // inject html to 'content' of index.html
        $("#content").html(update_supplier_html);
    })
        .fail(function() {
            showAlert("danger", "Supplier not found." );
        });
});

// will run if update supplier form is submitted
$(document).on('submit', '#update-supplier-form', function(){

    // get form data
    var form_data=JSON.stringify($(this).serializeObject());

    // submit form data to api
    $.ajax({
        url: "/api/supplier/update.php",
        type : "POST",
        contentType : 'application/json',
        data : form_data,
        success : function(result) {
            // supplier was updated, go back to suppliers list
            showSuppliers();
            showAlert("success", "Supplier was updated." );
        },
        error: function(xhr, resp, text) {
            // show error to console and inform user
            console.log(xhr, resp, text);
            showAlert("danger", "Supplier could not be updated." );
        }
    });
    return false;
});

// will run if delete button is clicked
$(document).on('click', '.delete-supplier-button', function(){

    // get supplier id
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
                    url: "/api/supplier/delete.php",
                    type : "POST",
                    dataType : 'json',
                    data : JSON.stringify({ supplierid: id }),
                    success : function(result) {

                        // re-load list of suppliers
                        showSuppliers();
                        showAlert("success", "Supplier was deleted." );
                    },
                    error: function(xhr, resp, text) {
                        console.log(xhr, resp, text);
                        showAlert("danger", "Supplier could not be deleted." );
                    }
                });
            }
        }
    });
});

// will run if search button is clicked
$(document).on('submit', '#search-supplier-form', function(){

    // get search keywords
    var keywords = $(this).find(":input[name='search']").val();

    // get data from the api based on search keywords
    $.getJSON("/api/supplier/search.php?s=" + keywords, function(data){
        readSuppliersTemplate(data, keywords);
    })
        .fail(function() {
            showAlert("danger", "Search for '" + keywords + "' did not return any results." );
        });

    // prevent whole page reload
    return false;
});

// supplier list html
function readSuppliersTemplate(data, keywords){

    var read_suppliers_html = "";

    // check if data has any record
    if(data.records.length > 0){

        read_suppliers_html =
            // heading and create supplier button
            "<h2 class='float-left'>Suppliers</h2>" +
            "<div class='right-button-margin clearfix'>" +
            "<button type='button' class='btn btn-outline-secondary float-right create-supplier-button'>Create Supplier</button>" +

            // search suppliers form
            "<form id='search-supplier-form' method='post' class='form-inline float-right mr-3'>" +
            "<div class='input-group mb-3'>" +
            "<input type='text' value=\"" + keywords + "\" class='form-control' name='search' placeholder='Search' required>" +
            "<div class='input-group-append'>" +
            "<button class='btn btn-outline-secondary' type='submit'><span class='oi oi-magnifying-glass'></span></button>" +
            "</div>" +
            "</div>" +
            "</form>" +

            "</div>" +

            // start table
            "<table class='table table-hover'>" +
            "<thead class='thead-light'>" +
            "<tr>" +
            "<th scope='col'>ID</th>" +
            "<th scope='col'>Company Name</th>" +
            "<th scope='col'>Contact Name</th>" +
            "<th scope='col'>Contact Title</th>" +
            "<th scope='col'>Phone</th>" +
            "<th scope='col'>Fax</th>" +
            "<th scope='col' class='text-center'>Action</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody>";

        // loop through returned array of data
        $.each(data.records, function(key, val) {

            // creating new table row per record
            read_suppliers_html+=
                "<tr>" +
                "<th scope='row' class='align-middle'>" + val.supplierid + "</th>" +
                "<td class='align-middle'>" + val.companyname + "</td>" +
                "<td class='align-middle'>" + val.contactname + "</td>" +
                "<td class='align-middle'>" + val.contacttitle + "</td>" +
                "<td class='align-middle'>" + val.phone + "</td>" +
                "<td class='align-middle'>" + val.fax + "</td>" +

                // action buttons
                "<td class='text-center'>" +
                "<div class='btn-group' role='group' aria-label='Action buttons'>" +
                // view button
                "<button type='button' class='btn btn-outline-secondary btn-sm read-one-supplier-button' data-id='" + val.supplierid + "'>Read</button>" +
                // edit button
                "<button type='button' class='btn btn-outline-secondary btn-sm update-supplier-button' data-id='" + val.supplierid + "'>Edit</button>" +
                // delete button
                "<button type='button' class='btn btn-outline-secondary btn-sm delete-supplier-button' data-id='" + val.supplierid + "'>Delete</button>" +
                "</div>" +
                "</td>" +
                "</tr>";
        });

        // end table
        read_suppliers_html+=
            "</tbody>" +
            "</table>";

        // pagination
        if(data.paging){
            read_suppliers_html+=
                "<nav aria-label=\"Page navigation example\">" +
                "  <ul class=\"pagination\">";

            // first page
            read_suppliers_html+="    <li class='page-item " + ((data.paging.first==="") ? "disabled" : "") + "'><a class=\"page-link\" href=\"#\" data-page=\"" + data.paging.first + "\">First</a></li>";

            // loop through pages
            $.each(data.paging.pages, function(key, val) {
                read_suppliers_html+="    <li class='page-item " + ((val.current_page==="yes") ? "active" : "") + "'><a class='page-link' data-page='" + val.url + "' href='#'>" + val.page + "</a></li>";
            });

            // last page
            read_suppliers_html+="    <li class='page-item " + ((data.paging.last==="") ? "disabled" : "") + "'><a class=\"page-link\" href=\"#\" data-page=\"" + data.paging.last + "\">Last</a></li>";

            read_suppliers_html+="  </ul>" +
                "</nav>";
        }

    } else {
        showAlert("info","There are no suppliers.");
    }

    // inject to 'content' of app
    $("#content").html(read_suppliers_html);
}

// function to show list of suppliers
function showSuppliers(json_url){

    // get list of products from the API
    $.getJSON((json_url === undefined) ? "/api/supplier/read_paging.php" : json_url, function(data){
        readSuppliersTemplate(data, "");
    });
}