$(document).ready(function() {
    console.log("run ");

    function updateEntry(textToCompare) {
        fetch('https://api.jsonbin.io/v3/b/67662338ad19ca34f8de9939/latest', {
            method: 'GET',
            headers: {
                'X-Master-key': "$2a$10$64xklhAsmRUZu55xRZhqVO783BJlU/EmxsnWLzfzwZ1TmQ6kD7fxu"
            }
        })
            .then(response => response.json())
            .then(data => {
                const prizes = data.record;
                const entryIndex = prizes.findIndex(prize => prize.text === textToCompare);
                if (entryIndex !== -1) {
                    prizes[entryIndex].number -= 1;
                }

                return fetch('https://api.jsonbin.io/v3/b/67662338ad19ca34f8de9939', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-key': "$2a$10$64xklhAsmRUZu55xRZhqVO783BJlU/EmxsnWLzfzwZ1TmQ6kD7fxu"
                    },
                    body: JSON.stringify(prizes)
                });
            })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch(error => console.error('Error:', error));
    }

    window.showForm = function() {
        $('#bootstrapForm-1').show();
        $('#bootstrapForm-2').show();
        $('#popupInformation-1-1').hide();
        $('#popupInformation-1-2').hide();
        $('#popupInformation-2-1').hide();
        $('#popupInformation-2-2').hide();
    };

    $('#bootstrapForm-1').submit(function(event) {
        event.preventDefault();
        var extraData = {};
        {
            // Parsing input date id=471289509
            var dateField = $("#471289509_date_1").val();
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
            updateEntry($("#151499827-1").val())
        }
        $('#bootstrapForm-1').ajaxSubmit({
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
    $('#bootstrapForm-2').submit(function(event) {
        event.preventDefault();
        var extraData = {};
        {
            // Parsing input date id=471289509
            var dateField = $("#471289509_date_2").val();
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
            updateEntry($("#151499827-2").val())
        }
        $('#bootstrapForm-2').ajaxSubmit({
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