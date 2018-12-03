
function updateContract(id) {
        
        $.ajax({
            url: '/contract/'+ id,
            type: 'PUT',
            data: $('#update-contract').serialize(),
            success: function(result){
                window.location.replace("./");
                console.log("hello");
            }
        })
    }
