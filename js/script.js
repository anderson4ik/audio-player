/* var name = prompt("Your name");
alert(name); */

$(document).ready(function () {
    $(".audioPlayer").toArray().forEach(function (player) {

        /** Find the audio tag */

        var audio = $(player).find("audio")[0];
        var seekBarInner = $(player).find(".seekBar .inner");
        var seekBarOuter = $(player).find(".seekBar .outer");
        var volumeControl = $(player).find(".volumeControl .wrapper");
        var fileNameEl = document.getElementById("fileName");
        var audioName = document.getElementById("audioName");

        var length; /**length of the audio file */
        var interval; /**used to run setInterval Function */
        var seekBarPercentage;
        var volumePercentege;

        /**transfer the name (src) of audio file to dom element **/
        fileNameEl.innerHTML = audioName.src;

        /**************************** on click of button play the song ************************/
        $(player).find(".btn").on("click", function () {
            var _button = $(this);

            /** if the button has class play then */
            if (_button.hasClass("play")) {
                _button.removeClass("play").addClass("pause");

                /**find the length of the audio */
                length = audio.duration;
                /**set the end duration */
                $(player).find(".timing .end").text((length / 60).toFixed(2));

                /**play the audio */
                audio.play();

                /**set the seekbar percentage */
                interval = setInterval(function () {
                    /**run this function to update the seekbar */

                    if (!audio.paused) {
                        /**while the audio is playing */
                        updateSeekBar();
                    }

                    /**if audio is ended */
                    if (audio.ended) {
                        clearInterval(interval);
                        $(player).find(".albumArt").removeClass("animate");
                        _button.removeClass("pause").addClass("play");
                        seekBarInner.width(100 + "%");
                    }

                }, 250);
            } //if loop
            else if (_button.hasClass("pause")) {
                _button.removeClass("pause").addClass("play");
                audio.pause();
            }

            $(player).find(".albumArt").toggleClass("animate");

        }); // -- onclick



        /********************* for scroll on the seekbar ********************/
        seekBarOuter.mousewheel(function (turn, delta) {
            if (length != undefined) {
                /* update the seekbar only if length is set */
                if (delta == 1) {
                    audio.currentTime < audio.duration
                        ? (audio.currentTime += 1)
                        : (audio.currentTime = audio.duration);
                    updateSeekBar();
                } else {
                    audio.currentTime < 0
                        ? (audio.currentTime = 0)
                        : (audio.currentTime -= 1);
                    updateSeekBar();
                }
            }
        }); // scroll on the seekbar

        /********************* for click on the seekbar *********************/
        seekBarOuter.on('click', function (e) {
            if (!audio.ended && length != undefined) {
                var seekPosition = e.pageX - $(seekBarOuter).offset().left;
                if (seekPosition >= 0 && seekPosition < $(seekBarOuter).offset().left) {
                    audio.currentTime = (seekPosition * audio.duration) / $(seekBarOuter).width();
                    updateSeekBar();
                }
            }
        });

        /** for click on the volume control */
        volumeControl.find(".outer").on('click', function (e) {
            var volumePosition = e.pageX - $(this).offset().left;
            var audioVolume = volumePosition / $(this).width();

            if (audioVolume >= 0 && audioVolume <= 1) {
                audio.volume = audioVolume;
                $(this).find(".inner").css("width", audioVolume * 100 + "%");
            }
        });

        /** for scroll on volume control */
        volumeControl.mousewheel(function (turn, delta) {
            if (delta == 1) {
                audio.volume < 0.9 ? (audio.volume += 0.1) : (audio.volume = 1);
                updateVolume();
            } else {
                audio.volume < 0.1 ? (audio.volume = 0) : (audio.volume -= 0.1);
                updateVolume();
            }
        });

        /****************************** All Functions ***********************/

        /**
         * update Seekbar
         */

        var updateSeekBar = function () {
            seekBarPercentage = getPercentage(audio.currentTime.toFixed(2), length.toFixed(2));

            /**updating the seekBar percentage */
            $(seekBarInner).css("width", seekBarPercentage + "%");

            /**update the start time */
            $(player).find(".timing .start").text((audio.currentTime / 60).toFixed(2));


        };//---seekBar function 


        /**
         * update VolumeBar
         */

        var updateVolume = function () {
            volumePercentege = getPercentage(audio.volume, 1);
            $(volumeControl).find(".inner").css("width", volumePercentege + "%");
        }

    }); //----------------- foreach loop

    /**find Percentage */
    var getPercentage = function (presentTime, totalLength) {

        var clacPrecentage = (presentTime / totalLength) * 100;
        return parseFloat(clacPrecentage.toString());
    }
});