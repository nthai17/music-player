
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const cdThumb = $('.cd-thumb')
const SingerCurrentSong = $('.cd-info span:last-child');
const NameCurrentSong = $('.cd-info h3');
const audio = $('#audio')
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const playList = $('.play-list')
const track = $('.seek');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const replayBtn = $('.btn-repeat');
const randomBtn = $('.btn-random');
const app = {
    currentIdex: 0,
    isPlaying: false,
    isRandom: false,
    isReplay: false,
    songs: [
        {
            name: 'Về với em đi',
            singer: 'Tiên Tiên',
            path: './access/audio/VeVoiEmDi.mp3',
            avata: './access/img/song1.jpg'
        },
        {
            name: 'Gặp gỡ, yêu đương và được bên em',
            singer: 'Phan Mạnh Quỳnh',
            path: './access/audio/GapGoYeuVaBenEm-PMQ.mp3',
            avata: './access/img/song2.jpg'

        },
        {
            name: 'Thức giấc',
            singer: 'Da LAB',
            path: './access/audio/ThucGiac-DaLAB.mp3',
            avata: './access/img/song3.jpg'
        },
        {
            name: 'Có hẹn với thanh xuân',
            singer: 'Monstar',
            path: './access/audio/CoHenVoiThanhXuan.mp3',
            avata: './access/img/song4.jpg'
        },
        {
            name: 'Nắm đôi bàn tay',
            singer: 'Kay Trần',
            path: './access/audio/NamDoiBanTay.mp3',
            avata: './access/img/song5.jpg'
        },{
            name: 'Sài Gòn đau lòng quá',
            singer: 'Hoàng Duyên',
            path: './access/audio/SaiGonDauLongQua.mp3',
            avata: './access/img/song6.jpg'
            },
        {
            name: 'Nàng thơ',
            singer: 'Hoàng Dũng',
            path: './access/audio/NangTho.mp3',
            avata: './access/img/song7.jpg'
        },
        {
            name: 'Chúng ta sau này',
            singer: 'T.R.I',
            path: './access/audio/ChungTaSauNay.mp3',
            avata: './access/img/song8.jpg'
        },
        {
            name: 'Sao ta ngược lối',
            singer: 'Đình Dũng',
            path: './access/audio/SaoTaNguocLoi-DinhDung.mp3',
            avata: './access/img/song9.jpg'
        },
        {
            name: 'Những ngày mưa cô đơn',
            singer: 'Trung Quân Idol',
            path: './access/audio/NhungNgayMuaCoDon-TrungQuanIdol.mp3',            
            avata: './access/img/song10.jpg'
        }
    ],
    handleEvent: function() {
        const _this = this;
        // xử lý phóng to thu nhỏ khi scroll
        const cdBody = $('.cd-body')
        const cdBodyWidth = cdBody.offsetWidth;
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdBodyWidth = cdBodyWidth - scrollTop;
            cdBody.style.width = newCdBodyWidth > 0 ? newCdBodyWidth + 'px' : 0;
            cdBody.style.opacity = newCdBodyWidth/cdBodyWidth
        };

        // xử lý khi click nút play
        playBtn.onclick = function(){
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            } 
        };
        // Khi audio đang play
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('player-pause')
            cdThumb.classList.add('updown-thumb')
            NameCurrentSong.classList.add('text-run'),
            playBtn.classList.add('btn-active')
        };
        // khi audio bị pause
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('player-pause')
            cdThumb.classList.remove('updown-thumb')
            NameCurrentSong.classList.remove('text-run')
            playBtn.classList.remove('btn-active')
        };

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if (audio.duration){
                const trackPercent = Math.floor(audio.currentTime/audio.duration*100)
                track.value = trackPercent;
            }
        };
        // Khi tua audio
        track.onchange = function(e){
            const seekTime = e.target.value/100*audio.duration;
            audio.currentTime = seekTime;
        };

        // Xử lý khi click nút Next
        nextBtn.onclick = function(){
            if (_this.isRandom) {
                _this.playRandomSong()
            } else{
                _this.nextSong();
            }
            audio.play();
            _this.scrollToActiveSong();
        };

        // Xử lý khi click nút Prev
        prevBtn.onclick = function(){
            if (_this.isRandom) {
                _this.playRandomSong()
            } else{
                _this.prevSong();
            } 
            audio.play()
            _this.scrollToActiveSong();
        };

        // Khi bật/tắt chế độ random
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('btn-active', _this.isRandom);
        };

        // Khi bật/tắt chế độ replay
        replayBtn.onclick = function(){
            _this.isReplay = !_this.isReplay;
            replayBtn.classList.toggle('btn-active', _this.isReplay);
        };

        // Xử lý next song khi audio end
        audio.onended = function (){
            if(_this.isReplay) {
                audio.play()
            } else {
                nextBtn.click()
            }
        };

        // Xử lý khi click vào song
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')){
                if (songNode) {
                    _this.currentIdex = songNode.dataset.index;
                    _this.loadCurrentSong();
                    audio.play();
                }
            }
        }
    },

    nextSong: function(){
        this.currentIdex++;
        if (this.currentIdex >= this.songs.length) {
            this.currentIdex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function(){
        this.currentIdex--;
        if (this.currentIdex < 0) {
            this.currentIdex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function(){
        let newCurrenIndex;
        do {newCurrenIndex = Math.floor(Math.random()*this.songs.length)
        } while (newCurrenIndex === this.currentIdex);
        this.currentIdex = newCurrenIndex;
        this.loadCurrentSong();
    },
    
    // scroll hiện song active
    scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'auto',
                block: 'center',
            })
        },300)
    },

    defineProperties: function(){
        // tạo ra 1 thuộc tính là currentSong tương ứng với đối tượng bài hát hiện tại {name, singer,..}
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIdex];
            }
        })
    },
    
    loadCurrentSong: function(){
        NameCurrentSong.textContent = this.currentSong.name;
        SingerCurrentSong.textContent = this.currentSong.singer;
        cdThumb.style.backgroundImage = `url(${this.currentSong.avata})`;
        cd.style.backgroundImage = `url(${this.currentSong.avata})`;
        audio.src = this.currentSong.path;
        if ($('.song.active')) {
            $('.song.active').classList.remove('active')
        }
        const listSong = $$('.song');
        listSong[this.currentIdex].classList.add('active')
    },

    renderSongs: function() {
        const html = this.songs.map((song,index) => {
            return `<div data-index="${index}" class="song">
                <div class="song-wrab">
                    <div class="thumb" style="background-image: url(${song.avata})"></div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        }); 
        playList.innerHTML = html.join('');
    },

    start: function() {
        // định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // render danh sách bài hát
        this.renderSongs();

        // Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong();

        // lắng nghe các sự kiện
        this.handleEvent();
    }
}

app.start();
