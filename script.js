var reproductor = null;

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

            contSongItem = 1

            for (let i = 0; i < res.length; i++) {
                let urlImagen = null;
                if (res[i].artwork_url != null) {
                    urlImagen = res[i].artwork_url
                } else {
                    urlImagen = "disc.jpg"
                }

                const songItem = document.createElement('div')
                songItem.class = "songItem"
                songItem.id = "songItem" + contSongItem
                songItem.songId = res[i].id
                songItem.songSrc = urlImagen
                songItem.draggable = "true"
                songItem.ondragstart = function(event) {
                    dragItemSong(event)
                };


                const imagen = document.createElement('img')
                imagen.src = urlImagen
                imagen.songId = res[i].id
                imagen.songSrc = urlImagen
                songItem.draggable = "true"
                songItem.ondragstart = function(event) {
                    dragItemSong(event)
                };


                const title = document.createElement('p')
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

function playSong(id) {
    SC.stream('/tracks/' + id).then(function(player) {
        player.play();
        reproductor = player;
    });
}

document.getElementById('pause').addEventListener('click', function(ev) {
    ev.preventDefault();
    if (reproductor != null) {
        reproductor.pause();
    }
    console.log('btnPause Clicked');

});

document.getElementById('play').addEventListener('click', function(ev) {
    ev.preventDefault();
    console.log('btnPlay Clicked');
    if (reproductor != null) {
        reproductor.play();
    }
});