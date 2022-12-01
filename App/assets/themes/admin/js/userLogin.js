$("form").submit(function(e) {

    e.preventDefault();

    const form = $(this);
    const actionUrl = form.attr('action');
    const type = form.attr('method');

    let submitButton = $(this).find('#submitButton');

    submitButton.prop("disabled", true);

    $.ajax({
        type: type,
        url: actionUrl,
        data: form.serialize(), // serializes the form's elements.
        timeout: 5000
    })
        .done(async function (data, textStatus, jqXHR) {
            if (form.attr('onSuccess')) {
                if (typeof window[form.attr('onSuccess')] === 'function') {
                    window[form.attr('onSuccess')]();
                }
            } else {
                 await toast('success', data.message);
                if (window.location.pathname === '/admin/user/login') {
                    let url = new URL(window.location.href)
                    let params = new URLSearchParams(url.search);
                    let path = params.get('path')
                    if (path) {
                        window.location.replace(path);
                    } else {
                        window.location.replace('/admin/dashboard');
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
        });

});