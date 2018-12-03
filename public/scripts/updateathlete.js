
function updateAthlete(id) {
        
        $.ajax({
            url: '/athlete/'+ id,
            type: 'PUT',
            data: $('#update-athlete').serialize(),
            success: function(result){
                window.location.replace("./");
                console.log("hello");
            }
        })
    }
