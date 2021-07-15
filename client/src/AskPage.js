import React from "react";
import styled from "styled-components";
import Lower_header from "./Lower_header";
import BlueButton from "./BlueButton";
import Input from "./Input";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { useState, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import ReactTags from "react-tag-autocomplete";

const Container = styled.div`
  padding: 30px 20px;
`;

const QuestionBodyTextarea = styled.textarea`
  background: none;
  border: 1px solid #777;
  border-radius: 3px;
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  min-height: 200px;
  margin-bottom: 20px;
  color: #fff;
  font-family: inherit;
`;

const PreviewArea = styled.div`
  padding: 10px 20px;
  background: #444;
  border-radius: 5px;
  margin-bottom: 20px;
`;

function AskPage() {
  const reactTags = React.createRef();

  const [questionTitle, setQuestionTitle] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [redirect, setRedirect] = useState("");
  const [tags, setTags] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);

  function sendQuestion(ev) {
    ev.preventDefault();
    axios
      .post(
        "http://localhost:3030/questions",
        {
          title: questionTitle,
          content: questionBody,
          // tagIds: tags.map((tag) => tag.id),
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        setRedirect("/questions/" + response.data);
      });
  }

  function getTags() {
    axios.get("http://localhost:3030/tags").then((response) => {
      console.log(response.data); // 1
      setTagSuggestions(response.data);
    });
  }

  function onTagAddition(tag) {
    const chosenTags = tags;
    chosenTags.push(tag);
    setTags(chosenTags);
  }

  function onTagDelete(indexToDelete) {
    const newTags = [];
    for (let i = 0; i < tags.length; i++) {
      if (i !== indexToDelete) {
        newTags.push(tags[i]);
      }
    }
    setTags(newTags);
  }

  useEffect(() => {
    getTags();
  }, []);

  return (
    <Container>
      {redirect && <Redirect to={redirect} />}
      <Lower_header style={{ marginBottom: "20px" }}>
        Ask a public question
      </Lower_header>
      <form onSubmit={(ev) => sendQuestion(ev)}>
        <Input
          type="text"
          value={questionTitle}
          onChange={(e) => setQuestionTitle(e.target.value)}
          placeholder="Be specific and imagine you’re asking a question to another person"
        />
        <QuestionBodyTextarea
          value={questionBody}
          onChange={(e) => setQuestionBody(e.target.value)}
          placeholder="Include all the information someone would need to answer your question"
        />
        <PreviewArea>
          <ReactMarkdown remarkPlugins={[gfm]} children={questionBody} />
        </PreviewArea>

        <ReactTags
          ref={reactTags}
          tags={tags}
          suggestions={[
            { id: 1, Name: "php" },
            { id: 2, Name: "javascript" },
            { id: 3, Name: "node.js" },
            { id: 4, Name: "react.js" },
            { id: 5, Name: "express" },
          ]}
          onDelete={(ev) => onTagDelete(ev)}
          onAddition={(ev) => onTagAddition(ev)}
        />

        <BlueButton type={"submit"}>Review your question</BlueButton>
      </form>
    </Container>
  );
}

export default AskPage;
