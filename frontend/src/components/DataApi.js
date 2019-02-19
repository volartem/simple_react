
class Api {

    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    apiRequest(url, method, item) {
        return fetch(url, {
            method: method,
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCookie('csrftoken')
            }
        });
    }

    putRequest(url, item, that) {
        this.apiRequest(url, "PUT", item).then(response => {
            if (response.status !== 200) {
                response.json().then(data => {
                    console.log("Logger :::> Error put data here");
                    that.formFieldsError(data);
                })
            } else {
                response.json().then(data => {
                    that.props.handleToUpdate(that.state.item, "Edit");
                })
            }
        })
    }

    postRequest(url, item, that) {
        this.apiRequest(url, "POST", item).then((response) => {
            if (response.status !== 201) {
                response.json().then(data => {
                    console.log("Logger :::>  Error post data here");
                    that.formFieldsError(data);
                })
            } else {
                response.json().then(data => {
                    that.props.handleToUpdate(data, "Add");
                });
            }
        })
    }
}

export default Api;