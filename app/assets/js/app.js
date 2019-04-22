$(document).ready(function(){

    // show sign up / registration form
    $(document).on('click', '#sign_up', function(){

        var html = `
            <h2>Sign Up</h2>
            <form id='sign_up_form'>
                <div class="form-group">
                    <label for="firstname">Firstname</label>
                    <input type="text" class="form-control" name="firstname" id="firstname" required />
                </div>
 
                <div class="form-group">
                    <label for="lastname">Lastname</label>
                    <input type="text" class="form-control" name="lastname" id="lastname" required />
                </div>
 
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" name="email" id="email" required />
                </div>
 
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" class="form-control" name="password" id="password" required />
                </div>
 
                <button type='submit' class='btn btn-primary'>Sign Up</button>
            </form>
            `;

        clearResponse();
        $('#content').html(html);
        return false;

    });

    // trigger when registration form is submitted
    $(document).on('submit', '#sign_up_form', function(){

        // get form data
        var sign_up_form=$(this);
        var form_data=JSON.stringify(sign_up_form.serializeObject());

        // submit form data to api
        $.ajax({
            url: "/api/user/create.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {
                // if response is a success, tell the user it was a successful sign up & empty the input boxes
                $('#response').html("<div class='alert alert-success'>Successful sign up. Please login.</div>");
                sign_up_form.find('input').val('');
            },
            error: function(xhr, resp, text){
                //console.log(xhr.responseText);
                // on error, tell the user sign up failed
                $('#response').html("<div class='alert alert-danger'>Unable to sign up. Please contact admin.</div>");
            }
        });

        return false;
    });

    // show login form
    $(document).on('click', '#login', function(){
        showLoginPage();
        return false;
    });

    // trigger when login form is submitted
    $(document).on('submit', '#login_form', function(){

        // get form data
        var login_form=$(this);
        var form_data=JSON.stringify(login_form.serializeObject());

        // submit form data to api
        $.ajax({
            url: "/api/user/login.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result){

                // store jwt to local storage
                localStorage.setItem("jwt", result.jwt);

                // show home page & tell the user it was a successful login
                showHomePage();
                showAlert("success", "Successful login.");

                $.ajaxSetup({
                    headers:{
                        'Authorization': localStorage.getItem('jwt')
                    }
                });
            },
            error: function(xhr, resp, text){
                // on error, tell the user login has failed & empty the input boxes
                showAlert("danger", "Login failed. Email or password is incorrect.");
                login_form.find('input').val('');
            }
        });

        return false;
    });

    // show home page
    $(document).on('click', '#home', function(){
        showHomePage();
        clearResponse();
    });

    // show update account form
    $(document).on('click', '#update_account', function(){
        showUpdateAccountForm();
        return false;
    });

    // trigger when 'update account' form is submitted
    $(document).on('submit', '#update_account_form', function(){

        // handle for update_account_form
        var update_account_form=$(this);

        // validate jwt to verify access
        var jwt = localStorage.getItem('jwt');

        // get form data
        var update_account_form_obj = update_account_form.serializeObject()

        // add jwt on the object
        update_account_form_obj.jwt = jwt;

        // convert object to json string
        var form_data=JSON.stringify(update_account_form_obj);

        // submit form data to api
        $.ajax({
            url: "/api/user/update.php",
            type : "POST",
            contentType : 'application/json',
            data : form_data,
            success : function(result) {

                // tell the user account was updated
                showAlert("success", "Account was updated.");

                // store new jwt to local storage
                localStorage.setItem("jwt", result.jwt);
            },
            // show error message to user
            error: function(xhr, resp, text){
                if(xhr.responseJSON.message=="Unable to update user."){
                    showAlert("danger", "Unable to update account.");
                }
                else if(xhr.responseJSON.message=="Access denied."){
                    showLoginPage();
                    $('#response').html("<div class='alert alert-success'>Access denied. Please login</div>");
                }
            }
        });

        return false;
    });

    // logout the user
    $(document).on('click', '#logout', function(){
        showLoginPage();
        showAlert("info", "You are logged out.")
        return false;
    });

    // remove any prompt messages
    function clearResponse(){
        $('#response').html('');
    }

    // show login page
    function showLoginPage(){

        // remove jwt
        localStorage.clear();

        // login page html
        var html = `
        <h2>Login</h2>
        <form id='login_form'>
            <div class='form-group '>
                <label for='email'>Email address</label>
                <input type='email' class='form-control' id='email' name='email' placeholder='Enter email'>
            </div>
 
            <div class='form-group'>
                <label for='password'>Password</label>
                <input type='password' class='form-control' id='password' name='password' placeholder='Password'>
            </div>
 
            <button type='submit' class='btn btn-primary'>Login</button>
        </form>
        `;

        $('#content').html(html);
        clearResponse();
        showLoggedOutMenu();
    }

    // if the user is logged out
    function showLoggedOutMenu(){
        // show login and sign up from navbar & hide logout button
        $(".logged-out").show();
        $(".logged-in").hide();
    }

    // show home page
    function showHomePage(){

        // validate jwt to verify access
        var jwt = localStorage.getItem('jwt');
        $.post("/api/user/validate_token.php", JSON.stringify({ jwt:jwt })).done(function(result) {

            // if valid, show homepage
            var html = `
                <div class="card">
                    <div class="card-header">Welcome to Home!</div>
                    <div class="card-body">
                        <h5 class="card-title">You are logged in.</h5>
                        <p class="card-text">You won't be able to access the home and account pages if you are not logged in.</p>
                    </div>
                </div>
                `;
            $('#content').html(html);
            showLoggedInMenu();
        })

        // show login page on error
            .fail(function(result){
                showLoginPage();
                $('#response').html("<div class='alert alert-danger'>Please login to access the home page.</div>");
            });
    }

    // if the user is logged in
    function showLoggedInMenu(){
        // hide login and sign up from navbar & show logout button
        $(".logged-out").hide();
        $(".logged-in").show();
    }

    // show update account form
    function showUpdateAccountForm(){
        // validate jwt to verify access
        var jwt = localStorage.getItem('jwt');
        $.post("/api/user/validate_token.php", JSON.stringify({ jwt:jwt })).done(function(result) {

            // if response is valid, put user details in the form
            var html = `
                <h2>Update Account</h2>
                <form id='update_account_form'>
                    <div class="form-group">
                        <label for="firstname">Firstname</label>
                        <input type="text" class="form-control" name="firstname" id="firstname" required value="` + result.data.firstname + `" />
                    </div>
         
                    <div class="form-group">
                        <label for="lastname">Lastname</label>
                        <input type="text" class="form-control" name="lastname" id="lastname" required value="` + result.data.lastname + `" />
                    </div>
         
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" name="email" id="email" required value="` + result.data.email + `" />
                    </div>
         
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" name="password" id="password" />
                    </div>
         
                    <button type='submit' class='btn btn-primary'>
                        Submit
                    </button>
                    <button type='button' class='btn btn-outline-secondary'>
                        Cancel
                    </button>
                </form>
            `;

            clearResponse();
            $('#content').html(html);
        })

        // on error/fail, tell the user he needs to login to show the account page
            .fail(function(result){
                showLoginPage();
                $('#response').html("<div class='alert alert-danger'>Please login to access the account page.</div>");
            });
    }

    function isLoggedIn(){
        // validate jwt to verify access
        var jwt = localStorage.getItem('jwt');
        $.post("/api/user/validate_token.php", JSON.stringify({ jwt:jwt })).done(function(result) {
            $.ajaxSetup({
                headers:{
                    'Authorization': localStorage.getItem('jwt')
                }
            });
            showHomePage();
            // if response is valid
        })
        // on error/fail
            .fail(function(result){
                showLoginPage();
                //$('#response').html("<div class='alert alert-danger'>Please login to access the account page.</div>");
            });
    }

    // function to make form values to json format
    $.fn.serializeObject = function(){

        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    // function to make form values to json format
    $.fn.serializeObject2 = function(){

        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        o['details'] = readOrderProducts();

        //$('.tbody-product-order-table > tr').each(function() {
        //    var product = new Object();
        //    product.productid = $(this).data('productid');
        //    product.qty = $(this).data('qty');
        //    product.discount = $(this).data('discount');
        //    products.push(product);
        //});
        return o;
    };

    isLoggedIn();
});

function showAlert(type, text){

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