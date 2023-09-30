# jot (Demo)
Simplify Clinical Notetaking

## Demo
A demo of the web application is available [here](https://jotapp-demo.vercel.app/).

Email: user@jotappdemo.app

Password: demoPassword-123

This is not the production database, web server, or application. Additionally, SQL write calls are blocked, so added statements will not be saved for new sessions.

## Client Purpose
Jot is a web application to simplify and automate the session notetaking process for a mental health clinic. This is completed by using sentence snippets to build portions of the session note, and allowing the note contents to be copied into a practice client database (Examples include SimplePractice & TherapyNotes). Most importantly, this application is HIPAA compliant, since all PII and PHI are stored in the client session, never sent to the server, and removed after the session ends.

## Individual Purpose
This is my first web application, and first time using Javascript. I decided this would be a great opportunity to learn web development and went with a No Framework approach to understand the basics. In the future, I will be looking into React, Svelte, HTMX, and other methods of simplifying my process.

## Structure, Stack and Technologies
This application can be broken down into three main portions:
1. MySQL Database: Deloyed using PlanetScale, the DB stores all sentence stems, snippets, statements, and relations between those statements.
2. Python Flask Frontend: Deployed using Vercel, I chose Flask as my web server because I am very familiar with Python, Javascript on the frontend was already going to be a big undertaking, and finally, I knew the web server was mostly going to be an intermediary between the database and the frontend.
3. No Framework Javascript Frontend: The frontend was written entirely in raw Javascript, HTML, and CSS. I began by using HTML to complete as much of the project as possible, then moved to CSS, and finally to Javascript. Naturally, I had to rewrite everything once, after I got a better feel for things. Using a framework for future projects should make this less painful.

## Lessons Learned
- Javascript: The most important thing I learned was Javascript. My most comfortable language was Java, and I haven't had major problems with dynamic types in Python, but between the dynamic types and DOM, I was making many mistakes. It was good to have the mind stretched.
- JSON Structure: About halfway through the project I realized my DB query, sent to the client as JSON, was not flexible enough for all the statement types. This meant I had to overhaul and rewrite how the query is processed on the backend and retrieved on the frontend as well.
- Git: This was the first application I built where version control and change management was important. Previously, I would only use Git to publish final projects, since most of them were week-long projects that did not include major changes; however, for this project maintaining control, especially as entire rewrites were taking place was mandatory.


## Misc Notes:
- Jinja was used to help fuse Flask and the Javascript frontend together.
- The Pandas Package was used on the backend to simplify the SQL query parsing. It made visualizing data WAY easier.
- Planetscale MySQL was a good option, however, it has a ton of weird 'quirks'. Some examples include no FULL JOINS and no FOREIGN KEY CONSTRAINTS. While manageable, I do wonder if these problems would be bigger on larger projects.

## Security
The client only connects to the db in 3 circumstances:
1. Login
2. Choosing a Note
3. Adding Statements

At all other times, the application is not communicating with the server, which is important to maintain HIPAA compliance. If PII or PHI are not being shared with the server, we do not have to think about how to protect the server and database for PII and PHI.

The client only has read permissions for Login and Choosing a Note. The client only has write permissions for Adding Statements, to mitigate possible security issues. Additionally, Database Requests from the client are filtered for SQL injection protection. For example, If the Database only can recieve a 1-2 digit number the server will limit the Request to a 1-2 digit number.

## Roadmap:
1. Authentication: While the current implementation is secure, I would really prefer future versions just to user Oauth so I don't have to think about it.
2. Quality of Life: It would be nice to be able to Delete Statements, Export Notes as PDFs, and Expand Search capabilities. However, these changes will require client approval.
