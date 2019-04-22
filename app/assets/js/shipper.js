// show list of shippers when 'shipper' clicked
$(document).on('click', '#shipper', function(){

    // bind shipper events

    // pagination controls click event
    $(document).off('click', '.pagination li');
    $(document).on('click', '.pagination li', function(){
        // get json url
        var json_url=$(this).find('a').attr('data-page');

        // show list of shippers
        showShippers(json_url);
    });

    showShippers();
    return false;
});

// show list of shippers when 'list shippers' clicked
$(document).on('click', '.read-shippers-button', function(){
    showShippers();
    return false;
});

// show html form when 'create shipper' clicked
$(document).on('click', '.create-shipper-button', function(){

    var create_shipper_html =
        "<h2 class=\"float-left\">Create Shipper</h2>" +

        "<div class=\"right-button-margin clearfix\">" +
        "  <button type=\"button\" class=\"btn btn-outline-secondary float-right read-shippers-button\">List Shippers</button>" +
        "</div>" +

        "<form id=\"create-shipper-form\" method=\"post\" class=\"needs-validation\" novalidate>\n" +

        // company name field
        "  <div class=\"form-row\">\n" +
        "    <div class=\"form-group col-md-9\">\n" +
        "      <label for=\"contactname\">Contact Name</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"contactname\" name=\"contactname\" placeholder=\"Contact Name\">\n" +
        "    </div>\n" +

        // phone field
        "    <div class=\"form-group col-md-3\">\n" +
        "      <label for=\"phone\">Phone</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"phone\" name=\"phone\" placeholder=\"000-000-0000\">\n" +
        "    </div>\n" +
        "  </div>\n" +

        // submit and cancel buttons
        "  <button type=\"submit\" class=\"btn btn-primary mr-2\">Submit</button>\n" +
        "  <button type=\"button\" class=\"btn btn-outline-secondary read-shippers-button\">Cancel</button>\n" +

        "</form>";

    // inject html to 'content' of index.html
    $("#content").html(create_shipper_html);

});

// will run if create shipper form is submitted
$(document).on('submit', '#create-shipper-form', function(){

    // get form data
    var form_data=JSON.stringify($(this).serializeObject());

    // submit form data to api
    $.ajax({
        url: '/api/shipper/create.php',
        type : 'POST',
        contentType : 'application/json',
        data : form_data,
        success : function(result) {
            // shipper was created, go back to shipper list
            showShippers();
            showAlert("success", "Shipper was created." );
        },
        error: function(xhr, resp, text) {
            // show error to console and inform user
            console.log(xhr, resp, text);
            showAlert("danger", "Shipper could not be created." );
        }
    });
    return false;
});

// handle read one button click
$(document).on('click', '.read-one-shipper-button', function(){

    // get shipper id
    var id = $(this).attr('data-id');

    // read shipper record based on given ID
    $.getJSON("/api/shipper/read_one.php?id=" + id, function(data){

        var read_one_shipper_html =
            "<h2 class=\"float-left\">Shipper Details</h2>\n" +

            "<div class=\"right-button-margin clearfix\">\n" +
            "  <button type=\"button\" class=\"btn btn-outline-secondary float-right read-shippers-button\">List Shippers</button>\n" +
            "</div>\n" +

            "<form class=\"bg-light p-3\">\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"shipperid\" class=\"col-sm-2 col-form-label\">ID</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"shipperid\" value=\"" + data.shipperid + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"companyname\" class=\"col-sm-2 col-form-label\">Name</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"companyname\" value=\"" + data.companyname + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"phone\" class=\"col-sm-2 col-form-label\">Phone</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"phone\" value=\"" + data.phone + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "</form>\n" +

            "<button type=\"button\" class=\"btn btn-primary m-3 read-shippers-button\">Cancel</button>\n";

        // inject html to 'content' of index.html
        $("#content").html(read_one_shipper_html);
    })
        .fail(function() {
            showAlert("danger", "Shipper not found." );
        });
});

// show html form when edit shipper button was clicked
$(document).on('click', '.update-shipper-button', function(){
    // get shipper id
    var id = $(this).attr('data-id');

    // read one record based on given shipper id
    $.getJSON("/api/shipper/read_one.php?id=" + id, function(data){

        // build 'update shipper' html form
        var update_shipper_html=
            "<h2 class=\"float-left\">Edit Shipper</h2>" +

            "<div class=\"right-button-margin clearfix\">" +
            "  <button type=\"button\" class=\"btn btn-outline-secondary float-right read-shippers-button\">List Shippers</button>" +
            "</div>" +

            "<form id=\"update-shipper-form\" method=\"post\" class=\"needs-validation\" novalidade>" +

            // hidden 'shipper id' to identify which record to update
            "  <input value=\"" + data.shipperid + "\" name=\"shipperid\" type=\"hidden\"/>" +

            // company name field
            "  <div class=\"form-row\">\n" +
            "    <div class=\"form-group col-md-9\">\n" +
            "      <label for=\"companyname\">Company Name</label>\n" +
            "      <input type=\"text\" value=\"" + data.companyname + "\" class=\"form-control\" id=\"companyname\" name=\"companyname\" placeholder=\"Company Name\" required>\n" +
            "    </div>\n" +

            // phone field
            "    <div class=\"form-group col-md-3\">\n" +
            "      <label for=\"phone\">Phone</label>\n" +
            "      <input type=\"text\" value=\"" + data.phone + "\" class=\"form-control\" id=\"phone\" name=\"phone\" placeholder=\"000-000-0000\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <button type='submit' class='btn btn-primary mr-2'>Submit</button>" +
            "  <button type='button' class='btn btn-outline-secondary read-shippers-button'>Cancel</button>" +
            "</form>";

        // inject html to 'content' of index.html
        $("#content").html(update_shipper_html);
    })
        .fail(function() {
            showAlert("danger", "Shipper not found." );
        });
});

// will run if update shipper form is submitted
$(document).on('submit', '#update-shipper-form', function(){

    // get form data
    var form_data=JSON.stringify($(this).serializeObject());

    // submit form data to api
    $.ajax({
        url: "/api/shipper/update.php",
        type : "POST",
        contentType : 'application/json',
        data : form_data,
        success : function(result) {
            // shipper was updated, go back to shippers list
            showShippers();
            showAlert("success", "Shipper was updated." );
        },
        error: function(xhr, resp, text) {
            // show error to console and inform user
            console.log(xhr, resp, text);
            showAlert("danger", "Shipper could not be updated." );
        }
    });
    return false;
});

// will run if delete button is clicked
$(document).on('click', '.delete-shipper-button', function(){

    // get shipper id
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
                    url: "/api/shipper/delete.php",
                    type : "POST",
                    dataType : 'json',
                    data : JSON.stringify({ shipperid: id }),
                    success : function(result) {

                        // re-load list of shippers
                        showShippers();
                        showAlert("success", "Shipper was deleted." );
                    },
                    error: function(xhr, resp, text) {
                        console.log(xhr, resp, text);
                        showAlert("danger", "Shipper could not be deleted." );
                    }
                });
            }
        }
    });
});

// will run if search button is clicked
$(document).on('submit', '#search-shipper-form', function(){

    // get search keywords
    var keywords = $(this).find(":input[name='search']").val();

    // get data from the api based on search keywords
    $.getJSON("/api/shipper/search.php?s=" + keywords, function(data){
        readShippersTemplate(data, keywords);
    })
        .fail(function() {
            showAlert("danger", "Search for '" + keywords + "' did not return any results." );
        });

    // prevent whole page reload
    return false;
});

// shipper list html
function readShippersTemplate(data, keywords){

    var read_shippers_html = "";

    // check if data has any record
    if(data.records.length > 0){

        read_shippers_html =
            // heading and create shipper button
            "<h2 class='float-left'>Shippers</h2>" +
            "<div class='right-button-margin clearfix'>" +
            "<button type='button' class='btn btn-outline-secondary float-right create-shipper-button'>Create Shipper</button>" +

            // search shippers form
            "<form id='search-shipper-form' method='post' class='form-inline float-right mr-3'>" +
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
            "<th scope='col'>Phone</th>" +
            "<th scope='col' class='text-center'>Action</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody>";

        // loop through returned array of data
        $.each(data.records, function(key, val) {

            // creating new table row per record
            read_shippers_html+=
                "<tr>" +
                "<th scope='row' class='align-middle'>" + val.shipperid + "</th>" +
                "<td class='align-middle'>" + val.companyname + "</td>" +
                "<td class='align-middle'>" + val.phone + "</td>" +

                // action buttons
                "<td class='text-center'>" +
                "<div class='btn-group' role='group' aria-label='Action buttons'>" +
                // view button
                "<button type='button' class='btn btn-outline-secondary btn-sm read-one-shipper-button' data-id='" + val.shipperid + "'>Read</button>" +
                // edit button
                "<button type='button' class='btn btn-outline-secondary btn-sm update-shipper-button' data-id='" + val.shipperid + "'>Edit</button>" +
                // delete button
                "<button type='button' class='btn btn-outline-secondary btn-sm delete-shipper-button' data-id='" + val.shipperid + "'>Delete</button>" +
                "</div>" +
                "</td>" +
                "</tr>";
        });

        // end table
        read_shippers_html+=
            "</tbody>" +
            "</table>";

        // pagination
        if(data.paging){
            read_shippers_html+=
                "<nav aria-label=\"Page navigation example\">" +
                "  <ul class=\"pagination\">";

            // first page
            read_shippers_html+="    <li class='page-item " + ((data.paging.first==="") ? "disabled" : "") + "'><a class=\"page-link\" href=\"#\" data-page=\"" + data.paging.first + "\">First</a></li>";

            // loop through pages
            $.each(data.paging.pages, function(key, val) {
                read_shippers_html+="    <li class='page-item " + ((val.current_page==="yes") ? "active" : "") + "'><a class='page-link' data-page='" + val.url + "' href='#'>" + val.page + "</a></li>";
            });

            // last page
            read_shippers_html+="    <li class='page-item " + ((data.paging.last==="") ? "disabled" : "") + "'><a class=\"page-link\" href=\"#\" data-page=\"" + data.paging.last + "\">Last</a></li>";

            read_shippers_html+="  </ul>" +
                "</nav>";
        }

    } else {
        showAlert("info","There are no shippers.");
    }

    // inject to 'content' of app
    $("#content").html(read_shippers_html);
}

// function to show list of shippers
function showShippers(json_url){

    // get list of products from the API
    $.getJSON((json_url === undefined) ? "/api/shipper/read_paging.php" : json_url, function(data){
        readShippersTemplate(data, "");
    });
}