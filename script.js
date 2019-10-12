var reproductor = null;
var playerSoundCloud = null;

SC.initialize({
    client_id: 'aa06b0630e34d6055f9c6f8beb8e02eb'
});

document.querySelector('.buscarCancion').addEventListener('submit', function(event) {
    event.preventDefault();

    //Eliminar anterior busqueda si la hay
    var myNode = document.querySelector('.results');
    if (myNode.hasChildNodes) {
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
    }

    //Rellenar el div resultados con los datos
    SC.get('/tracks', {
            q: event.target.textbox.value
        })
        .then(function(res) {
            console.log(res)

            let contSongItem = 1

            for (let i = 0; i < res.length; i++) {
                let urlImagen = null;
                if (res[i].artwork_url != null) {
                    urlImagen = res[i].artwork_url;
                } else {
                    urlImagen = "disc.jpg";
                }

                const songItem = document.createElement('div')
                songItem.setAttribute('class', 'songItem');
                songItem.id = "songItem" + contSongItem
                songItem.songId = res[i].id
                songItem.songSrc = urlImagen
                songItem.draggable = "true"
                songItem.ondragstart = function(event) {
                    dragItemSong(event)
                };


                const imagen = document.createElement('img')
                imagen.setAttribute('class', 'songImg');
                imagen.src = urlImagen
                imagen.songId = res[i].id
                imagen.songSrc = urlImagen


                const title = document.createElement('p')
                title.setAttribute('class', 'songTitle');
                var node = document.createTextNode(res[i].title);
                title.appendChild(node)

                document.querySelector('.results').append(songItem)
                document.querySelector('#songItem' + contSongItem).append(imagen)
                document.querySelector('#songItem' + contSongItem).append(title)

                contSongItem++
            }
        })
})


function allowDrop(ev) {
    ev.preventDefault();
}

function dragItemSong(ev) {
    console.log("Entramos en el drag ItemSong")
    console.log(ev)
    ev.dataTransfer.setData("idSong", ev.target.songId);
    ev.dataTransfer.setData("srcSong", ev.target.songSrc);
}

function drop(ev) {
    ev.preventDefault();
    var iDdata = ev.dataTransfer.getData("idSong");
    var srcData = ev.dataTransfer.getData("srcSong");
    console.log("Entramos en del drop")
    console.log(iDdata)
    console.log(ev)
    ev.target.src = srcData
    playSong(iDdata)
}


/////////////BOTON PLAY/////////////////
var audioPlayer = document.querySelector('.green-audio-player');
var playpauseBtn = audioPlayer.querySelector('.play-pause-btn');
playpauseBtn.addEventListener('click', togglePlay);

function playSong(id) {
    SC.stream('/tracks/' + id).then(function(player) {
        player.play();
        playerSoundCloud = player;
        playPause.attributes.d.value = "M0 0h6v24H0zM12 0h6v24h-6z";
        startProgressControll()
        onFinish()
        console.log(player)
    });
}

//boton intercambiable
function togglePlay() {
    console.log("Play/Pause btn Clicked")
    if (playerSoundCloud != null) {
        if (playerSoundCloud.isPlaying()) {
            playPause.attributes.d.value = "M18 12L0 24V0";
            playerSoundCloud.pause();
        } else {
            playPause.attributes.d.value = "M0 0h6v24H0zM12 0h6v24h-6z";
            playerSoundCloud.play();
        }
    }
}


/////////////PROGRESS SONG/////////////////
var progress = audioPlayer.querySelector('.progress');
var sliders = audioPlayer.querySelectorAll('.slider');
var currentTime = audioPlayer.querySelector('.current-time');
var totalTime = audioPlayer.querySelector('.total-time');

function startProgressControll() {
    playerSoundCloud.on("time", function() {

        totalTime.textContent = formatTime(playerSoundCloud.getDuration());
        currentTime.textContent = formatTime(playerSoundCloud.currentTime());

        let songPercentajeNumber = songPercentaje(
            playerSoundCloud.getDuration(),
            playerSoundCloud.currentTime());

        progress.style.width = songPercentajeNumber + '%'
    })
}

function formatTime(time) {
    if (time != null) {
        let timeNumber = parseInt(time, 10)
        let secAux = timeNumber / 1000;
        let minAux = secAux / 60
        let min = Math.floor(minAux);
        let sec = Math.floor(secAux % 60);
        return min + ':' + (sec < 10 ? '0' + sec : sec);
    }
}

function songPercentaje(duration, currentTime) {
    if (duration != null && currentTime != null) {
        let dur = parseInt(duration, 10)
        let current = parseInt(currentTime, 10)
        return current / dur * 100;
    }
}

function onFinish() {
    playerSoundCloud.on("finish", function() {
        playPause.attributes.d.value = "M18 12L0 24V0";
    })
}