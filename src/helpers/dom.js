function init() {

    var hidder = document.querySelector('body' );
    var targets = document.querySelectorAll('[data-target]' );

    targets.forEach( function (item) {


        item.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var item_reference = item.tagName.toLowerCase() === 'a' ? item.getAttribute('href') : item.dataset.target;

            var contents = document.querySelectorAll( item_reference );
            contents.forEach(function (el) {
                //var displayType = el.dataset.displey || ( el.tagName.toLowerCase() === 'span' ? 'inline' : 'block' );

                if( el.dataset.hidden === 'true') {
                    el.dataset.hidden = 'false'
                }else {
                    el.dataset.hidden = 'true'
                }
            });
        });
    });

    hidder.addEventListener( 'click', function () {
        var dataHiddens = document.querySelectorAll('[data-hidden="false"]' );

        dataHiddens.forEach( function (item) {
            if( item.dataset.hidden !== 'true') {
                item.dataset.hidden = 'true';
            }
        });
    })

};


export { init };
