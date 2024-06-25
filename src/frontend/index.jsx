import React, { useEffect, useState } from "react";
import ForgeReconciler, { Text } from "@forge/react";
import { invoke } from "@forge/bridge";

function buildPrompt(commentData) {
  const prompt =
    "You are responsible for producing concice summaries of Jira issues based on an aggregation of comments. Summarize the following data: " +
    commentData;
  return prompt;
}

const summarizeCommentThread = async () => {
  const commentsData = await invoke("getIssueComments");
  if (commentsData) {
    return await invoke("callOpenAI", {
      prompt: buildPrompt(commentsData),
    });
  }
};

const App = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    summarizeCommentThread().then(setData);
  }, []);

  return (
    <>
      <Text>{data ? data : "Generating summary..."}</Text>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
