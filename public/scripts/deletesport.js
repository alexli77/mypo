function deleteSport(id){
  
        $.ajax({
            url: '/sport/'+ id,
            type: 'DELETE',
            success: function(result){
                window.location.reload(true);
            }
        })
    }
