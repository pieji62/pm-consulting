# 8. Prepare Windows 11

Allow time before the workshop and use a stable connection. The installer requests
consent for each application. It does not create accounts or buy subscriptions.

## Simple Windows setup

1. Save the **ai-website-workshop-kit-0.3.0-windows.zip** supplied by your instructor.
2. Right-click it, choose **Extract All**, then open the extracted folder.
3. Double-click **Start Here.cmd** as an ordinary user. No commands are required.
4. Type **INSTALL** for the installations/downloads you approve. Windows and WinGet
   may also show consent or agreement prompts. Keep the window open until completion.
5. VS Code opens the workshop and **GETTING STARTED.md**. Install Codex and sign in
   manually, then create your own GitHub account and protect it with MFA.

The launcher checks the kit inventory before installation without needing Node.
It prepares VS Code, Git, the tested Node 24.18.0 version, locked dependencies and
Chromium. Codex and GitHub account creation remain manual. GitHub CLI is optional
for later deployment; it is not needed to create the first local site.

Missing WinGet requires App Installer from Microsoft Store or help from IT.
If blocked by device policy, seek help rather than disabling protections. Retain
setup messages/logs. Rerunning detects installed tools. A full installation on a
clean Windows machine still needs to be rehearsed by the instructor.

## Advanced/manual preparation

1. Extract the reviewed kit to your own folder, for example Documents/ai-website-workshop.
2. Open ordinary PowerShell in that folder, without Run as administrator.
3. To check without installing, run:

       powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\Setup-Workshop.ps1 -CheckOnly

4. Review the local script with the instructor. To install, repeat without CheckOnly.
   ExecutionPolicy Bypass affects that process only; it does not change Windows policy.
   Never use it for unknown scripts. On managed devices, ask IT for help.
5. Read each proposed application and type INSTALL only when you consent. WinGet uses
   the specified configured source and official installers. Windows may request
   permission for an individual application; do not elevate the entire agent.
6. Read the summary and evidence/setup-...log. Repeating skips available tools.
7. Restart VS Code after installation. Node 24 LTS must be available.
8. The installer uses the standard per-user Playwright browser cache, so a new
   terminal needs no browser-path configuration. Remove an old custom
   PLAYWRIGHT_BROWSERS_PATH from your own terminal only if it points elsewhere.

If WinGet is missing, install App Installer from Microsoft Store. Ask IT if
installation is restricted; never disable antivirus or other protections.
If npm.ps1 is blocked, use npm.cmd rather than changing global policies.

Manual preparation after installing Node 24, Git and VS Code (GitHub CLI is optional):

    npm.cmd ci --ignore-scripts
    npm.cmd --prefix templates/astro-static-site ci --ignore-scripts
    npx.cmd --prefix templates/astro-static-site --no-install playwright install chromium
    npm.cmd start

> Screenshot pending: setup summary with actual passed and pending items.
