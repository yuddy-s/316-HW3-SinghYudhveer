/*
    This is our http api, which we use to send requests to
    our back-end API. Note we're using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it's a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

// WE USE THIS TO SEND REQUESTS TO THE BACK-END-API
import axios from 'axios'
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

// THESE ARE ALL THE REQUESTS WE'LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get or post) AND PATH (like /playlist). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE CALL THE payload, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export const createPlaylist = (payload) => api.post(`/playlist`, payload)
export const readPlaylistById = (id) => api.get(`/playlist/${id}`)
export const readPlaylistPairs = () => api.get('playlistpairs')
export const updatePlaylist = (id, payload) => api.put(`/playlist/${id}`, payload);
export const deletePlaylist = (id) => api.delete(`/playlist/${id}`);
export const addSongtoPlaylist = (id, index, song) => api.put(`/playlist/${id}`, {addSong: { index: index, song: song }});
export const updateSongInPlaylist = (id, index, song) => api.put(`/playlist/${id}`, { updateSong: { index, song }});
export const moveSongInPlaylist = (id, start, end) => api.put(`/playlist/${id}`, { moveSong: { start, end }});
export const removeSongInPlaylist = (id, index) => api.put(`/playlist/${id}`, { removeSongIndex: index });

const requestSender = {
    createPlaylist,
    readPlaylistById,
    readPlaylistPairs,
    updatePlaylist,
    deletePlaylist,
    addSongtoPlaylist,
    updateSongInPlaylist,
    moveSongInPlaylist,
    removeSongInPlaylist
}

export default requestSender