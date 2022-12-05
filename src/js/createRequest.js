const createRequest = (options = {}) => {

    const xhr = new XMLHttpRequest;
    // let url = options.url;
    let url = new URL('http://localhost:7070/');
    let formData;

    if (options.method === 'GET') {
        
    }

    // if (options.method === 'GET') {
    //     const currentUrl = window.location.href;
    //     url = new URL(currentUrl.slice(0, -1) + options.url);

    //     if (options.data) {
    //         for (let key in options.data) {
    //             url.searchParams.set(key, options.data[key]);
    //         };
    //     };
    // } else {
    //     formData = new FormData;

    //     if (options.data) {
    //         for (let key in options.data) {
    //             formData.append(key, options.data[key]);
    //         };
    //     };    
    // };    

    try {
        xhr.open(options.method, url);
        xhr.responseType = 'json';
        xhr.send(formData);
      }
      catch (e) {
        callback(e);
      }   

    xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                // const data = JSON.parse(xhr.responseText);
                console.log(data);
                options.callback(xhr.response);
            } catch (e) {
                console.error(e);
                options.callback(xhr.statustext);
            }
        }        
    });      

    // xhr.addEventListener('load', () => {
    //     if (xhr.status === 200) {
    //         options.callback(null, xhr.response);
    //     } else {
    //         options.callback(xhr.statustext, null);
    //     }
    // }); 
};