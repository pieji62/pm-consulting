---
name: workshop-deployment
description: Prepare and guide an authorized AI Website Workshop deployment through a private GitHub repository and Azure Static Web Apps with mandatory checks.
---

# Publish with authorization

## Inputs and prerequisites
Verified site, available owner and GitHub/Azure accounts configured personally.
Read docs/en/16-deployment.md. Creating accounts, repositories or resources needs
explicit consent; design approval is not deployment authorization.

## Procedure
1. Explain the separate product and website repositories.
2. Review evidence/report.md and npm start -- ready . . Explain pending human reviews.
3. Prepare reviewable commands/configuration. Obtain authorization before creating
   a private remote, pushing content, provisioning resources or spending money.
4. Follow guides 06, 07, 15 and 16 for accounts, MFA, Azure and deployment.
   Never read or paste tokens in chat. The owner configures the GitHub secret.
5. Use the included manual workflow. Never add Azure's automatic push deployment
   workflow. If a wizard created one, review its removal with the owner before
   enabling the token.
6. A person opens Actions > Publish with authorization > Run workflow, selects main,
   copies the reviewed full SHA and checks authorization. Each run verifies again
   and deploys only its passed artifact. Never trigger it without permission.
7. If publication was authorized, check the actual public URL. Record URL and date,
   configure SITE_URL for maintenance and retain provider evidence. Reading YAML
   never proves deployment. Environment protections depend on GitHub plan; the
   basic manual flow does not promise independent two-person approval.

## Outputs
Private website repository and prepared configuration; only when authorized and
executed, a public URL and provider execution evidence.

## Completion
The owner can open the published URL and inspect the successful Actions run.
Without accounts or authorization, provide exact outstanding steps marked NOT EXECUTED.

## Failures
Never retry spending or deployment blindly, commit credentials, disable tests or
run untrusted PR code with secrets. Continue through maintenance when appropriate.
