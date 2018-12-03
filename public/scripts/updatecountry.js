
function updateCountry(id) {
        
        $.ajax({
            url: '/country/'+ id,
            type: 'PUT',
            data: $('#update-country').serialize(),
            success: function(result){
                window.location.replace("./");
                console.log("hello");
            }
        })
    }
