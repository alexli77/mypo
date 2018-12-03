
function updateBrand(id) {
      var confirmUpdate = confirm("Are you sure you want to update this brand?");
    if(confirmUpdate){  
        $.ajax({
            url: '/brand/'+ id,
            type: 'PUT',
            data: $('#update-brand').serialize(),
            success: function(result){
                window.location.replace("./");
                console.log("updated");
                }
        });
    }
};