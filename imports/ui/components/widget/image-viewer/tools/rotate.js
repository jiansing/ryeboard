export default function(image, fun){
    if(!image) return '';

    let canvas = document.createElement('canvas');

    let ctx = canvas.getContext('2d');

    let height = image.naturalHeight,
        width = image.naturalWidth;

    //Modify canvas to fit new images
    canvas.height = height;
    canvas.width = width;

    //Draw images into canvas
    ctx.translate(width/2, width/2);
    ctx.rotate(90*Math.PI/180);
    ctx.translate(-width/2, -width/2);
    ctx.drawImage(image, 0, 0, height, width);

    //Callback!
    if(fun){
        console.log('finished rotating');
        let dataURL = canvas.toDataURL("image/png", 1);
        let blobData = dataURItoBlob(dataURL);
        let nameParts = image.src.split(/[\s/]+/),
            name = nameParts[nameParts.length-1];

        let dateParts = name.split(/[\s-]+/),
            date = dateParts[0];

        blobData.name = decodeURI(name.replace(date, '').replace('-', ''));
        blobData.lastModifiedDate = new Date();
        fun(dataURL, blobData);
    }
}

function dataURItoBlob(dataURI) {
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for(let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}