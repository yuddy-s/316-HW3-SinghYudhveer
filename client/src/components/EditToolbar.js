import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    function handleAddSong() {
        store.addNewSong();
    }
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.do();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    let addSongClass = "edit-toolbar-button";
    let canAddSong = store.currentList !== null && store.currentModal === "NONE";
    if (!canAddSong) addSongClass += "-disabled";
    let undoClass = "edit-toolbar-button";
    let canUndo = store.canUndo() && store.currentModal === "NONE";
    if (!canUndo) undoClass += "-disabled";
    let doClass = "edit-toolbar-button";
    let canDo = store.canDo() && store.currentModal === "NONE";
    if (!canDo) doClass += "-disabled";
    let closeClass = "edit-toolbar-button";
    let canClose = store.currentList !== null && store.currentModal === "NONE";
    if (!canClose) closeClass += "-disabled";
    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={!canAddSong}
                value="+"
                className={addSongClass}
                onClick={handleAddSong}
            />
            <input
                type="button"
                id='undo-button'
                disabled={!canUndo}
                value="⟲"
                className={undoClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={!canDo}
                value="⟳"
                className={doClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={!canClose}
                value="X"
                className={closeClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;