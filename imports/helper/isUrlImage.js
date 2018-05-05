export default function testImage(url, callback, timeoutT) {
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