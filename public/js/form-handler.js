$(document).ready(function() {
    console.log("run ");

    window.showForm = function() {
        $('#bootstrapForm').show();
        $('#popupInformation-1').hide();
        $('#popupInformation-2').hide();
        
    };

    $('#bootstrapForm').submit(function(event) {
        event.preventDefault();
        var extraData = {};
        {
            // Parsing input date id=471289509
            var dateField = $("#471289509_date").val();
            var timeField = $("#471289509_time").val();
            let d = new Date(dateField);
            if (!isNaN(d.getTime())) {
                extraData["entry.471289509_year"] = d.getFullYear();
                extraData["entry.471289509_month"] = d.getMonth() + 1;
                extraData["entry.471289509_day"] = d.getUTCDate();
            }
            if (timeField && timeField.split(':').length >= 2) {
                let values = timeField.split(':');
                extraData["entry.471289509_hour"] = values[0];
                extraData["entry.471289509_minute"] = values[1];
            }
        }
        $('#bootstrapForm').ajaxSubmit({
            data: extraData,
            dataType: 'jsonp',  // This won't really work. It's just to use a GET instead of a POST to allow cookies from different domain.
            error: function() {
                // Submit of form should be successful but JSONP callback will fail because Google Forms
                // does not support it, so this is handled as a failure.
                closeModal()
                alert('M.I.A đã nhận được thông tin của bạn.');
                confetti({
                    zIndex: 99999,
                    particleCount: 500,
                    startVelocity: 30,
                    spread: 360,
                });
                // You can also redirect the user to a custom thank-you page:
                // window.location = 'http://www.mydomain.com/thankyoupage.html'
            }
        });
    });
});