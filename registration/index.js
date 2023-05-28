(async () => 
{
    $('.registration_page_row_button').click(async () => 
    {
        try {
            axios.request({
                method: 'post',
                maxBodyLength: Infinity,
                url: window.server_url,
                headers: { 
                    'Content-Type': 'application/json'
                },
                data : JSON.stringify({
                    'type': 'registration',
                    'login': $('input[data="login"]').val(),
                    'password': $('input[data="password"]').val(),
                }),
            })
            .then((response) => 
            {
                if(
                    typeof response.data['status'] !== 'undefined' &&
                    response.data['status'] == "error"
                ) 
                {
                    alert(response.data['data']);
                    return;
                };

                setCookie('token', response.data['token']);
                location.href = '../';
            })
            .catch((error) => {
                console.log(error);
            });
        } catch(e) {
            console.log(e);
        };
    });
})()