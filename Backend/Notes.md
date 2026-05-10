## 🏛️ Kairos ai — The Meaning

Kairos (καιρός) is an ancient Greek word meaning:

"The perfect, decisive moment — the right time to act"

It's different from Chronos (regular clock time). Kairos is that exact moment of clarity when everything aligns — like the instant you get the perfect answer to a question.

### Features

- Authentication System
- Chat with AI
- Chat History
- Message Storage
- AI with Internet Research Feature

### Data Models (Collection)

`User Model`

\_id  
username  
email  
password  
verified status => by default → False  
timestamps → created at/ updated at

`Chat Model`

\_id  
user  
title  
timestamps → created at/ updated at

`Message Model`  
\_id  
chat  
content  
role: [user, ai]


- And we will use nodemailer for its primary work which is to send emails.
- Nodemailer needs 4 things: Client ID, Client Secret, Refresh Token, Google User

user -> chat -> message