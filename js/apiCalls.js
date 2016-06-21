/**
 * Created by chowmean on 6/21/16.
 */
/**
 * this file contains a callAPI fucntion which uses callback to return the data where callApi is called.
 * @type {string}
 */


var baseUrl='http://192.168.9.70:8085/api/';


$( "#submitBlog" ).click(function() {
 //   uploadImage(event);
});



function callApi(url,method, data,callback)
{
    $.when($.ajax({
        url:baseUrl+url,
        headers: {
            //'token': window.localStorage.getItem('token'),
            'Content-Type':'application/json'
        },
        method: method,
        dataType: 'json',
        data: JSON.stringify(data),

    })).then(
        function( data, textStatus, jqXHR ) {
          callback(data,textStatus,jqXHR);
        });

}





function uploadImage(url,event,callback) {
    event.preventDefault();
    var formData = new FormData();
    formData.append('blogImage', $('input[type=file]')[0].files[0]);
    $.when($.ajax({
        type: 'POST',
        url: baseUrl + url,
        data: formData,
        cache: false,
        contentType: false,
        processData: false
    })).then(
        function (data, textStatus, jqXHR) {
            callback(data,textStatus,jqXHR);
        });

}


function saveBlog(event)
{
    user_id=1;
    blog_data=document.getElementById('blogTextArea').value;
    blog_title=document.getElementById('title').value;
    category_id = 2;

    data={
        "user_id":user_id,
        "category_id":category_id,
        "blog_title":blog_title,
        "blog_body":blog_data
    }
        
    callApi('blogs/','post', data ,function (result,textStatusR,jqXHRR) {
        blogId=result.blog_id;
        if(textStatusR=='success'){
            uploadImage("blogs/images?blog_id="+blogId , event , function(data,textStatus,jqXHR){
                if(textStatus=='success')
                {
                    console.log('blog created Successfully');
                }
                else
                {
                    console.log('Error! Problem in uplaoding image');
                }
            });
        }
        else {
            console.log('Error! Blog not created');
        }
    });
}
