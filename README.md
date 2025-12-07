# Auto PR Bot - Frontend

A web interface for the Auto PR Bot, an AI-powered tool that automates pull request creation on open-source GitHub repositories.

## What This App Does

The Auto PR Bot allows you to:

1. **Specify a GitHub repository** you want to contribute to
2. **Describe the changes** you want to make using natural language
3. **Optionally add your GitHub username** to be added as a collaborator

The bot will then:
- Fork the target repository
- Create a new feature branch
- Use AI (OpenAI) to analyze and modify the code based on your prompt
- Commit the changes
- Create a pull request to the original repository
- Add you as a collaborator if you provided your username

## Configuration

The app uses environment variables for configuration:

- `NEXT_PUBLIC_API_ENDPOINT`: The AWS API Gateway endpoint URL for the backend Lambda function

## Related Project

- [Auto PR Bot Backend](https://github.com/stefali1-dev/auto-pr-bot) - The AWS Lambda backend service
