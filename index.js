import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from "firebase-admin/messaging";
import express from "express";
import cors from "cors";
import { Client, Databases, Query } from 'appwrite'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

var serviceAccount = require("./francium-app-firebase-adminsdk-mu0n8-a588c80e12.json");

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://francium-app-default-rtdb.firebaseio.com"
});

const appwriteConfig = {
    url: 'https://cloud.appwrite.io/v1',
    projectId: 'francium',
    databaseID: 'francium',
    userCollectionID: 'users',
    postCollectionID: 'posts',
    commentCollectionID: 'comments',
    notificationCollectionID: 'notifications',
}

const client = new Client();

client.setEndpoint(appwriteConfig.url);
client.setProject(appwriteConfig.projectId);

const databases = new Databases(client);

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://francium-app.web.app",
  })
);

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
});

// POST { 'username': 'example', 'userID': '123456asd' }
app.post("/follow", async function (req, res) {
    try {
        const username = req.body.username;
        const userID = req.body.userID;
        
        const response0 = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.userCollectionID,
            [
                Query.equal('username', username)
            ]
        );

        const response = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.userCollectionID,
            [
                Query.equal('$id', userID)
            ]
        );

        if (!response.documents.length) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const validTokens = [];
        const sendPromises = response.documents[0].fcm.map(async token => {
            try {
                await getMessaging().send({
                    notification: {
                        title: "New Follower",
                        body: username + " started following you.",
                        imageUrl: response0.documents[0].profile
                    },
                    token: token,
                });
                validTokens.push(token);
            } catch (error) {
                console.error('Error sending notification to token:', token, error);
                return null;
            }
        });
        
        await Promise.all(sendPromises);

        // Update FCM tokens if any were invalid
        if (validTokens.length !== response.documents[0].fcm.length) {
            try {
                await databases.updateDocument(
                    appwriteConfig.databaseID,
                    appwriteConfig.userCollectionID,
                    userID,
                    { fcm: validTokens }
                );
            } catch (error) {
                console.error('Error updating FCM tokens:', error);
            }
        }
        res.status(200).json({ message: "Successfully sent notification." });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to send notification.' });
    }
});

// POST { 'username': 'example', 'userID': '123456asd' }
app.post("/like", async function (req, res) {
    try {
        const username = req.body.username;
        const userID = req.body.userID;
        const response = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.userCollectionID,
            [
                Query.equal('$id', userID)
            ]
        );

        if (!response.documents.length) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const validTokens = [];
        const sendPromises = response.documents[0].fcm.map(async token => {
            try {
                await getMessaging().send({
                    notification: {
                        title: "New Notification",
                        body: username + " liked your post.",
                    },
                    token: token,
                });
                validTokens.push(token);
            } catch (error) {
                console.error('Error sending notification to token:', token, error);
                return null;
            }
        });
        
        await Promise.all(sendPromises);

        // Update FCM tokens if any were invalid
        if (validTokens.length !== response.documents[0].fcm.length) {
            try {
                await databases.updateDocument(
                    appwriteConfig.databaseID,
                    appwriteConfig.userCollectionID,
                    userID,
                    { fcm: validTokens }
                );
            } catch (error) {
                console.error('Error updating FCM tokens:', error);
            }
        }
        
        res.status(200).json({ message: "Successfully sent notification." });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to send notification.' });
    }
});

// POST { 'username': 'example', 'userID': '123456asd' }
app.post("/comment", async function (req, res) {
    try {
        const username = req.body.username;
        const userID = req.body.userID;
        const response = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.userCollectionID,
            [
                Query.equal('$id', userID)
            ]
        );

        if (!response.documents.length) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const validTokens = [];
        const sendPromises = response.documents[0].fcm.map(async token => {
            try {
                await getMessaging().send({
                    notification: {
                        title: "New Notification",
                        body: username + " commented on your post.",
                    },
                    token: token,
                })
                validTokens.push(token);
            } catch (error) {
                console.error('Error sending notification to token:', token, error);
                return null;
            }
        });
        
        await Promise.all(sendPromises);

        // Update FCM tokens if any were invalid
        if (validTokens.length !== response.documents[0].fcm.length) {
            try {
                await databases.updateDocument(
                    appwriteConfig.databaseID,
                    appwriteConfig.userCollectionID,
                    userID,
                    { fcm: validTokens }
                );
            } catch (error) {
                console.error('Error updating FCM tokens:', error);
            }
        }
        res.status(200).json({ message: "Successfully sent notification." });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to send notification.' });
    }
});

// POST { 'username': 'example', 'userID': '123456asd' }
app.post("/repost", async function (req, res) {
    try {
        const username = req.body.username;
        const userID = req.body.userID;
        const response = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.userCollectionID,
            [
                Query.equal('$id', userID)
            ]
        );

        if (!response.documents.length) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const validTokens = [];
        const sendPromises = response.documents[0].fcm.map(async token => {
            try {
                await getMessaging().send({
                    notification: {
                        title: "New Notification",
                        body: username + " reposted your post.",
                    },
                    token: token,
                });
                validTokens.push(token);
            } catch (error) {
                console.error('Error sending notification to token:', token, error);
                return null;
            }
        });
        
        await Promise.all(sendPromises);

        // Update FCM tokens if any were invalid
        if (validTokens.length !== response.documents[0].fcm.length) {
            try {
                await databases.updateDocument(
                    appwriteConfig.databaseID,
                    appwriteConfig.userCollectionID,
                    userID,
                    { fcm: validTokens }
                );
            } catch (error) {
                console.error('Error updating FCM tokens:', error);
            }
        }
        res.status(200).json({ message: "Successfully sent notification." });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to send notification.' });
    }
});

// POST { 'username': 'example', 'userID': '123456asd' }
app.post("/tag", async function (req, res) {
    try {
        const username = req.body.username;
        const userID = req.body.userID;
        const response = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.userCollectionID,
            [
                Query.equal('$id', userID)
            ]
        );

        if (!response.documents.length) {
            return res.status(404).json({ error: 'User not found.' });
        }
        
        const validTokens = [];
        const sendPromises = response.documents[0].fcm.map(async token => {
            try {
                await getMessaging().send({
                    notification: {
                        title: "New Notification",
                        body: username + " tagged you in their post.",
                    },
                    token: token,
                });
                validTokens.push(token);
            } catch (error) {
                console.error('Error sending notification to token:', token, error);
                return null;
            }
        });
        
        await Promise.all(sendPromises);

        // Update FCM tokens if any were invalid
        if (validTokens.length !== response.documents[0].fcm.length) {
            try {
                await databases.updateDocument(
                    appwriteConfig.databaseID,
                    appwriteConfig.userCollectionID,
                    userID,
                    { fcm: validTokens }
                );
            } catch (error) {
                console.error('Error updating FCM tokens:', error);
            }
        }
        res.status(200).json({ message: "Successfully sent notification." });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to send notification.' });
    }
});

// POST { 'username': 'example' }
app.post("/post", async function (req, res) {
    try {
        const username = req.body.username;
        const notificationID = req.body.notificationID;
        const response = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.userCollectionID,
            [
                Query.equal('username', username)
            ]
        );

        if (!response.documents.length) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const allPromises = [];
        const tokenUpdates = new Map(); // Track tokens for each user
        
        for (const favor of response.documents[0].favors) {
            const response2 = await databases.listDocuments(
                appwriteConfig.databaseID,
                appwriteConfig.userCollectionID,
                [
                    Query.equal('$id', favor)
                ]
            );
            
            if (response2.documents.length) {
                const validTokens = [];
                const tokenPromises = response2.documents[0].fcm.map(async token => {
                    try {
                        await getMessaging().send({
                            notification: {
                                title: "New Notification",
                                body: response.documents[0].username + " added a new post.",
                            },
                            token: token,
                        });
                        validTokens.push(token);
                    } catch (error) {
                        console.error('Error sending notification to token:', token, error);
                        return null;
                    }
                });
                allPromises.push(...tokenPromises);
                
                // Store valid tokens for this user if any tokens were invalid
                if (validTokens.length !== response2.documents[0].fcm.length) {
                    tokenUpdates.set(favor, validTokens);
                }
            }
        }

        await Promise.all(allPromises);

        // Update invalid tokens for all affected users
        for (const [userId, validTokens] of tokenUpdates) {
            try {
                await databases.updateDocument(
                    appwriteConfig.databaseID,
                    appwriteConfig.userCollectionID,
                    userId,
                    { fcm: validTokens }
                );
            } catch (error) {
                console.error('Error updating FCM tokens for user:', userId, error);
            }
        }

        // Handle followers notifications
        for (const follower of response.documents[0].followers) {
            const response2 = await databases.listDocuments(
                appwriteConfig.databaseID,
                appwriteConfig.userCollectionID,
                [
                    Query.equal('$id', follower)
                ]
            );
            
            if (response2.documents.length) {
                const currentNotifications = response2.documents[0].notifications || [];
                await databases.updateDocument(
                    appwriteConfig.databaseID,
                    appwriteConfig.userCollectionID,
                    follower,
                    {
                        notifications: [notificationID, ...currentNotifications]
                    }
                );
            }
        }
        res.status(200).json({ message: "Successfully sent notification." });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to send notification.' });
    }
});
  
app.listen(80, function () {
    console.log("Server started on port 80");
});
