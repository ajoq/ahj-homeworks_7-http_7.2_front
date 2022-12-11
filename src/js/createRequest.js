export default function createRequest(options = {}, form) {
    console.log(options);
    const xhr = new XMLHttpRequest;
    let url = new URL('http://localhost:7070/');
    let formData;

    for (let key in options.data) {
        url.searchParams.set(key, options.data[key]);
    };    

    if (options.methodRequest === 'POST') {
        formData = new FormData(form);
    }

    try {
        xhr.open(options.methodRequest, url);
        xhr.responseType = 'json';
        xhr.send(formData);
      }
      catch (e) {
        console.log(e);
      }   

    xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                console.log(xhr.response);
                options.callback(xhr.response);
            } catch (e) {
                console.error(e);
            }
        }        
    });
}