class Api {

    static getTokensFromLocalStorage() {
        return {access: localStorage.getItem('access'), refresh: localStorage.getItem("refresh")};
    }

    static setTokensToLocalStorage(token, refresh) {
        localStorage.setItem('access', token);
        if (refresh) {
            localStorage.setItem("refresh", refresh);
        }
    }

    static getCookie(name) {
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

    static apiLoginRequest(username, password) {
        return new Promise(function (resolve, reject) {
            fetch("/api/token/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"username": username, "password": password})
            }).then(
                response => {
                    if (response.status === 200) {
                        response.json().then(data => {
                            Api.setTokensToLocalStorage(data.access, data.refresh);
                            resolve({auth: "ok"});
                        });
                    } else {
                        reject({error: response});
                    }
                },
                error => {
                    console.log("Error \n", error);
                    reject({error: error});
                }
            )
        })
    }

    static apiLoginRequestRefreshToken(token) {
        return new Promise(function (resolve, reject) {
            fetch("/api/token/refresh/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"refresh": token})
            }).then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                        response.json().then(data => {
                            Api.setTokensToLocalStorage(data.access);
                            resolve({auth: true});
                        });
                    } else {
                        resolve({auth: false});
                    }
                }, (error) => {
                    console.log(error);
                    resolve({auth: false});
                }
            );
        });
    }

    static apiLogoutRequest() {
        let localTokens = Api.getTokensFromLocalStorage();
        fetch("/api/logout/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localTokens.access}`
            },
            body: JSON.stringify({"refresh": localTokens.refresh})
        }).then((response) => {
                console.log(response);
                if (response.status === 204) {
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                } else {
                    console.log(response)
                }
            }, (error) => {
                console.log(error);
            }
        );
    }

    static apiInitLocalToken() {
        let result = false;
        let localTokens = Api.getTokensFromLocalStorage();
        if (localTokens.access) {
            let base64Url = localTokens.access.split('.')[1];
            let base64 = base64Url.replace('-', '+').replace('_', '/');
            let tokenPayload = JSON.parse(window.atob(base64));
            if (tokenPayload.exp) {
                let date = new Date();
                let currentSeconds = date.getTime() / 1000 | 0;
                if (tokenPayload.exp > currentSeconds) {
                    console.log("All is ok user is logged in correct");
                    result = true;
                } else {
                    if (localTokens.refresh) {
                        this.apiLoginRequestRefreshToken(localTokens.refresh).then(data => {
                            result = data.auth;
                            console.log("refresh = ", result);
                        });
                    }
                }
            }
        }
        return result;
    }

    static apiRequest(url, method, item) {
        let localTokens = this.getTokensFromLocalStorage();
        let headers = {
            'Content-Type': 'application/json',
            'X-CSRFToken': this.getCookie('csrftoken'),
        };
        if (["DELETE", "POST", "PUT"].includes(method) && localTokens.access) {
            headers.Authorization = `Bearer ${localTokens.access}`
        }
        return fetch(url, {
            method: method,
            body: JSON.stringify(item),
            headers: headers
        });
    }

    static putRequest(url, item, that) {
        this.apiRequest(url, "PUT", item).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    that.props.handleToUpdate({}, "Edit", data);
                    that.handleSuccessShow();
                });
            } else if (response.status === 500) {
                that.formFieldsError({"error": response.statusText});
            } else {
                response.json().then(data => {
                    console.log("Logger :::> Error put data here");
                    that.formFieldsError(data);
                })
            }
        })
    }

    static postRequest(url, item, that) {
        this.apiRequest(url, "POST", item).then((response) => {
            if (response.status === 201) {
                response.json().then(data => {
                    that.props.handleToUpdate(data, "Add");
                    that.handleSuccessShow();
                });
            } else if (response.status === 500) {
                that.formFieldsError({"error": response.statusText});
            } else {
                response.json().then(data => {
                    console.log("Logger :::>  Error post data here");
                    that.formFieldsError(data);
                })
            }
        })
    }

    static deleteRequest(url, that, item) {
        this.apiRequest(url, "DELETE", item).then((response) => {
            console.log(response);
            response.json().then(data => {
                that.getRequestHandler(data);
            });
        })
    }

    static getRequest(url, that) {
        this.apiRequest(url, "GET").then((response) => {
            if (response.status === 200) {
                response.json().then(data => {
                    that.getRequestHandler(data);
                });
            } else {
                response.json().then(data => {
                    console.log("Logger :::>  Error get data here");
                    that.formFieldsError(data);
                })
            }
        })
    }
}

export default Api;