/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { BasicUserInfo, useAuthContext } from "@asgardeo/auth-react";
import { FunctionComponent, ReactElement } from "react";
import ReactJson from "react-json-view";
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
/**
 * Decoded ID Token Response component Prop types interface.
 */
interface AuthenticationResponsePropsInterface {
    /**
     * Derived Authenticated Response.
     */
    derivedResponse?: any;
}

export interface DerivedAuthenticationResponseInterface {
    /**
     * Response from the `getBasicUserInfo()` function from the SDK context.
     */
    authenticateResponse: BasicUserInfo;
    /**
     * ID token split by `.`.
     */
    idToken: string[];
    /**
     * Decoded Header of the ID Token.
     */
    decodedIdTokenHeader: Record<string, unknown>;
    /**
     * Decoded Payload of the ID Token.
     */
    decodedIDTokenPayload: Record<string, unknown>;
}

/**
 * Displays the derived Authentication Response from the SDK.
 *
 * @param {AuthenticationResponsePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const Todo: FunctionComponent<AuthenticationResponsePropsInterface> = (
    props: AuthenticationResponsePropsInterface
): ReactElement => {
    const { state } = useAuthContext();
    const {
        derivedResponse
    } = props;

    const paperStyle = { padding: '50px 20px', width: 600, margin: "20px auto" }
  const [id, setId] = useState('')
  const [todo_task, setTodoTask] = useState('')
  const [todos, setTodos] = useState([])
  // const [asgardeoIdToken, setAsgardeoIdToken] = useState(derivedResponse?.idToken)
  const [choreoApiKey, setChoreoApiKey] = useState('')
  const stsTokenEndpoint = "https://sts.choreo.dev/oauth2/token"
  const asgardeoIdToken = derivedResponse?.idToken[0] + "." + derivedResponse?.idToken[1] + "." + derivedResponse?.idToken[2]
  const classes = useStyles();

  const handleClick = (e) => {
    e.preventDefault()
    const todos = { id, todo_task }
    console.log("printing todos before saveTodos")
    console.log(todos)
    fetch("https://55e3a8f2-7665-4bcd-aa11-76dfd803a326-prod.e1-us-east-azure.choreoapis.dev/vytw/todo-api/1.0.0/saveTodos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "eyJraWQiOiJnYXRld2F5X2NlcnRpZmljYXRlX2FsaWFzIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI0YzFiMjc3MC1jOWFjLTQ5YWEtYTVlYy0wOGQ5MDAxNGU5NWJAY2FyYm9uLnN1cGVyIiwiaXNzIjoiaHR0cHM6XC9cL3N0cy5jaG9yZW8uZGV2OjQ0M1wvb2F1dGgyXC90b2tlbiIsImtleXR5cGUiOiJQUk9EVUNUSU9OIiwic3Vic2NyaWJlZEFQSXMiOlt7InN1YnNjcmliZXJUZW5hbnREb21haW4iOm51bGwsIm5hbWUiOiJUT0RPIEFwaSIsImNvbnRleHQiOiJcLzU1ZTNhOGYyLTc2NjUtNGJjZC1hYTExLTc2ZGZkODAzYTMyNlwvdnl0d1wvdG9kby1hcGlcLzEuMC4wIiwicHVibGlzaGVyIjoiY2hvcmVvX3Byb2RfYXBpbV9hZG1pbiIsInZlcnNpb24iOiIxLjAuMCIsInN1YnNjcmlwdGlvblRpZXIiOm51bGx9XSwiZXhwIjoxNjY3MjYyOTcyLCJ0b2tlbl90eXBlIjoiSW50ZXJuYWxLZXkiLCJpYXQiOjE2NjcyMDI5NzIsImp0aSI6ImNhOTZhNTUxLTljZGUtNDVhMi1hY2U4LWM1YzM2MGY0NzQ5NiJ9.kyBcuC230QQ5jlesxICF7PVxPANNP1dshEWbm9QSbah3AIQnQU9_nUI6-BKQ2OsdWvFow03WvSvrQI9oS7tv_bpFN4V1pMJ9K0rBMCi6WSIilMCSS08J6wtvUxgzjnwS59jQYmQd7m9YfuDMRnISVvikhzIDSx4DbCQAdrsWz3YgXiQnSM1bBPE76xeG-mN84uFLy0ryy0usIrizqPVyydxAFaWvv2A6G-RLYzmLJkM85weKyQCw5BIJHQkHOf6YyxkOlCCN3pj0Wf72ULeIWQGI8ay7arlvsmZ8KZILMCOP_2Gb2R357RxH8GOGITyiq8aVQkgo6oStzcxTO2lS33J3tMVFcG_XtnWgrLSTphlIs67b8Ddu48U8XHEfLSTR5ZEBvcuthGkYA-4dZfhVYPtzRanRsXBerT0XtNY2RyexM4OkbNOlFIXfVwMJOdtgkaoesTXyRkkrtSVWZwflTBlvZpMLh_a7DOD15WNAAnQDRiihIvDNk9JOpbZ6j9fFvX5QAzI5e9YEYn1Bz1zYFtoVdN1qIEP-3EkV9nFQmzxNiqiTzRxrP91J-uwIfIut_kApSXNTOpVXQKi3DF3OnBT1Ugaje8pFPpCvyEasQkt-EbyjEl9WwJX9K9fX6fuNheTsWP44CXMYIHVW3Y5VGVOkE1w06DnmRdPPiWh02vU"
      },
      body: JSON.stringify(todos)

    }).then(() => {
      console.log("New Todo added")
    })
  }

  useEffect(() => {
    (async () => {
      // setIsChoreoTokenLoading(true);
      const { client_id, orgHandle, scope } = authConfig?.stsConfig;
      const formBody = new URLSearchParams({
        client_id: client_id,
        grant_type:
          'urn:ietf:params:oauth:grant-type:token-exchange',
        subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
        scope: scope.join('+'),
        subject_token: asgardeoIdToken,
        orgHandle,
      });
      try {
        const response = await fetch(stsTokenEndpoint, {
          headers: {
            authorization: `Bearer ${asgardeoIdToken}`,
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: formBody,
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
        });
        if (!response.ok) {
          console.error(response);
        } else {
          const data = await response.json();
          console.log("printing access token")
          console.log(data.access_token)
        }
      } catch (error) {
        console.error(error);
      } 
    })();

  }, []);


  useEffect(() => {
    fetch("https://55e3a8f2-7665-4bcd-aa11-76dfd803a326-prod.e1-us-east-azure.choreoapis.dev/vytw/todo-api/1.0.0/allTodos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "eyJraWQiOiJnYXRld2F5X2NlcnRpZmljYXRlX2FsaWFzIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI0YzFiMjc3MC1jOWFjLTQ5YWEtYTVlYy0wOGQ5MDAxNGU5NWJAY2FyYm9uLnN1cGVyIiwiaXNzIjoiaHR0cHM6XC9cL3N0cy5jaG9yZW8uZGV2OjQ0M1wvb2F1dGgyXC90b2tlbiIsImtleXR5cGUiOiJQUk9EVUNUSU9OIiwic3Vic2NyaWJlZEFQSXMiOlt7InN1YnNjcmliZXJUZW5hbnREb21haW4iOm51bGwsIm5hbWUiOiJUT0RPIEFwaSIsImNvbnRleHQiOiJcLzU1ZTNhOGYyLTc2NjUtNGJjZC1hYTExLTc2ZGZkODAzYTMyNlwvdnl0d1wvdG9kby1hcGlcLzEuMC4wIiwicHVibGlzaGVyIjoiY2hvcmVvX3Byb2RfYXBpbV9hZG1pbiIsInZlcnNpb24iOiIxLjAuMCIsInN1YnNjcmlwdGlvblRpZXIiOm51bGx9XSwiZXhwIjoxNjY3MjYyOTcyLCJ0b2tlbl90eXBlIjoiSW50ZXJuYWxLZXkiLCJpYXQiOjE2NjcyMDI5NzIsImp0aSI6ImNhOTZhNTUxLTljZGUtNDVhMi1hY2U4LWM1YzM2MGY0NzQ5NiJ9.kyBcuC230QQ5jlesxICF7PVxPANNP1dshEWbm9QSbah3AIQnQU9_nUI6-BKQ2OsdWvFow03WvSvrQI9oS7tv_bpFN4V1pMJ9K0rBMCi6WSIilMCSS08J6wtvUxgzjnwS59jQYmQd7m9YfuDMRnISVvikhzIDSx4DbCQAdrsWz3YgXiQnSM1bBPE76xeG-mN84uFLy0ryy0usIrizqPVyydxAFaWvv2A6G-RLYzmLJkM85weKyQCw5BIJHQkHOf6YyxkOlCCN3pj0Wf72ULeIWQGI8ay7arlvsmZ8KZILMCOP_2Gb2R357RxH8GOGITyiq8aVQkgo6oStzcxTO2lS33J3tMVFcG_XtnWgrLSTphlIs67b8Ddu48U8XHEfLSTR5ZEBvcuthGkYA-4dZfhVYPtzRanRsXBerT0XtNY2RyexM4OkbNOlFIXfVwMJOdtgkaoesTXyRkkrtSVWZwflTBlvZpMLh_a7DOD15WNAAnQDRiihIvDNk9JOpbZ6j9fFvX5QAzI5e9YEYn1Bz1zYFtoVdN1qIEP-3EkV9nFQmzxNiqiTzRxrP91J-uwIfIut_kApSXNTOpVXQKi3DF3OnBT1Ugaje8pFPpCvyEasQkt-EbyjEl9WwJX9K9fX6fuNheTsWP44CXMYIHVW3Y5VGVOkE1w06DnmRdPPiWh02vU"
      }
    })
      .then(res => res.json())
      .then((result) => {
        setTodos(result);
      }
      )
  }, [])



    return (
        <>
        <Container>
      <Paper elevation={3} style={paperStyle}>
        <h1 style={{ color: "blue" }}><u>Add Todo</u></h1>

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
      <h1>Todos</h1>

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
    </>
    );
};
