
function updateSport(id) {
        
        $.ajax({
            url: '/sport/'+ id,
            type: 'PUT',
            data: $('#update-sport').serialize(),
            success: function(result){
                window.location.replace("./");
                console.log("hello");
            }
        })
    }
