const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playList = $('.playlist');
const title = $('.title');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const audio = $('audio');
const cdWidth = cd.offsetWidth;
const playBtn = $('.controll-toggle-btn');
const player = $('.player');
const process = $('.process');
const nextBtn = $('.controll-btn-next');
const previousBtn = $('.controll-btn-previous');
const randomBtn = $('.controll-btn-random');
const repeatBtn = $('.controll-btn-repeat');

// 1. cuộn lên phóng to thu nhỏ
// 2. render songs to playlist
// 3. load current song
// 4. Play/ pause/tua thumb xoay
// 5. next/previous/ kết thúc bài hát tự next
// 6. repeat/ shuffer
// 7. chọn bài hát trong playlist, view center
// 8. lưu setting khi reload

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: '1 phút',
            singer: 'Andriez',
            path: './assets/music/1 Phut-Andiez.mp3',
            img: './assets/img/1.jpg'
        },
        {
            name: 'Ác ma đến từ thiên đường',
            singer: 'No name',
            path: './assets/music/Ác Ma Đến Từ Thiên Đường.mp3',
            img: './assets/img/2.jpg'
        },
        {
            name: 'Anh ta bỏ em rồi',
            singer: 'Hương Giang',
            path: './assets/music/Anh-Ta-Bo-Em-Roi-Huong-Giang.mp3',
            img: './assets/img/3.jpg'
        },
        {
            name: 'Bùa yêu',
            singer: 'Bích Phương',
            path: './assets/music/BuaYeu-BichPhuong.mp3',
            img: './assets/img/4.jpg'
        },
        {
            name: 'Bức tranh đến từ nước mắt',
            singer: 'Mr Siro',
            path: './assets/music/Buc-Tranh-Tu-Nuoc-Mat-Mr-Siro.mp3',
            img: './assets/img/5.jpg'
        },
        {
            name: 'Cao ốc 20',
            singer: 'Bray',
            path: './assets/music/Cao Oc 20-BRay.mp3',
            img: './assets/img/6.jpg'
        },
        {
            name: 'Chắc ai đó sẽ về',
            singer: 'Sơn Tùng MTP',
            path: './assets/music/Chac-Ai-Do-Se-Ve-Son-Tung-M-TP.mp3',
            img: './assets/img/7.jpg'
        },
        {
            name: 'Chạm đáy nỗi đau',
            singer: 'Erik',
            path: './assets/music/Cham-Day-Noi-Dau-ERIK.mp3',
            img: './assets/img/8.jpg'
        },
        {
            name: 'Ac ma',
            singer: 'Đức Phúc',
            path: './assets/music/AC MA.mp3',
            img: './assets/img/9.jpg'
        },
    ],
    defiproperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    loadCurrentSong: function() {
        title.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.img})`;
        audio.src = this.currentSong.path;
    },
    renderSongs: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                <div class="song-thumb" style="background-image: url(${song.img});"></div>
                <div class="song-body">
                    <h2 class="song-title">${song.name}</h2>
                    <p class="song-singer">${song.singer}</p>
                </div>
                <div class="song-controll">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('');
    },
    handleEvent: function() {
        _this = this;
        const cdThumbAnimate = cd.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 30000,
            iteration: Infinity
        })
        cdThumbAnimate.pause();
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;
        }
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
           
        }
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        audio.ontimeupdate= function() {
            if(audio.duration){
                const percent = Math.floor(audio.currentTime / audio.duration * 100);
                process.value = percent;
            } 
        }
        process.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSongs();
                _this.loadCurrentSong();
                
            } else {
                _this.nextSong();
               
            }
            audio.play();
            _this.renderSongs();
            _this.scrollToActive();

        }
        previousBtn.onclick = function() {
            _this.previousSong();
            audio.play(); 
        }
        audio.onended = function() {
            if(!_this.isRepeat) {
                audio.play();
            } else{
                nextBtn.click();
                audio.play();
            }
          
        }
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
          
            randomBtn.classList.toggle('actived' , _this.isRandom)
            
        }
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('actived', _this.isRepeat);
        }
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.song-controll')){
               _this.currentIndex = Number(songNode.getAttribute('data-index')) 
               _this.loadCurrentSong();
               _this.renderSongs();
               audio.play();
               
            }
        }
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    },
    previousSong: function() {
      this.currentIndex--;
      if(this.currentIndex < 0) {
        this.currentIndex = this.songs.length -1;
      } 
      this.loadCurrentSong(); 
    },
    playRandomSongs: function() {
        let randomIndex
        do{
            randomIndex  = Math.floor(Math.random() * this.songs.length);
        } while(randomIndex === this.currentIndex);
        this.currentIndex = randomIndex;
        
        
    },
    scrollToActive: function() {
       setTimeout(() => {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
           
        })
       }, 300)
       
    },
    start: function() {
        this.renderSongs();
        this.defiproperties();
        this.loadCurrentSong();
        this.handleEvent();
        
    }
}
app.start();