const PORT = 8000

const express = require('express')
const {MongoClient} = require('mongodb')
const { v4: uuidv4} = require('uuid')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcrypt')
const { mongo } = require('mongoose')

const uri = 'mongodb+srv://ewanmaclean:sKuz1tzOY6Q9nGZT@cluster0.tharoww.mongodb.net/?retryWrites=true&w=majority'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req,res) => {
    res.json('Hello to my app')
})

// Sending Data, it is a POST request
app.post('/signup', async(req,res) => {
    const client = new MongoClient(uri)
    console.log(req.body)
    const { email, password } = req.body
    const generatedUserId = uuidv4()
    const hashedpassword = await bcrypt.hash(password, 10)

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const existingUser = await users.findOne({email})

        if (existingUser) {
            return res.status(409).send('User already exists. Please login')
        }

        const sanitizedEmail = email.toLowerCase()

        const data = {
            user_id: generatedUserId,
            email: sanitizedEmail,
            hashed_password: hashedpassword
        }

        const insertedUser = await users.insertOne(data)

        const token = jwt.sign(insertedUser, sanitizedEmail, {
            expiresIn: 60 * 24
        })

        res.status(201).json({token, userId: generatedUserId})
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }
})

// LOGIN

app.post('/login' , async (req,res)  => {
    const client = new MongoClient(uri)
    const {email,password} = req.body

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const user = await users.findOne({email})

        const correctPassword = await bcrypt.compare(password, user.hashed_password)

        if (user && correctPassword) {
            const token = jwt.sign(user, email, {
                expiresIn: 60 * 24
            })
            res.status(201).json({token, userId: user.user_id})
        }
        res.status(400).send('Invalid cred')
    }
    catch (err) {
        console.log(err)
    }
})

// UPDATE USER

app.put('/user', async (req,res) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        console.log(formData)

        const query = { user_id: formData.user_id }
        const updateDocument = {
            $set : {
                first_name: formData.first_name,
                gender_interest: formData.gender_interest,
                about: formData.about,  
                matches: formData.matches
            }
        }
        const insertedUser = await users.updateOne(query, updateDocument)
        res.send(insertedUser)
    } finally {
        await client.close()
    }
})

app.get('/users', async(req,res) => {
    const client = new MongoClient(uri)

    try{
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')
        
        const returnedUsers = await users.find().toArray()
        res.send(returnedUsers)
    } finally
    {
        await client.close()
    }
})



app.listen(PORT, () => console.log('Server running on PORT ' + PORT))

