# 16. Publish with your authorization

This makes dist files public even if the repository is private. You must authorize
accounts, resources and the first deployment.

1. Review the preview/report; confirm text, rights and public contact information.
2. Ask the agent to prepare a separate site repository and show which files will
   be uploaded. Exclude test logs, keys and .env files.
3. Authorize Private repository creation and push only when ready. Complete
   gh auth login personally if needed; the agent need not see tokens. Keep main
   as the primary branch.
4. In Azure choose Static Web Apps > Create, then the authorized subscription,
   resource group, name and Free plan. Confirm fields before creating.
5. Use Other as source where available to retain manual control. The included
   workflow connects through a secret. Azure's GitHub wizard may create a workflow
   that publishes on every push: review and remove that automatic workflow before
   enabling deployment. Only the included manual deployment flow should be active.
6. Open Overview > Manage deployment token. Copy it directly to GitHub without
   passing it through chat or saving it in files.
7. In the site repository open Settings > Secrets and variables > Actions >
   New repository secret. Name it AZURE_STATIC_WEB_APPS_API_TOKEN and enter the token.
   Restrict write access; do not grant broad Actions permissions.
8. Ask the agent for the full 40-character SHA of the reviewed main revision.
   It is an identifier, not a password.
9. Open Actions > Publish with authorization > Run workflow. Select main, paste
   that SHA, check authorization and run. This authorizes this specific publication.
10. Verification runs without the deployment secret. Only after passing does
    another job send the same verified artifact to Azure without rebuilding.
11. Wait for success, then open Azure Overview's site URL and test navigation,
    mobile layout and contact. Store the URL as SITE_URL under repository
    Settings > Secrets and variables > Actions > Variables.

Do not bypass failed checks through another wizard. For upload failures, review
secret name, resource and token without revealing the value. The first real Azure
deployment still requires a rehearsal; YAML alone is not integration evidence.
Generating a site never creates resources.

Manual consent is not independent two-person approval. Required reviewers and
environment secrets depend on plan and repository visibility; seek assessment for
enterprise controls. A local authorize command, if used, requires the exact phrase
AUTHORIZE PUBLICATION and does not itself send files.

> Screenshot pending: Run workflow with a fictional revision; never capture tokens.

References: [own build and upload](https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration),
[deployment tokens](https://learn.microsoft.com/en-us/azure/static-web-apps/deployment-token-management),
[GitHub protections](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments).
