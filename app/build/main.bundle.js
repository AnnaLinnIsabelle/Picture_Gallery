'use strict';

// Your scripts goes here...
var cygniGallery = function () {

    window.handleFlickrPhotoSearch = handleFlickrPhotoSearch;
    window.handleFlickrSizes = handleFlickrSizes;
    var show_err_mess = false;

    function init() {
        document.addEventListener('DOMContentLoaded', function () {
            console.log('Taking off... 🚀');
            var flickr_url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&" + "api_key=27cfab5e654f8de0d4f0c85859984b5b&per_page=10&format=json" + "&jsoncallback=handleFlickrPhotoSearch&text=elephant&per_page=40";
            var script = document.createElement("script");
            script.async = true;
            script.src = flickr_url;
            document.body.appendChild(script);
        });
    }

    function handleFlickrPhotoSearch(rsp) {
        if (rsp.stat === 'fail') {
            // display error message to user
            var _load_mess_div = document.getElementById('loading-mess-div');
            var err_mess = document.createElement('p');
            err_mess.className = "error-message";
            err_mess.innerHTML = "I'm sorry, there was a problem searching for elephants from flickr: " + rsp.message;
            _load_mess_div.appendChild(err_mess);
        }
        var load_mess_div = document.getElementById('loading-mess-div');
        var load_mess = document.getElementById('loading-mess');
        load_mess_div.removeChild(load_mess);
        var photos = rsp.photos.photo;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = photos[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var photo = _step.value;

                var size_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes" + "&api_key=27cfab5e654f8de0d4f0c85859984b5b&photo_id=" + photo.id + "&format=json&jsoncallback=handleFlickrSizes";
                var script = document.createElement("script");
                script.async = true;
                script.src = size_url;
                document.body.appendChild(script);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

    function handleFlickrSizes(rsp) {
        if (rsp.stat === 'fail') {
            if (!show_err_mess) {
                // display error message to user
                var load_mess_div = document.getElementById('loading-mess-div');
                var err_mess = document.createElement('p');
                err_mess.className = "error-message";
                err_mess.innerHTML = "I'm sorry, there was a problem with retrieving photo sizes from flickr: " + rsp.message;
                load_mess_div.appendChild(err_mess);
                show_err_mess = true;
            }
        } else {
            var sizes = rsp.sizes.size;
            var photo_data = { thumb: '', orig: '' };
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = sizes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var res_size = _step2.value;

                    if (res_size.label == 'Thumbnail') {
                        photo_data.thumb = res_size.source;
                    }
                    if (res_size.label == 'Original') {
                        photo_data.orig = res_size.source;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            ;
            document.getElementById('gallery-div').appendChild(createFlickrThumb(photo_data));
        }
    }

    function createFlickrThumb(photoData) {
        var col = document.createElement('div');
        col.className = "col-m-3 col-2 square-m-3 square-2";

        var link = document.createElement('a');
        link.setAttribute('href', photoData.orig);
        link.setAttribute('target', '_blank');

        var image = document.createElement('img');
        image.className = "thumbnail";
        image.setAttribute('src', photoData.thumb);

        link.appendChild(image);
        col.appendChild(link);

        return col;
    }

    return {
        init: init
    };
}();

cygniGallery.init();
