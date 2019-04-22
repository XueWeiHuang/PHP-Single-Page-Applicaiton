// show list of employees when 'employee' clicked
$(document).on('click', '#employee', function(){

    // bind employee events

    // pagination controls click event
    $(document).off('click', '.pagination li');
    $(document).on('click', '.pagination li', function(){
        // get json url
        var json_url=$(this).find('a').attr('data-page');

        // show list of employees
        showEmployees(json_url);
    });

    showEmployees();
    return false;
});

// show list of employees when 'list employees' clicked
$(document).on('click', '.read-employees-button', function(){
    showEmployees();
    return false;
});

// show html form when 'create employee' clicked
$(document).on('click', '.create-employee-button', function(){

    // populate manager field
    $.getJSON("/api/employee/read_manager.php", function(data){
        if(data.records.length > 0){
            $.each(data.records, function(key, val) {
                //create_employee_html+= "        <option " + (val.mgrid == mgrid ? "selected" : "") + " value=\"" + val.mgrid + "\">\"" + val.manager + "\"</option>\n";
                $("#mgrid").append("        <option value=\"" + val.mgrid + "\">" + val.manager + "</option>\n");
            });
        }
    });

    var create_employee_html =
        "<h2 class=\"float-left\">Create Employee</h2>" +

        "<div class=\"right-button-margin clearfix\">" +
        "  <button type=\"button\" class=\"btn btn-outline-secondary float-right read-employees-button\">List Employees</button>" +
        "</div>" +

        "<form id=\"create-employee-form\" method=\"post\" class=\"needs-validation\" novalidate>\n" +

        // title of courtesy field
        "  <div class=\"form-row\">\n" +
        "    <div class=\"form-group col-md-2\">\n" +
        "      <label for=\"titleofcourtesy\">Courtesy Title</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"titleofcourtesy\" name=\"titleofcourtesy\" placeholder=\"Mr.\">\n" +
        "    </div>\n" +

        // first name field
        "    <div class=\"form-group col-md-5\">\n" +
        "      <label for=\"firstname\">First Name</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"firstname\" name=\"firstname\" placeholder=\"First Name\">\n" +
        "    </div>\n" +

        // last name field
        "    <div class=\"form-group col-md-5\">\n" +
        "      <label for=\"lastname\">Last Name</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"lastname\" name=\"lastname\" placeholder=\"Last Name\">\n" +
        "    </div>\n" +
        "  </div>\n" +

        // title field
        "  <div class=\"form-row\">\n" +
        "    <div class=\"form-group col-md-6\">\n" +
        "      <label for=\"title\">Title</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"title\" name=\"title\" placeholder=\"Title\">\n" +
        "    </div>\n" +

        // manager field
        "    <div class=\"form-group col-md-6\">\n" +
        "      <label for=\"mgrid\">Manager</label>\n" +
        "      <select id=\"mgrid\" name=\"mgrid\" class=\"form-control\">\n" +
        "        <option selected>Select manager...</option>\n" +
        "      </select>" +
        "    </div>\n" +
        "  </div>\n" +

        // birth date field
        "  <div class=\"form-row\">\n" +
        "    <div class=\"form-group col-md-4\">\n" +
        "      <label for=\"birthdate\">Birth Date</label>\n" +
        "      <input type=\"date\" class=\"form-control\" id=\"birthdate\" name=\"birthdate\">\n" +
        "    </div>\n" +

        // hire date field
        "    <div class=\"form-group col-md-4\">\n" +
        "      <label for=\"hiredate\">Hire Date</label>\n" +
        "      <input type=\"date\" class=\"form-control\" id=\"hiredate\" name=\"hiredate\">\n" +
        "    </div>\n" +

        // phone field
        "    <div class=\"form-group col-md-4\">\n" +
        "      <label for=\"phone\">Phone</label>\n" +
        "      <input type=\"text\" class=\"form-control\" id=\"phone\" name=\"phone\" placeholder=\"000-000-0000\">\n" +
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

        // submit and cancel buttons
        "  <button type=\"submit\" class=\"btn btn-primary mr-2\">Submit</button>\n" +
        "  <button type=\"button\" class=\"btn btn-outline-secondary read-employees-button\">Cancel</button>\n" +

        "</form>";

    // inject html to 'content' of index.html
    $("#content").html(create_employee_html);

});

// will run if create employee form is submitted
$(document).on('submit', '#create-employee-form', function(){

    // get form data
    var form_data=JSON.stringify($(this).serializeObject());

    // submit form data to api
    $.ajax({
        url: '/api/employee/create.php',
        type : 'POST',
        contentType : 'application/json',
        data : form_data,
        success : function(result) {
            // employee was created, go back to employee list
            showEmployees();
            showAlert("success", "Employee was created." );
        },
        error: function(xhr, resp, text) {
            // show error to console and inform user
            console.log(xhr, resp, text);
            showAlert("danger", "Employee could not be created." );
        }
    });
    return false;
});

// handle read one button click
$(document).on('click', '.read-one-employee-button', function(){

    // get employee id
    var id = $(this).attr('data-id');

    // read employee record based on given ID
    $.getJSON("/api/employee/read_one.php?id=" + id, function(data){

        // populate manager field
        $.getJSON("/api/employee/read_manager.php", function(emp){
            if(emp.records.length > 0){
                $("#mgrid").val($.grep(emp.records, function(obj) { return obj.mgrid === data.mgrid; })[0].manager);
            }
        });

        var read_one_employee_html =
            "<h2 class=\"float-left\">Employee Details</h2>\n" +

            "<div class=\"right-button-margin clearfix\">\n" +
            "  <button type=\"button\" class=\"btn btn-outline-secondary float-right read-employees-button\">List Employees</button>\n" +
            "</div>\n" +

            "<form class=\"bg-light p-3\">\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"empid\" class=\"col-sm-2 col-form-label\">ID</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"empid\" value=\"" + data.empid + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"titleofcourtesy\" class=\"col-sm-2 col-form-label\">Courtesy Title</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"titleofcourtesy\" value=\"" + data.titleofcourtesy + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"firstname\" class=\"col-sm-2 col-form-label\">First Name</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"firstname\" value=\"" + data.firstname + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"lastname\" class=\"col-sm-2 col-form-label\">Last Name</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"lastname\" value=\"" + data.lastname + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"title\" class=\"col-sm-2 col-form-label\">Title</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"title\" value=\"" + data.title + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"birthdate\" class=\"col-sm-2 col-form-label\">Birth Date</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"birthdate\" value=\"" + data.birthdate + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "  <div class=\"form-group row\">\n" +
            "    <label for=\"hiredare\" class=\"col-sm-2 col-form-label\">Hire Date</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"hiredate\" value=\"" + data.hiredate + "\">\n" +
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
            "    <label for=\"mgrid\" class=\"col-sm-2 col-form-label\">Manager</label>\n" +
            "    <div class=\"col-sm-10\">\n" +
            "      <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"mgrid\" value=\"" + data.mgrid + "\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            "</form>\n" +

            "<button type=\"button\" class=\"btn btn-primary m-3 read-employees-button\">Cancel</button>\n";

        // inject html to 'content' of index.html
        $("#content").html(read_one_employee_html);
    })
        .fail(function() {
            showAlert("danger", "Employee not found." );
        });
});

// show html form when edit employee button was clicked
$(document).on('click', '.update-employee-button', function(){
    // get employee id
    var id = $(this).attr('data-id');

    // read one record based on given employee id
    $.getJSON("/api/employee/read_one.php?id=" + id, function(data){

        // populate manager field
        $.getJSON("/api/employee/read_manager.php", function(managers){
            if(managers.records.length > 0){
                $.each(managers.records, function(key, val) {
                    $("#mgrid").append("        <option " + (val.mgrid == data.mgrid ? "selected" : "") + " value=\"" + val.mgrid + "\">" + val.manager + "</option>\n");
                });
            }
        });

        // build 'update employee' html form
        var update_employee_html=
            "<h2 class=\"float-left\">Edit Employee</h2>" +

            "<div class=\"right-button-margin clearfix\">" +
            "  <button type=\"button\" class=\"btn btn-outline-secondary float-right read-employees-button\">List Employees</button>" +
            "</div>" +

            "<form id=\"update-employee-form\" method=\"post\" class=\"needs-validation\" novalidade>" +

            // hidden 'employee id' to identify which record to update
            "  <input value=\"" + data.empid + "\" name=\"empid\" type=\"hidden\"/>" +

            // title of courtesy field
            "  <div class=\"form-row\">\n" +
            "    <div class=\"form-group col-md-2\">\n" +
            "      <label for=\"titleofcourtesy\">Courtesy Title</label>\n" +
            "      <input type=\"text\" value=\"" + data.titleofcourtesy + "\" class=\"form-control\" id=\"titleofcourtesy\" name=\"titleofcourtesy\" placeholder=\"Mr.\">\n" +
            "    </div>\n" +

            // first name field
            "    <div class=\"form-group col-md-5\">\n" +
            "      <label for=\"firstname\">First Name</label>\n" +
            "      <input type=\"text\" value=\"" + data.firstname + "\" class=\"form-control\" id=\"firstname\" name=\"firstname\" placeholder=\"First Name\">\n" +
            "    </div>\n" +

            // last name field
            "    <div class=\"form-group col-md-5\">\n" +
            "      <label for=\"lastname\">Last Name</label>\n" +
            "      <input type=\"text\" value=\"" + data.lastname + "\" class=\"form-control\" id=\"lastname\" name=\"lastname\" placeholder=\"Last Name\">\n" +
            "    </div>\n" +
            "  </div>\n" +

            // title field
            "  <div class=\"form-row\">\n" +
            "    <div class=\"form-group col-md-6\">\n" +
            "      <label for=\"title\">Title</label>\n" +
            "      <input type=\"text\" value=\"" + data.title + "\" class=\"form-control\" id=\"title\" name=\"title\" placeholder=\"Title\" required>\n" +
            "    </div>\n" +

            // manager field
            "    <div class=\"form-group col-md-6\">\n" +
            "      <label for=\"mgrid\">Manager</label>\n" +
            "      <select id=\"mgrid\" name=\"mgrid\" class=\"form-control\">\n" +
            "        <option selected>Select manager...</option>\n" +
            "      </select>" +
            "    </div>\n" +
            "  </div>\n" +

            // birth date field
            "  <div class=\"form-row\">\n" +
            "    <div class=\"form-group col-md-4\">\n" +
            "      <label for=\"birthdate\">Birth Date</label>\n" +
            "      <input type=\"date\" value=\"" + data.birthdate.substring(0,10) + "\" class=\"form-control\" id=\"birthdate\" name=\"birthdate\">\n" +
            "    </div>\n" +

            // hire date field
            "    <div class=\"form-group col-md-4\">\n" +
            "      <label for=\"hiredate\">Hire Date</label>\n" +
            "      <input type=\"date\" value=\"" + data.hiredate.substring(0,10) + "\" class=\"form-control\" id=\"hiredate\" name=\"hiredate\">\n" +
            "    </div>\n" +

            // phone field
            "    <div class=\"form-group col-md-4\">\n" +
            "      <label for=\"phone\">Phone</label>\n" +
            "      <input type=\"text\" value=\"" + data.phone + "\" class=\"form-control\" id=\"phone\" name=\"phone\" placeholder=\"000-000-0000\">\n" +
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

            "  <button type='submit' class='btn btn-primary mr-2'>Submit</button>" +
            "  <button type='button' class='btn btn-outline-secondary read-employees-button'>Cancel</button>" +
            "</form>";

        // inject html to 'content' of index.html
        $("#content").html(update_employee_html);
    })
        .fail(function() {
            showAlert("danger", "Employee not found." );
        });
});

// will run if update employee form is submitted
$(document).on('submit', '#update-employee-form', function(){

    // get form data
    var form_data=JSON.stringify($(this).serializeObject());

    // submit form data to api
    $.ajax({
        url: "/api/employee/update.php",
        type : "POST",
        contentType : 'application/json',
        data : form_data,
        success : function(result) {
            // employee was updated, go back to employees list
            showEmployees();
            showAlert("success", "Employee was updated." );
        },
        error: function(xhr, resp, text) {
            // show error to console and inform user
            console.log(xhr, resp, text);
            showAlert("danger", "Employee could not be updated." );
        }
    });
    return false;
});

// will run if delete button is clicked
$(document).on('click', '.delete-employee-button', function(){

    // get employee id
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
                    url: "/api/employee/delete.php",
                    type : "POST",
                    dataType : 'json',
                    data : JSON.stringify({ empid: id }),
                    success : function(result) {

                        // re-load list of employees
                        showEmployees();
                        showAlert("success", "Employee was deleted." );
                    },
                    error: function(xhr, resp, text) {
                        console.log(xhr, resp, text);
                        showAlert("danger", "Employee could not be deleted." );
                    }
                });
            }
        }
    });
});

// will run if search button is clicked
$(document).on('submit', '#search-employee-form', function(){

    // get search keywords
    var keywords = $(this).find(":input[name='search']").val();

    // get data from the api based on search keywords
    $.getJSON("/api/employee/search.php?s=" + keywords, function(data){
        readEmployeesTemplate(data, keywords);
    })
        .fail(function() {
            showAlert("danger", "Search for '" + keywords + "' did not return any results." );
        });

    // prevent whole page reload
    return false;
});

// employee list html
function readEmployeesTemplate(data, keywords){

    var read_employees_html = "";

    // check if data has any record
    if(data.records.length > 0){

        read_employees_html =
            // heading and create employee button
            "<h2 class='float-left'>Employees</h2>" +
            "<div class='right-button-margin clearfix'>" +
            "  <button type='button' class='btn btn-outline-secondary float-right create-employee-button'>Create Employee</button>" +
            // search employees form
            "  <form id='search-employee-form' method='post' class='form-inline float-right mr-3'>" +
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
            "      <th scope='col'>Title</th>" +
            "      <th scope='col'>Phone</th>" +
            "      <th scope='col'>Manager</th>" +
            "      <th scope='col' class='text-center'>Action</th>" +
            "    </tr>" +
            "  </thead>" +
            "  <tbody>";

        // loop through returned array of data
        $.each(data.records, function(key, val) {

            // creating new table row per record
            read_employees_html+=
                "<tr>" +
                "<th scope='row' class='align-middle'>" + val.empid + "</th>" +
                "<td class='align-middle'>" + val.name + "</td>" +
                "<td class='align-middle'>" + val.title + "</td>" +
                "<td class='align-middle'>" + val.phone + "</td>" +
                "<td class='align-middle'>" + val.manager + "</td>" +

                // action buttons
                "<td class='text-center'>" +
                "<div class='btn-group' role='group' aria-label='Action buttons'>" +
                // view button
                "<button type='button' class='btn btn-outline-secondary btn-sm read-one-employee-button' data-id='" + val.empid + "'>Read</button>" +
                // edit button
                "<button type='button' class='btn btn-outline-secondary btn-sm update-employee-button' data-id='" + val.empid + "'>Edit</button>" +
                // delete button
                "<button type='button' class='btn btn-outline-secondary btn-sm delete-employee-button' data-id='" + val.empid + "'>Delete</button>" +
                "</div>" +
                "</td>" +
                "</tr>";
        });

        // end table
        read_employees_html+=
            "</tbody>" +
            "</table>";

        // pagination
        if(data.paging){
            read_employees_html+=
                "<nav aria-label=\"Page navigation example\">" +
                "  <ul class=\"pagination\">";

            // first page
            read_employees_html+="    <li class='page-item " + ((data.paging.first==="") ? "disabled" : "") + "'><a class=\"page-link\" href=\"#\" data-page=\"" + data.paging.first + "\">First</a></li>";

            // loop through pages
            $.each(data.paging.pages, function(key, val) {
                read_employees_html+="    <li class='page-item " + ((val.current_page==="yes") ? "active" : "") + "'><a class='page-link' data-page='" + val.url + "' href='#'>" + val.page + "</a></li>";
            });

            // last page
            read_employees_html+="    <li class='page-item " + ((data.paging.last==="") ? "disabled" : "") + "'><a class=\"page-link\" href=\"#\" data-page=\"" + data.paging.last + "\">Last</a></li>";

            read_employees_html+="  </ul>" +
                "</nav>";
        }

    } else {
        showAlert("info","There are no employees.");
    }

    // inject to 'content' of app
    $("#content").html(read_employees_html);
}

// function to show list of employees
function showEmployees(json_url){

    // get list of products from the API
    $.getJSON((json_url === undefined) ? "/api/employee/read_paging.php" : json_url, function(data){
        readEmployeesTemplate(data, "");
    });
}