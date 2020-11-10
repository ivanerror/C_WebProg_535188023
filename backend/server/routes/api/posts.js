const express = require('express');
const mongodb = require('mongodb');

const router =  express.Router();

// Get Post 
router.get('/', async (req,res) => {
    const posts = await loadPostsCollection();
    res.send(await posts.find({}).toArray());
});

// Add Post
router.delete('/:id', async (req, res) => {
    const posts = await loadPostsCollection();
    await posts.deleteOne({_id: new mongodb.ObjectID(req.params.id)})
    res.status(200).send();
});

router.post('/', async (req, res) => {
    const posts = await loadPostsCollection();
    await posts.insertOne({
        text: req.body.text,
        createdAt: new Date()
    });
    res.status(201).send();
});


// Delete Post


async function loadPostsCollection() {
    const client = await mongodb.MongoClient.connect
    ('mongodb+srv://insframe123:superadmin@insframe.ogloo.mongodb.net/Insframe?retryWrites=true&w=majority', {
        useNewUrlParser: true
    })

    return client.db('Insframe').collection('posts');


}

module.exports = router;

