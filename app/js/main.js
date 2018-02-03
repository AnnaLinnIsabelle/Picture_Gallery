// Your scripts goes here...
const cygniGallery = (function() {

    window.handleFlickrPhotoSearch = handleFlickrPhotoSearch;
    window.handleFlickrSizes = handleFlickrSizes;
    let show_err_mess = false;

    function init() {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Taking off... 🚀');
            let flickr_url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&" +
                "api_key=27cfab5e654f8de0d4f0c85859984b5b&per_page=10&format=json" +
                "&jsoncallback=handleFlickrPhotoSearch&text=elephant&per_page=40";
            let script = document.createElement( "script" );
            script.async = true;
            script.src = flickr_url;
            document.body.appendChild( script );
        });


    }

    function handleFlickrPhotoSearch(rsp) {
        if (rsp.stat === 'fail'){
                // display error message to user
                let load_mess_div = document.getElementById('loading-mess-div');
                let err_mess = document.createElement('p');
                err_mess.className ="error-message";
                err_mess.innerHTML = "I'm sorry, there was a problem searching for elephants from flickr: " + rsp.message;
                load_mess_div.appendChild(err_mess);
        }
        let load_mess_div = document.getElementById('loading-mess-div');
        let load_mess = document.getElementById('loading-mess');
        load_mess_div.removeChild(load_mess);
        let photos = rsp.photos.photo;
        for (let photo of photos) {
            let size_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes" +
                "&api_key=27cfab5e654f8de0d4f0c85859984b5b&photo_id="+photo.id+"&format=json&jsoncallback=handleFlickrSizes";
            let script = document.createElement( "script" );
            script.async = true;
            script.src = size_url;
            document.body.appendChild( script );
        }
    }

    function handleFlickrSizes(rsp) {
        if (rsp.stat === 'fail') {
            if (!show_err_mess) {
                // display error message to user
                let load_mess_div = document.getElementById('loading-mess-div');
                let err_mess = document.createElement('p');
                err_mess.className ="error-message";
                err_mess.innerHTML = "I'm sorry, there was a problem with retrieving photo sizes from flickr: " + rsp.message;
                load_mess_div.appendChild(err_mess);
                show_err_mess = true;
            }

        } else {
            let sizes = rsp.sizes.size;
            let photo_data = {thumb: '', orig: ''};
            for (let res_size of sizes) {
                if (res_size.label == 'Small') {
                    photo_data.thumb = res_size.source;
                }
                if (res_size.label == 'Original') {
                    photo_data.orig = res_size.source;
                }
            };
            document.getElementById('gallery-div').appendChild(createFlickrThumb(photo_data));
        }
    }



    function createFlickrThumb(photoData) {
        let col = document.createElement('div');
        col.className = "col-m-6 col-4 square-m-6 square-4";

        let link = document.createElement('a');
        link.setAttribute('href', photoData.orig);
        link.setAttribute('target', '_blank');

        let image = document.createElement('img');
        image.className = "thumbnail";
        image.setAttribute('src', photoData.thumb);

        link.appendChild(image);
        col.appendChild(link);

        return col;
    }


    return {
        init: init
    }

})();

cygniGallery.init();