function deleteContract(id){
  
        $.ajax({
            url: '/contract/'+ id,
            type: 'DELETE',
            success: function(result){
                window.location.reload(true);
            }
        })
    }
