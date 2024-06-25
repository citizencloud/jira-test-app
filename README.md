## SMART SUMMARIZER

### What is it

A very dumb jira plugin that generates a _summary_ of an issue based on the comment thread. Based on [this](https://developer.atlassian.com/platform/forge/build-jira-comments-summarizer-with-openai/) tutorial.

### Deploying

The app requires the ability to interact with openai interfaces, as such you must set the api key as an environment variable in the forge runtime.

```
forge variables set --encrypt OPEN_API_KEY your-key
```
