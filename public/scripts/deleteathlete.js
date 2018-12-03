function deleteAthlete(id){
  
        $.ajax({
            url: '/athlete/'+ id,
            type: 'DELETE',
            success: function(result){
                window.location.reload(true);
            }
        })
    }
