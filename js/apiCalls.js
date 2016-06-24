/**
 * Created by chowmean on 6/21/16.
 */
/**
 * this file contains a callAPI fucntion which uses callback to return the data where callApi is called.
 * @type {string}
 */


var baseUrl='http://54.191.251.207:8085/api/';
var staticUrl='http://54.191.251.207:8085/';



function logout()
{
    callApi('accounts/logout','post','',function(data, textStatus, jqXHR){
        window.localStorage.removeItem('tokenData');
        window.localStorage.removeItem('role');
        window.location.href='login.html';
    });
}

function showToast(data){
    var toast=document.getElementById('toasted');
    toast.innerHTML=data;
    $(".toasted").fadeIn(200);
    $(".toasted").delay(2000);
    $(".toasted").fadeOut(300);

}


function getQueryStringValue (key) {
    return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}


function callApi(url,method, data, callback)
{

    if(data=='')
    {
        data={"data":"empty"};
    }
    $.when($.ajax({
        url:baseUrl+url,
        headers: {
            'token': window.localStorage.getItem('tokenData'),
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
        headers: {
            'token': window.localStorage.getItem('tokenData'),
        },
        url: baseUrl + url,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        enctype:"multipart/form-data"
    })).then(
        function (data, textStatus, jqXHR) {
            callback(data,textStatus,jqXHR);
        });

}


function saveBlog(event)
{
    event.preventDefault()
    user_id=10;
    blog_data=document.getElementById('blogTextArea').value;
    blog_title=document.getElementById('title').value;
    category_id = 4;

    data={
        "user_id":user_id,
        "category_id":category_id,
        "blog_title":blog_title,
        "blog_body":blog_data
    }
        
    callApi('blogs/','post', data ,function (result,textStatusR,jqXHRR) {
        blogId=result.blog_id;
        if(textStatusR=='success'){

            showToast('Text Created. Uploading Image.');
            uploadImage("blogs/images?blog_id="+blogId , event , function(data,textStatus,jqXHR){
                if(textStatus=='success')
                {
                    console.log('blog created Successfully');
                    showToast('Blog created Successfully.');
                }
                else
                {
                    console.log('Error! Problem in uplaoding image');
                    showToast('Image upload failed');
                }
            });
        }
        else {
            console.log('Error! Blog not created');
        }
    });
}



function deleteUser(userId,operation,event)
{
    event.preventDefault();
    if(operation == 1)
    {
        callApi('accounts/deactivate/'+userId,'delete','',function (result) {
                console.log('done');
            window.location.href='users.html';
        });
    }
    else if(operation == 0)
    {
        callApi('accounts/activate/'+userId,'post','',function (result) {
            console.log('done');
            window.location.href='users.html';
        });
    }

}


function review(a)
{
    url = 'review.html?blogId=' + encodeURIComponent(a);
    document.location.href = url;
}