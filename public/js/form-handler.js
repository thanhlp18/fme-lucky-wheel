$(document).ready(function () {
    function updateEntry(text) {
        const prizes = JSON.parse(JSON.stringify(window.prizes));
        const index = prizes.findIndex(p => p.text === text);
        if (index !== -1 && prizes[index].number > 0) {
            prizes[index].number -= 1;
            window.prizes = prizes;
        }
    }

    window.showForm = function () {
        $('#bootstrapForm-1').show();
        $('#popupInformation-1-1').hide();
        const spinData = JSON.parse(localStorage.getItem('spinData')) || {};
        const phoneNumber = localStorage.getItem('phoneNumber');
        if (spinData[phoneNumber]) {
            $('#795063311').val(spinData[phoneNumber].userName);
            $('#733058814').val(phoneNumber);
        }
    };

    $('#preSpinForm').submit(function (event) {
        event.preventDefault();
        const userName = $('#userName').val();
        const phoneNumber = $('#phoneNumber').val();
        const spinLimit = parseInt($('#spinLimit').val());

        if (!userName || !phoneNumber || !spinLimit || spinLimit < 1) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Vui lòng điền đầy đủ thông tin.' });
            return;
        }
        if (!/^[0-9]{10}$/.test(phoneNumber)) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Số điện thoại phải có 10 chữ số.' });
            return;
        }
        let spinData = JSON.parse(localStorage.getItem('spinData')) || {};
        if (spinData[phoneNumber]) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Số điện thoại đã được sử dụng.' });
            return;
        }

        spinData[phoneNumber] = { spinsLeft: spinLimit, spinLimit: spinLimit, userName: userName };
        localStorage.setItem('spinData', JSON.stringify(spinData));
        localStorage.setItem('phoneNumber', phoneNumber);
        localStorage.setItem('wonPrizes', JSON.stringify([]));
        $('#preSpinForm').hide();
        $('#wrapper').show();
    });

    $('#fillFormBtn').click(function (event) {
        event.preventDefault();
        const name = $('#795063311').val();
        const phone = $('#733058814').val();
        const date = $('#1451296626_date').val();
        const gender = $('input[name="entry.38078272"]:checked').val();
        if (!name || !phone || !date || !gender) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Vui lòng điền đầy đủ các trường bắt buộc.' });
            return;
        }
        if (!/^[0-9]{10}$/.test(phone)) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Số điện thoại phải có 10 chữ số.' });
            return;
        }
        let d = new Date(date);
        if (isNaN(d.getTime())) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Ngày sinh không hợp lệ.' });
            return;
        }

        // Add hidden fields for date components
        $('<input>').attr({ type: 'hidden', name: 'entry.1451296626_year', value: d.getFullYear() }).appendTo('#bootstrapForm-1');
        $('<input>').attr({ type: 'hidden', name: 'entry.1451296626_month', value: d.getMonth() + 1 }).appendTo('#bootstrapForm-1');
        $('<input>').attr({ type: 'hidden', name: 'entry.1451296626_day', value: d.getUTCDate() }).appendTo('#bootstrapForm-1');

        // Create a hidden iframe for form submission
        const iframeId = 'hiddenIframe-' + new Date().getTime(); // Unique ID to avoid conflicts
        const iframe = $(`<iframe id="${iframeId}" name="${iframeId}" style="display:none;"></iframe>`).appendTo('body');

        // Set the form's target to the iframe
        $(this).attr('target', iframeId);

        // Submit the form
        this.submit();

        // Detect when the iframe loads (indicating submission completion)
        iframe.on('load', function () {
            setTimeout(() => {
                closeModal();
                Swal.fire({
                    title: 'Thành công',
                    text: 'M.I.A đã nhận được thông tin của bạn.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => {
                    localStorage.clear(); // Use localStorage.clear() for consistency
                    let wonPrizes = JSON.parse(localStorage.getItem("wonPrizes")) || [];
                    wonPrizes.forEach(prize => updateEntry(prize.text));
                    $('#popupOverlay').hide();
                    $('#content').removeClass("blur");
                    $('#bootstrapForm-1').hide();
                    $('#bootstrapForm-1')[0].reset();
                    $('#preSpinForm').show();
                    $('#preSpinForm')[0].reset();
                    $('#wrapper').hide();
                    const rotateAudio = document.querySelector('#wheel-rotate-music');
                    pauseAudio('#wheel-rotate-music');
                    rotateAudio.currentTime = 0;
                    confetti({
                        particleCount: 500,
                        startVelocity: 30,
                        spread: 360,
                    });

                    // Clean up the iframe
                    iframe.remove();
                });
            }, 1000);
        });
    });
});