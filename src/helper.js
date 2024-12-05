import swal from 'sweetalert2';

export const successResponse = async (data) => {
    return await new swal({
        title: 'Success!',
        text: data,
        icon: 'success',
        confirmButtonColor: 'cornflowerblue'
    })
}

export const validator = (data) => {
    var ret = {
        status: false,
        message: ''
    };

    const keys = Object.keys(data);
    for(var i=0;i<keys.length;i++){
        const val = data[keys[i]];
        if(val === ''){
            ret.message = keys[i][0].toUpperCase() + keys[i].slice(1) + ' cannot be empty!';
            return ret;
        }
    }
    ret.status = true;
    return ret;
}