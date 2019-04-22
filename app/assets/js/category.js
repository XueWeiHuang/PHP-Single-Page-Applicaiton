// show list of categories when 'category' clicked
$(document).on('click', '#category', function(){

    // bind categories events

    // pagination controls click event
    $(document).off('click', '.pagination li');
    $(document).on('click', '.pagination li', function(){
        // get json url
        var json_url=$(this).find('a').attr('data-page');

        // show list of products
        showCategories(json_url);
    });

    showCategories();
    return false;
});

// show list of customers when 'list categories' clicked
$(document).on('click', '.read-categories-button', function(){
    showCategories();
    return false;
});

// show html form when 'create category' button was clicked
$(document).on('click', '.create-category-button', function(){

    var create_category_html="";

    create_category_html+="<h2 class='float-left'>Create Category</h2>"
    // 'list categories' button to show list of categories
    create_category_html+="<div class='right-button-margin clearfix'><button type='button' class='btn btn-outline-secondary float-right read-categories-button'>List Categories</button></div>"

    // 'create category' html form
    create_category_html+="<form id='create-category-form' method='post' class='needs-validation' novalidate>";

    // name field
    create_category_html+="<div class='form-group'>";
    create_category_html+="<label for='categoryname'>Name</label>"
    create_category_html+="<input type='text' class='form-control' id='categoryname' name='categoryname' placeholder='Category Name' required>";
    create_category_html+="</div>";

    // description field
    create_category_html+="<div class='form-group'>";
    create_category_html+="<label for='description'>Description</label>"
    create_category_html+="<textarea id='description' name='description' class='form-control' required></textarea>"
    create_category_html+="</div>";


    create_category_html+="<button type='submit' class='btn btn-primary mr-2'>Submit</button>";
    create_category_html+="<button type='button' class='btn btn-outline-secondary read-categories-button'>Cancel</button>";

    create_category_html+="</form>";

    // inject html to 'content' of our app
    $("#content").html(create_category_html);

});

// will run if create category form was submitted
$(document).on('submit', '#create-category-form', function(){
    // get form data
    var form_data=JSON.stringify($(this).serializeObject());

    // submit form data to api
    $.ajax({
        url: "/api/category/create.php",
        type : "POST",
        contentType : 'application/json',
        data : form_data,
        success : function(result) {
            // category was created, go back to categories list
            showCategories();
            showAlert("success", "Category was created." );
        },
        error: function(xhr, resp, text) {
            // show error to console and inform user
            console.log(xhr, resp, text);
            showAlert("danger", "Category could not be created." );
        }
    });
    return false;
});

// handle read one button click
$(document).on('click', '.read-one-category-button', function(){

    // get category id
    var id = $(this).attr('data-id');

    // read category record based on given ID
    $.getJSON("/api/category/read_one.php?id=" + id, function(data){
        
        var read_one_category_html =
            "<h2 class='float-left'>Category Details</h2>" +
            "<div class='right-button-margin clearfix'>" +
            "  <button type='button' class='btn btn-outline-secondary float-right read-categories-button'>List Categories</button>" +
            "</div>" +
            "<form class='bg-light p-3'>" +
            "  <div class='form-group row'>" +
            "    <label for='categoryid' class='col-sm-2 col-form-label'>ID</label>" +
            "    <div class='col-sm-10'>" +
            "      <input type='text' readonly class='form-control-plaintext' id='categoryid' value='" + data.categoryid + "'>" +
            "  </div>" +
            "  </div>" +
            "  <div class='form-group row'>" +
            "    <label for='categoryname' class='col-sm-2 col-form-label'>Name</label>" +
            "    <div class='col-sm-10'>" +
            "      <input type='text' readonly class='form-control-plaintext' id='categoryname' value='" + data.categoryname + "'>" +
            "    </div>" +
            "  </div>" +
            "  <div class='form-group row'>" +
            "    <label for='description' class='col-sm-2 col-form-label'>Description</label>" +
            "    <div class='col-sm-10'>" +
            "      <input type='text' readonly class='form-control-plaintext' id='description' value='" + data.description + "'>" +
            "    </div>" +
            "  </div>" +
            "</form>" +
            "<button type=\"button\" class=\"btn btn-primary m-3 read-categories-button\">Cancel</button>\n";

        // inject html to 'content' of our app
        $("#content").html(read_one_category_html);
    })
        .fail(function() {
            showAlert("danger", "Category not found." );
        });
});

// show html form when edit category button was clicked
$(document).on('click', '.update-category-button', function(){
    // get category id
    var id = $(this).attr('data-id');

    // read one record based on given category id
    $.getJSON("/api/category/read_one.php?id=" + id, function(data){

        // build 'update category' html form
        var update_category_html=
            "<h2 class='float-left'>Edit Category</h2>" +
            "<div class='right-button-margin clearfix'>" +
                "<button type='button' class='btn btn-outline-secondary float-right read-categories-button'>List Categories</button>" +
            "</div>" +
            "<form id='update-category-form' method='post' class='needs-validation'>" +
            // hidden 'category id' to identify which record to update
            "<input value=\"" + data.categoryid + "\" name='categoryid' type='hidden'/>" +
                // name field
                "<div class='form-group'>" +
                    "<label for='categoryname'>Name</label>" +
                    "<input type='text' value=\"" + data.categoryname + "\" class='form-control' id='categoryname' name='categoryname' required>" +
                "</div>" +
                // description field
                "<div class='form-group'>" +
                    "<label for='description'>Description</label>" +
                    "<textarea id='description' name='description' class='form-control' required>" + data.description + "</textarea>" +
                "</div>" +
                "<button type='submit' class='btn btn-primary mr-2'>Submit</button>" +
                "<button type='button' class='btn btn-outline-secondary read-categories-button'>Cancel</button>" +
            "</form>";

        // inject html to 'page-content' of our app
        $("#content").html(update_category_html);
    })
        .fail(function() {
            showAlert("danger", "Category not found." );
        });
});

// will run if update category form was submitted
$(document).on('submit', '#update-category-form', function(){

    // get form data
    var form_data=JSON.stringify($(this).serializeObject());

    // submit form data to api
    $.ajax({
        url: "/api/category/update.php",
        type : "POST",
        contentType : 'application/json',
        data : form_data,
        success : function(result) {
            // category was updated, go back to categories list
            showCategories();
            showAlert("success", "Category was updated." );
        },
        error: function(xhr, resp, text) {
            // show error to console and inform user
            console.log(xhr, resp, text);
            showAlert("danger", "Category could not be updated." );
        }
    });
    return false;
});

// will run if delete button was clicked
$(document).on('click', '.delete-category-button', function(){

    // get category id
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
                    url: "/api/category/delete.php",
                    type : "POST",
                    dataType : 'json',
                    data : JSON.stringify({ categoryid: id }),
                    success : function(result) {

                        // re-load list of categories
                        showCategories();
                        showAlert("success", "Category was deleted." );
                    },
                    error: function(xhr, resp, text) {
                        console.log(xhr, resp, text);
                        showAlert("danger", "Category could not be deleted." );
                    }
                });
            }
        }
    });
});

// when a 'search category' button was clicked
$(document).on('submit', '#search-category-form', function(){

    // get search keywords
    var keywords = $(this).find(":input[name='search']").val();

    // get data from the api based on search keywords
    $.getJSON("/api/category/search.php?s=" + keywords, function(data){
        readCategoriesTemplate(data, keywords);
    })
        .fail(function() {
            showAlert("danger", "Search for '" + keywords + "' did not return any results." );
        });

    // prevent whole page reload
    return false;
});

// category list html
function readCategoriesTemplate(data, keywords){

    var read_categories_html = "";

    // check if data has any record
    if(data.records.length > 0){

        read_categories_html =
            // heading and create category button
            "<h2 class='float-left'>Categories</h2>" +
            "<div class='right-button-margin clearfix'>" +
                "<button type='button' class='btn btn-outline-secondary float-right create-category-button'>Create Category</button>" +

                // search categories form
                "<form id='search-category-form' method='post' class='form-inline float-right mr-3'>" +
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
                        "<th scope='col'>Name</th>" +
                        "<th scope='col'>Description</th>" +
                        "<th scope='col' class='text-center'>Action</th>" +
                    "</tr>" +
                "</thead>" +
                "<tbody>";

        // loop through returned array of data
        $.each(data.records, function(key, val) {

            // creating new table row per record
            read_categories_html+=
                    "<tr>" +
                        "<th scope='row' class='align-middle'>" + val.categoryid + "</th>" +
                        "<td class='align-middle'>" + val.categoryname + "</td>" +
                        "<td class='align-middle'>" + val.description + "</td>" +

                        // action buttons
                        "<td class='text-center'>" +
                            "<div class='btn-group' role='group' aria-label='Action buttons'>" +
                                // view button
                                "<button type='button' class='btn btn-outline-secondary btn-sm read-one-category-button' data-id='" + val.categoryid + "'>Read</button>" +
                                // edit button
                                "<button type='button' class='btn btn-outline-secondary btn-sm update-category-button' data-id='" + val.categoryid + "'>Edit</button>" +
                                // delete button
                                "<button type='button' class='btn btn-outline-secondary btn-sm delete-category-button' data-id='" + val.categoryid + "'>Delete</button>" +
                            "</div>" +
                        "</td>" +
                    "</tr>";
        });

        // end table
        read_categories_html+=
                "</tbody>" +
            "</table>";

        // pagination
        if(data.paging){
            read_categories_html+=
                "<nav aria-label=\"Page navigation example\">" +
                "  <ul class=\"pagination\">";

            // first page
            read_categories_html+="    <li class='page-item " + ((data.paging.first==="") ? "disabled" : "") + "'><a class=\"page-link\" href=\"#\" data-page=\"" + data.paging.first + "\">First</a></li>";

            // loop through pages
            $.each(data.paging.pages, function(key, val) {
                read_categories_html+="    <li class='page-item " + ((val.current_page==="yes") ? "active" : "") + "'><a class='page-link' data-page='" + val.url + "' href='#'>" + val.page + "</a></li>";
            });

            // last page
            read_categories_html+="    <li class='page-item " + ((data.paging.last==="") ? "disabled" : "") + "'><a class=\"page-link\" href=\"#\" data-page=\"" + data.paging.last + "\">Last</a></li>";

            read_categories_html+="  </ul>" +
                "</nav>";
        }

    } else {
        showAlert("info","There are no categories.");
    }

    // inject to 'content' of app
    $("#content").html(read_categories_html);
}

// function to show list of categories
function showCategories(json_url){

    // get list of categories from the API
    $.getJSON((json_url === undefined) ? "/api/category/read_paging.php" : json_url, function(data){
       readCategoriesTemplate(data, "");
    });
}

function showAlert2(type, text){

    $("#response").html(
            "<div class='alert alert-" + type + " alert-dismissible fade show' role='alert'>" +
            text +
            "<button type='button' class='close' data-dismiss='alert' aria-label='Close'>" +
            "<span aria-hidden='true'>&times;</span>" +
            "</button>" +
            "</div>"
    );

    window.setTimeout(function() {
        $(".alert").fadeTo(500, 0).slideUp(500, function(){
            $(this).remove();
        });
    }, 4000);
}