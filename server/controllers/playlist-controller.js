const Playlist = require('../models/playlist-model')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/

createPlaylist = (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + body);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    console.log("playlist: " + JSON.stringify(body));
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    playlist
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                playlist: playlist,
                message: 'Playlist Created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Playlist Not Created!',
            })
        })
}
readPlaylistById = async (req, res) => {
    await Playlist.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json({ success: true, playlist: list })
    }).catch(err => console.log(err))
}
readAllPlaylists = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}
readPlaylistPairs = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: 'Playlists not found' })
        }
        else {
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in playlists) {
                let list = playlists[key];
                let pair = {
                    _id: list._id,
                    name: list.name
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
        }
    }).catch(err => console.log(err))
}
updatePlaylist = async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide data to update the playlist with!',
        })
    }

    const playlist = await Playlist.findById(id);
    if(!playlist) {
            return res.status(404).json({ success: false, error: "Playlist not found!" })
    }

    if (body.name !== undefined) {
        playlist.name = body.name;
        console.log(body.name)
    }

    else if (body.addSong !== undefined) {
        const { index, song } = body.addSong;
        if(typeof index === 'number' && index >= 0 && index <= playlist.songs.length) {
            playlist.songs.splice(index, 0, song);
        } else {
            playlist.songs.push(song);
        }
    }

    else if (body.moveSong !== undefined) {
        const { start, end } = body.moveSong;
        if(start < 0 || end > playlist.songs.length) {
            return res.status(400).json({ success: false, error: "Invalid indexes"})
        }
        const [song] = playlist.songs.splice(start, 1);
        playlist.songs.splice(end, 0, song)
    }

    else if (body.updateSong !== undefined) {
        const { index, song } = body.updateSong;
        if (index < 0 || index > playlist.songs.length) {
            return res.status(400).json({ success: false, error: "Out of bounds index"})
        }
        playlist.songs[index] = song;
    }

    else if (body.removeSongIndex !== undefined) {
        if(body.removeSongIndex < 0 || body.removeSongIndex > playlist.songs.length) {
            return res.status(400).json({ success: false, error: "Out of bounds index"})
        }
        playlist.songs.splice(body.removeSongIndex, 1)
    }

    playlist
        .save()
        .then(() => {
            return res.status(200).json({
                success: true,
                playlist: playlist,
                message: `Playlist updated successfully!`,
            })
        })
        .catch(error => {
            return res.status(400).json({
                success: false,
                error: error.message,
            })
        })
}
deletePlaylist = async (req, res) => {
    const { id } = req.params;
    const playlist = await Playlist.findById(id);
    if (!playlist) {
        return res.status(400).json({ success: false, error: "Non-existent playlist"})
    }

    await Playlist.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Playlist deleted successfully!" })
}
getPlaylistStartWith = async (req, res) => {
    const { nameStartsWith } = req.query;
    let newList = [];

    await Playlist.find({}, (error, playlists) => {
        if(error) {
            return res.status(400).json({ success: false, error: error})
        }
        if(!playlists.length) {
            return res.status(400).json({ success: false, error: "Null playlist"})
        }

        for (const p of playlists) {
            if (p.name.split(" ")[0].trim() === nameStartsWith.trim()) {
                newList.push(p);
            }
        }

        return res.status(200).json({ success: true, message: "Playlists found!", data: newList })
    }).catch(err => console.log(err))
}
getUniqueSongs = async (req, res) => {
    const { title, artist, year, youTubeId } = req.query;
    const playlists = await Playlist.find({});

    let allSongs = [];
    for (const playlist of playlists) {
        allSongs = allSongs.concat(playlist.songs)
    }

    let yearNum = year ? parseInt(year) : undefined;
    
    let filtered = allSongs.filter(song => {
        return (!title || song.title === title) &&
                (!artist || song.artist === artist) &&
                (!year || song.year === yearNum) &&
                (!youTubeId || song.youTubeId === youTubeId);
    })

    const uniqueSongs = [];
    const seen = new Set();

    for(const song of filtered) {
        const key = `${song.title}-${song.artist}-${song.year}-${song.youTubeId}`;
        if(!seen.has(key)) {
            seen.add(key);
            uniqueSongs.push(song);
        }
    }

    return res.status(200).json({ success: true, data: uniqueSongs })
}

module.exports = {
    createPlaylist,
    readAllPlaylists,
    readPlaylistPairs,
    readPlaylistById,
    updatePlaylist,
    deletePlaylist,
    getPlaylistStartWith,
    getUniqueSongs,
}