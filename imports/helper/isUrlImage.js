/**
 * Checks to see if URL is an image
 *
 * @param {String} url - url that is being tested
 * @param {Function} callback - function to call after checking
 * @param {Integer} timeoutT - how long it should wait for seconds
 */
export default function testIfImage(url, callback, timeoutT) {
    let timeout = timeoutT || 5000;
    let timer, img = new Image();
    img.onerror = img.onabort = function () {
        clearTimeout(timer);
    };
    img.onload = function () {
        clearTimeout(timer);
        callback();
    };
    timer = setTimeout(function () {
        // reset .src to invalid URL so it stops previous
        // loading, but doesn't trigger new load
        img.src = "//!!!!/test.jpg";
    }, timeout);
    img.src = url;
}