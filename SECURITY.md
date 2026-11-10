# Security policy

Applies to every repository in the `kaffeelisten` organisation.

## Reporting a vulnerability

**Do not open a public issue.** Use GitHub's private vulnerability reporting on the affected
repository – the **Security** tab, then **Report a vulnerability**. It opens a private thread
visible only to the maintainers.

If that is unavailable to you, open a public issue containing **only** the words "security report,
please make contact" and nothing else, and we will reach out privately.

We will acknowledge a report within **seven days** and tell you what we intend to do about it.
This is a two-person project rather than a company, so we will not promise a fix window we cannot
keep – but we will be honest about what we are doing and when.

## What we would especially like to hear about

Kaffeelisten holds personal data: the names of campus members, the company each belongs to, and a
record of what each person consumed. The things that worry us most:

- **Row-level security gaps** – any path by which an anonymous client reads or writes rows it
  should not.
- **Reaching an administrative endpoint without the PIN**, or bypassing the server-side check.
- **Leaking the service-role key** or any server-side secret into the client bundle.
- **Anything that lets one company see another company's consumption.**
- **Report or archive tampering** – months are meant to be immutable once archived.

## Out of scope

- Missing hardening headers with no demonstrated impact.
- Rate limiting on the member-facing flow. It is deliberately accountless and unauthenticated;
  that is the product, not an oversight.
- Reports generated solely by an automated scanner, with no analysis of what the finding means
  here.
- Anything requiring physical access to the tablet mounted on the campus wall. Someone standing at
  the coffee machine can already write whatever they like on a sheet of paper.

## Disclosure

Please give us **90 days** before publishing, or less by agreement if a fix lands sooner. We are
glad to credit you by name, or not, whichever you prefer.

## With thanks

People outside the project who reported something real, and what came of it. Credited by name
because the policy above offers it; anyone who would rather not be listed only has to say so.

| | |
|---|---|
| **Gianna Gonzales**, Perch Scan · 6 November 2026 | Found that the payment grid's query silently truncated once the window held more than 1,000 unarchived transactions, so it understated amounts owed. Correct, and the same pattern turned out to be in six other places, the month-end report among them – [kaffeelisten#62](https://github.com/kaffeelisten/kaffeelisten/issues/62). Fixed 10 November 2026 |

An automated scan found it, which the scope section above sets aside – but the report said what
the finding meant for this application rather than quoting a rule number, which is the part that
made it worth reading. That distinction is the one that matters to us.

## Please do not

Test against the live campus deployment. It holds real people's data and real consumption records.
Ask us and we will point you at an environment where breaking things costs nobody anything.
