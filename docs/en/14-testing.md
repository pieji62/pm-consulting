# 14. Read the verification report

1. Ask: "Run workshop-verification and explain the results."
2. The agent runs npm.cmd run verify; open evidence/report.md.
3. PASSED means the check ran and did not detect the problem it targets. FAILED
   identifies a problem. NOT EXECUTED is never a positive result.
4. Read pending human reviews: facts, licensing, privacy and use by people with
   different accessibility needs.
5. A mandatory failure blocks readiness. The agent may attempt repairs twice,
   then must explain how to obtain help.

Checks cover pages, navigation, keyboard, mobile/tablet/desktop layouts, some
accessibility barriers, internal links, sizes, types, build, dependencies and
credential patterns. They do not prove absence of errors or secrets, measure
performance on every network or certify legal compliance.

Without a connection for dependency audit, the result fails or is not executed;
do not publish using an old report. Any source change invalidates earlier evidence.
Local readiness expires after 24 hours. Historical reports retain their original
filenames; new English runs write report.md.

> Screenshot pending: report showing an explained failure and a passed check.
