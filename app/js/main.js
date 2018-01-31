// Your scripts goes here...
const cygniGallery = (function() {

    let flickr_url;
    window.cb = cb;
    window.cb2 = cb2;

    function init() {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Taking off... 🚀');
            flickr_url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&" +
                "api_key=27cfab5e654f8de0d4f0c85859984b5b&per_page=10&format=json&jsoncallback=cb&text=elephant&per_page=40";
            console.log(flickr_url);
            let script = document.createElement( "script" );
            script.async = true;
            script.src = flickr_url;
            document.body.appendChild( script );
        });


    }
    function cb(rsp) {
        if (rsp.stat === 'fail'){
            //handle err
            console.log('fail');
        }
        console.log('hej',rsp);
        document.getElementById('mess').innerHTML="Klart!";
        let photos = rsp.photos.photo;
        for (let photo of photos) {
            let size_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes" +
                "&api_key=27cfab5e654f8de0d4f0c85859984b5b&photo_id="+photo.id+"&format=json&jsoncallback=cb2";
            let script = document.createElement( "script" );
            script.async = true;
            script.src = size_url;
            document.body.appendChild( script );
        }
    }

    function cb2(rsp) {
        if (rsp.stat === 'fail'){
            // handle err
            console.log('fail');
        } else {
            let sizes = rsp.sizes.size;
            let photo_data = {thumb: '', orig: ''};
            sizes.forEach(function (res_size) {
                if (res_size.label == 'Thumbnail') {
                    photo_data.thumb = res_size.source;
                }
                if (res_size.label == 'Original') {
                    photo_data.orig = res_size.source;
                }
            });
            document.getElementById('gallery-div').appendChild(createFlickrThumb(photo_data));
        }
    }



    function createFlickrThumb(photoData) {
        let link = document.createElement('a');
        link.setAttribute('href', photoData.orig);
        link.setAttribute('target', '_blank');

        let image = document.createElement('img');
        image.setAttribute('src', photoData.thumb);
        //image.setAttribute('alt', photoData.title);

        link.appendChild(image);

        return link;
    }


    return {
        init: init
    }

})();

cygniGallery.init();