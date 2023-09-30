function load_notes(notes) {

    const entries = Object.entries(notes);

    for (const [key, value] of entries) {

        dbKey = (parseFloat(key) + 1);

        document.write(
            "<div class='note_div'>" +
            "<h3 id='note_" + dbKey + "' onclick=\"post_note(" + dbKey + ", \'" + value + "\')\">" + value + "</h3>" +
            "</div>");
    }
}

function post_note(noteId, noteName) {
    fetch('/note',
        {
            method: 'POST',
            body: JSON.stringify({
                note_id: noteId,
                note_name: noteName
            }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        }
    ).then(response => response.json())
    .then(data => {

        // If server responds that is changed the note in session
        window.location.replace('/')

    });
}