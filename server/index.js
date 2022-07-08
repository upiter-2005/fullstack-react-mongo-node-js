import express from 'express';
import multer from 'multer';
import cors from 'cors';
import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { PostController, UserController } from './controllers/index.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
mongoose
  .connect(
    'mongodb+srv://upiter-2005:20081991@mongotest.kraasqz.mongodb.net/?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB OK!!'))
  .catch((err) => console.log(err));

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send('Hello hacker!123123123');
});

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);

app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server ok');
});
