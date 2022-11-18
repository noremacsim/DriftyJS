

$('form').submit(function(event) {
    event.preventDefault(); // Prevent the form from submitting via the browser
    var form = $(this);
    $.ajax({
        type: form.attr('method'),
        url: form.attr('action'),
        data: form.serialize()
    }).done(function(data) {
        // Optionally alert the user of success here...
    }).fail(function(data) {
        // Optionally alert the user of an error here...
    });
});

$("form").submit(function(e) {

    e.preventDefault(); // avoid to execute the actual submit of the form.

    const form = $(this);
    const actionUrl = form.attr('action');
    const type = form.attr('method');

    let submitButton = $(this).find('#submitButton');

    submitButton.prop("disabled", true);
    const submitButtonContent = submitButton.html();
    submitButton.html('<span class="loader"></span>');

    $.ajax({
        type: type,
        url: actionUrl,
        data: form.serialize(), // serializes the form's elements.
        timeout: 5000
    })
    .done(function (data, textStatus, jqXHR) {
        if (form.attr('onSuccess')) {
            if (typeof window[form.attr('onSuccess')] === 'function'){
                window[form.attr('onSuccess')]();
            }
        } else {
            toast('success', data.message);
            if (window.location.pathname === '/user/login') {
                let url = new URL(window.location.href)
                let params = new URLSearchParams(url.search);
                let path = params.get('path') // 'chrome-instant'
                if (path) {
                    window.location.replace(path);
                } else {
                    window.location.replace('/');
                }
            } else {
                if (form.hasClass("reload")) {
                    window.location.reload();
                }
            }
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        toast('warning', jqXHR.responseJSON.message)
    })
    .always(function(jqXHR, textStatus, errorThrown) {
        submitButton.prop("disabled", false);
        submitButton.html(submitButtonContent);
    });

});

function toast(icon, title) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-right',
        iconColor: 'white',
        customClass: {
            popup: 'colored-toast'
        },
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
    })

    Toast.fire({
        icon: icon,
        title: title
    })
}