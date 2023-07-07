import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const styles = {
  container: {
    marginTop: '2rem',
    marginBottom: '2rem'
  },
  header: {
    marginBottom: '1rem'
  },
  addButton: {
    marginBottom: '1rem'
  },
  cardContainer: {
    marginTop: '1rem'
  },
  cardContent: {
    height: '100%'
  },
  cardTitle: {
    marginBottom: '0.5rem'
  },
  cardCategory: {
    color: 'rgba(0, 0, 0, 0.54)'
  },
  noteContent: {
    marginTop: '0.5rem'
  },
  noteText: {
    display: 'block',
    marginBottom: '0.25rem'
  }
};

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    axios
      .get('https://api.gyanibooks.com/library/get_dummy_notes')
      .then(response => {
        setNotes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching notes:', error);
        setLoading(false);
      });
  };

  const handleAddNote = () => {
    setSelectedNote(null);
    setTitle('');
    setCategory('');
    setNoteContent('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveNote = () => {
    const newNote = {
      title: title,
      category: category,
      notes: JSON.stringify({ type: 'doc', content: JSON.parse(noteContent) })
    };

    // Perform API call to save the note
    // Here, we assume that the API supports adding a new note
    axios
      .post('https://api.gyanibooks.com/library/add_dummy_note', newNote)
      .then(response => {
        fetchNotes(); // Fetch the updated notes list
        setOpenDialog(false);
        toast.success('Note added successfully');
      })
      .catch(error => {
        console.error('Error adding note:', error);
      });
  };

  const handleUpdateNote = () => {
    const updatedNote = {
      id: selectedNote.id,
      title: title,
      category: category,
      notes: JSON.stringify({ type: 'doc', content: JSON.parse(noteContent) })
    };

    // Perform API call to update the note
    // Here, we assume that the API supports updating a note
    axios
      .put(`https://api.gyanibooks.com/library/update_dummy_note/${selectedNote.id}`, updatedNote)
      .then(response => {
        fetchNotes(); // Fetch the updated notes list
        setOpenDialog(false);
        toast.success('Note updated successfully');
      })
      .catch(error => {
        console.error('Error updating note:', error);
      });
  };

  const handleDeleteNote = () => {
    // Perform API call to delete the note
    // Here, we assume that the API supports deleting a note
    axios
      .delete(`https://api.gyanibooks.com/library/delete_dummy_note/${selectedNote.id}`)
      .then(response => {
        fetchNotes(); // Fetch the updated notes list
        setSelectedNote(null);
        toast.success('Note deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting note:', error);
      });
  };

  const handleCardClick = note => {
    setSelectedNote(note);
    setTitle(note.title);
    setCategory(note.category);
    setNoteContent(note.notes);
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="md" style={styles.container}>
      <Typography variant="h4" align="center" style={styles.header}>
        Dummy Notes
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddNote}
        style={styles.addButton}
      >
        Add Note
      </Button>
      {loading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : (
        <Grid container spacing={2} style={styles.cardContainer}>
          {notes.map(note => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Card onClick={() => handleCardClick(note)}>
                <CardContent style={styles.cardContent}>
                  <Typography variant="h6" component="h2" style={styles.cardTitle}>
                    {note.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" style={styles.cardCategory}>
                    {note.category}
                  </Typography>
                  <Typography variant="body2" style={styles.noteContent}>
                    {/* {JSON.parse(note.notes).content.map((contentItem, index) => (
                      <Typography variant="body2" key={index} style={styles.noteText}>
                        {contentItem.content.map((textItem, textIndex) => (
                          <span
                            key={textIndex}
                            style={{
                              color: textItem.marks.find(mark => mark.type === 'textColor')?.attrs.color || 'inherit',
                              backgroundColor:
                                textItem.marks.find(mark => mark.type === 'backgroundColor')?.attrs.color || 'inherit'
                            }}
                          >
                            {textItem.text}
                          </span>
                        ))}
                      </Typography>
                    ))}  */}
                  </Typography>
                  {/* <Typography variant="body2" style={styles.noteContent}>
                    {JSON.parse(note.notes).content.map((contentItem, index) => (
                      <Typography variant="body2" key={index} style={styles.noteText}>
                        {contentItem.content.map((textItem, textIndex) => (
                          <span
                            key={textIndex}
                            // style={{
                            //   color: (textItem.marks && textItem.marks.find(mark => mark.type === 'textColor')?.attrs.color) || 'inherit',
                            //   backgroundColor:
                            //     (textItem.marks && textItem.marks.find(mark => mark.type === 'backgroundColor')?.attrs.color) || 'inherit',
                            // }}
                          >
                            {textItem.text}
                          </span>
                        ))}
                      </Typography>
                    ))}
                  </Typography> */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedNote ? 'Edit Note' : 'Add Note'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Category"
            fullWidth
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Note Content"
            fullWidth
            multiline
            rows={4}
            value={noteContent}
            onChange={e => setNoteContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          {selectedNote ? (
            <>
              <Button onClick={handleUpdateNote} color="primary">
                Update
              </Button>
              <Button onClick={handleDeleteNote} color="secondary">
                Delete
              </Button>
            </>
          ) : (
            <Button onClick={handleSaveNote} color="primary">
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Container>
  );
}

export default App;