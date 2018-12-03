function deleteBrand(id){

        $.ajax({
            url: '/brand/'+ id,
            type: 'DELETE',
            success: function(result){
                window.location.reload(true);
            }
        })

};