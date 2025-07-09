const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const tabId = tab.getAttribute('data-tab');
                document.getElementById(`${tabId}-content`).classList.add('active');
            });
        });
        
        function updateCountdown() {
            const currentYear = new Date().getFullYear();
            const arafahDate = new Date(`June 15, ${currentYear} 00:00:00`);
            const now = new Date();
            
            if (now > arafahDate) {
                arafahDate.setFullYear(currentYear + 1);
            }
            
            const diff = arafahDate - now;
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
        
        const audioBtn = document.getElementById('audio-btn');
        let audioPlaying = false;
        let audio = null;
        
        audioBtn.addEventListener('click', () => {
            if (audioPlaying) {
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
                audioBtn.innerHTML = '<i class="fas fa-play"></i>';
                audioPlaying = false;
            } else {
                audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
                audio.play();
                audioBtn.innerHTML = '<i class="fas fa-stop"></i>';
                audioPlaying = true;
                
                audio.onended = function() {
                    audioBtn.innerHTML = '<i class="fas fa-play"></i>';
                    audioPlaying = false;
                };
            }
        });
        
        function updatePrayerTimes(latitude, longitude) {
            const date = new Date();
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            
            fetch(`https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${latitude}&longitude=${longitude}&method=2`)
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        const timings = data.data.timings;
                        
                        document.getElementById('fajr').textContent = formatTime(timings.Fajr);
                        document.getElementById('sunrise').textContent = formatTime(timings.Sunrise);
                        document.getElementById('dhuhr').textContent = formatTime(timings.Dhuhr);
                        document.getElementById('asr').textContent = formatTime(timings.Asr);
                        document.getElementById('maghrib').textContent = formatTime(timings.Maghrib);
                        document.getElementById('isha').textContent = formatTime(timings.Isha);
                        
                        document.getElementById('location-info').textContent = `أوقات الصلاة لـ ${data.data.meta.timezone}`;
                    }
                })
                .catch(error => {
                    console.error('Error fetching prayer times:', error);
                    document.getElementById('location-info').textContent = 'تعذر الحصول على أوقات الصلاة، جاري استخدام الأوقات الافتراضية';
                });
        }
        
        function formatTime(timeString) {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours);
            const period = hour >= 12 ? 'م' : 'ص';
            const displayHour = hour > 12 ? hour - 12 : hour;
            return `${displayHour}:${minutes} ${period}`;
        }
        
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        updatePrayerTimes(position.coords.latitude, position.coords.longitude);
                    },
                    error => {
                        console.log('Geolocation permission denied, using default times');
                        document.getElementById('location-info').textContent = 'تم استخدام الأوقات الافتراضية. يرجى تفعيل الموقع للحصول على أوقات دقيقة';
                    }
                );
            } else {
                document.getElementById('location-info').textContent = 'المتصفح لا يدخدم خدمة الموقع، جاري استخدام الأوقات الافتراضية';
            }
        }
        
        getLocation();

        document.querySelectorAll('.card, .countdown-item, .prayer-time').forEach(element => {
            element.style.transition = 'all 0.3s ease';
        });
