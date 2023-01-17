import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Container, Paper, Button } from '@material-ui/core';
import { default as authConfig } from "../config.json";

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),

    },
  },
}));

export default function Student({ derivedAuthState }) {
  const paperStyle = { padding: '50px 20px', width: 600, margin: "20px auto" }
  const [id, setId] = useState('')
  const [todo_task, setTodoTask] = useState('')
  const [proceedOnAsgardeoToken, setproceedOnAsgardeoToken] = useState<boolean>(false)
  const [proceedOnChoreoToken, setproceedOnChoreoToken] = useState<boolean>(false)
  const [todos, setTodos] = useState([])
  const [asgardeoNewtoken, setAsgardeonewToken] = useState<String>('')
  const [choreoApiKey, setChoreoApiKey] = useState('')
  const choreoEndpoint = "https://55e3a8f2-7665-4bcd-aa11-76dfd803a326-prod.e1-us-east-azure.choreoapis.dev/vytw/todo-api/1.0.0"
  const asgardeoIdToken = derivedAuthState?.idToken[0] + "." + derivedAuthState?.idToken[1] + "." + derivedAuthState?.idToken[2]
  const classes = useStyles();

  const handleClick = (e) => {
    e.preventDefault()
    const todos = { id, todo_task }
    console.log("printing todos before saveTodos")
    console.log(todos)
    fetch(choreoEndpoint + "/saveTodos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + choreoApiKey
      },
      body: JSON.stringify([todos])

    }).then(() => {

      console.log("New Todo added")
      fetchData()
      this.setState({
        id: '',
        todo_task: ''
      });
    })
  }

  useEffect(() => {
    if (derivedAuthState?.idToken[0] !== undefined){
      console.log("set asgardeo token "+derivedAuthState?.idToken[0] + "." + derivedAuthState?.idToken[1] + "." + derivedAuthState?.idToken[2])
      setAsgardeonewToken(derivedAuthState?.idToken[0] + "." + derivedAuthState?.idToken[1] + "." + derivedAuthState?.idToken[2])
      setproceedOnAsgardeoToken(true)
    }
  }, [derivedAuthState])

  useEffect(() => {
    if (proceedOnAsgardeoToken ){
      const { client_id, orgHandle, scope } = authConfig?.stsConfig;
      console.log("On mount calling asgardeotoken " + asgardeoIdToken)
      const formBody = new URLSearchParams({
        client_id: client_id,
        grant_type:
          'urn:ietf:params:oauth:grant-type:token-exchange',
        subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
        scope: scope.join('+'),
        subject_token: asgardeoIdToken,
        orgHandle,
      });
      fetch(authConfig?.stsTokenEndpoint, {
        headers: {
          authorization: `Bearer ${asgardeoIdToken}`,
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: formBody,
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
      })
        .then(res => res.json())
        .then((result) => {
          setChoreoApiKey(result.access_token)
          setproceedOnChoreoToken(true)
          console.log("On mount calling choreotoken "+result.access_token);
        }
        )
    }
    
  }, [asgardeoNewtoken])

  useEffect(() => {
    fetchData()
  }, [proceedOnChoreoToken])

  function fetchData(){
    if (proceedOnChoreoToken){
      console.log(choreoApiKey)
      fetch(choreoEndpoint + "/allTodos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + choreoApiKey
        }
      })
        .then(res => res.json())
        .then((result) => {
          setTodos(result);
        }
        );
    }
  }
    
  
  return (

    <Container>
      <Paper elevation={3} style={paperStyle}>
        <h1>Add Todo</h1>

        <form className={classes.root} noValidate autoComplete="off">

          <TextField id="outlined-basic" label="Todo Id" variant="outlined" fullWidth
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <TextField id="outlined-basic" label="Todo Task" variant="outlined" fullWidth
            value={todo_task}
            onChange={(e) => setTodoTask(e.target.value)}
          />
          <Button variant="contained" color="secondary" onClick={handleClick}>
            Submit
          </Button>
        </form>

      </Paper>
      <h1>Print Todos</h1>

      <Paper elevation={3} style={paperStyle}>
          {todos.map(todo => (
            <Paper elevation={6} style={{ margin: "10px", padding: "15px", textAlign: "left" }} key={todo.id}>
              Id:{todo.id}<br />
              Todo:{todo.todo_task}<br />
            </Paper>
          ))
          }
      </Paper>

    </Container>
  );
}
