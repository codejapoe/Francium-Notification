import {initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from "firebase-admin/messaging";
import express from "express";
import cors from "cors";
import { Client, Databases, Query } from 'appwrite'

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
process.env.GOOGLE_APPLICATION_CREDENTIALS = "./francium-app-firebase-adminsdk-mu0n8-5a0b80b045.json";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
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

initializeApp({
    credential: cert("./francium-app-firebase-adminsdk-mu0n8-5a0b80b045.json"),
  projectId: 'francium-app',
});

// POST { 'username': 'example', 'userID': '123456asd' }
app.post("/follow", async function (req, res) {
    try {
        const username = req.body.username;
        const userID = req.body.userID;
        
        const res = await databases.listDocuments(
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

        const sendPromises = response.documents[0].fcm.map(token => 
            getMessaging().send({
                notification: {
                    title: "Francium",
                    body: username + " started following you.",
                    imageUrl: res.documents[0].profile
                },
                token: token,
            })
        );
        
        await Promise.all(sendPromises);
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

        const sendPromises = response.documents[0].fcm.map(token => 
            getMessaging().send({
                notification: {
                    title: "Francium",
                    body: username + " liked your post.",
                    imageUrl: "https://cloud.appwrite.io/v1/storage/buckets/images/files/icon/view?project=francium&mode=admin"
                },
                token: token,
            })
        );
        
        await Promise.all(sendPromises);
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

        const sendPromises = response.documents[0].fcm.map(token => 
            getMessaging().send({
                notification: {
                    title: "Francium",
                    body: username + " commented on your post.",
                    imageUrl: "https://cloud.appwrite.io/v1/storage/buckets/images/files/icon/view?project=francium&mode=admin"
                },
                token: token,
            })
        );
        
        await Promise.all(sendPromises);
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

        const sendPromises = response.documents[0].fcm.map(token => 
            getMessaging().send({
                notification: {
                    title: "Francium",
                    body: username + " reposted your post.",
                    imageUrl: "https://cloud.appwrite.io/v1/storage/buckets/images/files/icon/view?project=francium&mode=admin"
                },
                token: token,
            })
        );
        
        await Promise.all(sendPromises);
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

        const sendPromises = response.documents[0].fcm.map(token => 
            getMessaging().send({
                notification: {
                    title: "Francium",
                    body: username + " tagged you in their post.",
                    imageUrl: "https://cloud.appwrite.io/v1/storage/buckets/images/files/icon/view?project=francium&mode=admin"
                },
                token: token,
            })
        );
        
        await Promise.all(sendPromises);
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
        
        for (const favor of response.documents[0].favors) {
            const response2 = await databases.listDocuments(
                appwriteConfig.databaseID,
                appwriteConfig.userCollectionID,
                [
                    Query.equal('$id', favor)
                ]
            );
            
            if (response2.documents.length) {
                const tokenPromises = response2.documents[0].fcm.map(token => 
                    getMessaging().send({
                        notification: {
                            title: "Francium",
                            body: response.documents[0].username + " added a new post.",
                        imageUrl: "https://cloud.appwrite.io/v1/storage/buckets/images/files/icon/view?project=francium&mode=admin"
                        },
                        token: token,
                    })
                );
                allPromises.push(...tokenPromises);
            }
        }

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
        
        await Promise.all(allPromises);
        res.status(200).json({ message: "Successfully sent notification." });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to send notification.' });
    }
});
  
app.listen(3000, function () {
    console.log("Server started on port 3000");
});
