import Resolver from "@forge/resolver";
import api, { route } from "@forge/api";
import OpenAI from "openai";

const resolver = new Resolver();

// singleton openai client. api key is set from runtime env variables
const openAiClient = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

resolver.define("getIssueComments", async ({ context }) => {
  // call jira apis to get current issue's comments
  const commentsData = await api
    .asApp()
    .requestJira(
      route`/rest/api/3/issue/${context.extension.issue.key}/comment`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

  // https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-group-issue-comments
  //

  const responseData = await commentsData.json();
  const jsonData = responseData.comments;

  let texts = [];

  // get all text from comment into the texts slice

  await jsonData.map((comment) => {
    if (comment.body && comment.body.content) {
      comment.body.content.map((contentItem) => {
        if (contentItem.type === "paragraph" && contentItem.content) {
          contentItem.content.map((textItem) => {
            if (textItem.type === "text" && textItem.text) {
              texts.push(textItem.text);
            }
          });
        }
      });
    }
  });

  return texts.join(" ");
});

/**
 * resolver definition that makes an external callout to an openai chat completion interface.
 * ref: https://platform.openai.com/docs/api-reference/making-requests
 */
resolver.define("callOpenAI", async ({ payload, context }) => {
  const response = await openAiClient.chat.completions.create({
    model: "gpt-3.5-turbo",
    n: 1,
    messages: [
      {
        role: "user",
        content: payload.prompt,
      },
    ],
  });

  return response.choices[0].message.content;
});

export const handler = resolver.getDefinitions();
