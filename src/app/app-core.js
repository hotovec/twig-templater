$(window).load(function () {
  init();
});

$('[ga-send-event]').each(function (index, el) {
  var element = $(el);
  element.on('click', function (e) {
    var eventData = element.attr('ga-send-event');
    var eventObject = eval('({' + eventData + '})');
    ga('send', 'event', eventObject);
  });
});


function init() {
}
