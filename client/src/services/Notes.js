import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {useNavigate} from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SweetAlert from "react-bootstrap-sweetalert";
import CircularProgress from '@material-ui/core/CircularProgress';
import LoadingOverlay from 'react-loading-overlay';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import SaveIcon from '@material-ui/icons/Save';
import ListIcon from '@material-ui/icons/List';
import Alert from '@material-ui/lab/Alert';









const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  button: {
    // marginTop: theme.spacing(2),
    // width:"35%"
  },

  
}));

const Notes = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const userId = localStorage.getItem("userId");
  const[DataId,setDataId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const[Deleteid,setDeleteid] = useState(null);
  const[loading,setloading] = useState(false);
  const [alertState, setAlertMsg] = useState({ open: false, color: '', message: '' })




  useEffect(() => {
    fetchNotes()
  },[])


  const setAlertWithDuration = (open,color,message, duration = 3000) => {
    setAlertMsg({ open, color, message });
    setTimeout(() => setAlertMsg({ open: false, color: '', message: '' }), duration);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    
    
    
    try {
      const requestData = {
        title,
        content,
        userId,
        // Include DataId if it's not null, indicating it's an update
        ...(DataId && { DataId })
      };
  
      const response = await fetch('http://localhost:3000/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),  
      });
      if (response.ok) {
        console.log("save", response)
        if(!DataId){
          setAlertWithDuration(true,'success',"Note Saved SuccessFully");
         
        }
        else {
          setAlertWithDuration(true,'success',"Note Updated SuccessFully");


        }
      } else {
        console.log("else", "");

      }
    } catch (error) {
      console.error('Network error:', error);
    }
    setloading(false);
    fetchNotes();
    setContent('');
    setTitle('');
    setDataId('')
  };

  const fetchNotes = async () => {
    setloading(true);
    try {
      const response = await fetch('http://localhost:3000/notelist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data.note);
      } else {
        console.error('Error fetching notes');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
    setloading(false);
  };

  const handleEditNote = (data) => {
    setContent(data.content);
    setTitle(data.title);
    setDataId(data._id);
    
  }

  const handleLogout = () => {
    localStorage.setItem('userId',null);
    navigate('/login')
  }

  const ConfirmDelete = (id) => {
    setDeleteid(id);
    setShowAlert(true);
  };
 

  const handleDeleteNote = async (noteId) => {
   

    try {
      const response = await fetch(`http://localhost:3000/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({noteId,userId})
      });
      if (response.ok) {
        setShowAlert(false);
        setAlertWithDuration(true,'error',"Note Deleted SuccessFully");
        
        fetchNotes();
      } else {
        console.error('Failed to delete note');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };
  return (
    <>
    <Button endIcon={<ExitToAppIcon fontSize='small'/>} style={{color:"white",background:"#c14a4a", float: "right",margin:"1%" }} onClick={() => handleLogout()}  color='secondary'>Logout</Button>
 {showAlert && (


<SweetAlert
        warning
        size="sm"
        style={{ display: "block", marginTop: "100px" }}
        title="Are you sure?"
        onConfirm={() => handleDeleteNote(Deleteid)}
        onCancel={() => setShowAlert(false)}
        confirmBtnCssClass="swalokbtn"
        cancelBtnCssClass="swalcancelbtn"
        confirmBtnText="Yes"
        cancelBtnText="Cancel"
        showCancel
      >
       
      </SweetAlert>

 )}
    
    <Alert open={alertState.open} severity={alertState.color}>{alertState.message}</Alert>

    <Grid container spacing={4} className='notescontainer'>
<Grid item xs={4} className='leftside'>
        <Button endIcon={<NoteAddIcon/>} className='AddNoteCls'>{DataId ? "Edit Note": "Add Note"}</Button>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            className={classes.textField}
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            className={classes.textField}
            label="Content"
            multiline
            rows={4}
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
           <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
            endIcon={<SaveIcon/>}
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            {DataId ? "Update Note": "Save Note"}
            
          </Button>
    
          {loading && <CircularProgress color="primary" />}
          </div> 
        </form>
        
     
      </Grid>
 <Grid xs={1}></Grid>
      <Grid item xs={7} className='rightside'>
       {loading && <CircularProgress color='primary'/>}
        {notes && notes.length > 0 && 
        <>
          <Button
          style={{background:'forestgreen',color:'white',marginBottom:"10px"}}
            endIcon={<ListIcon/>}
            // className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            Notes List
            
          </Button>
        
        <Table>
          <TableHead>
            <TableRow>
            <TableCell className='tablehead'>S.No</TableCell>
              <TableCell className='tablehead' >Title</TableCell>
              <TableCell className='tablehead'>Content</TableCell>
              <TableCell className='tablehead'>Edit</TableCell>
              <TableCell className='tablehead'>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notes.map((note,i) => (
              <TableRow key={note._id}>
                 <TableCell className='tablecell'>{i+1}</TableCell>
                <TableCell className='tablecell'>{note.title}</TableCell>
                <TableCell className='tablecell'>{note.content}</TableCell>
                <TableCell  onClick={() => handleEditNote(note)} style={{cursor:'pointer'}}><EditIcon style={{color:"darkorange"}}fontSize='small'/></TableCell>
                <TableCell onClick={() => ConfirmDelete(note._id)} style={{cursor:'pointer'}}><DeleteIcon style={{color:"red"}} fontSize='small'/></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>  
        </>
        }
      </Grid> 
    </Grid>
    </>
  );
};

export default Notes;
