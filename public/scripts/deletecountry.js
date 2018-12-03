function deleteCountry(id){
  
        $.ajax({
            url: '/country/'+ id,
            type: 'DELETE',
            success: function(result){
                window.location.reload(true);
            }
        })
    }
