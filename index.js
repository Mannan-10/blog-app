import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

const posts = []

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));

function Post (title, content){
    this.title = title;
    this.content = content;
    this.rawDate = new Date();
    this.date = this.rawDate.toLocaleDateString();
}

function addPost(title, content) {
    const post = new Post(title, content);
    posts.push(post);
}

function editPost(index, title, content) {
    posts[index] = new Post(title, content);
}

function deletePost(index) {
    posts.splice(index, 1);
}

app.get('/', (req, res) => {
    res.render('home.ejs', { posts: posts });
})

app.get('/view/:id', (req, res) => {
    const index = Number(req.params.id);
    const post = posts[index];
    // console.log(index);
    res.render('view.ejs', { postId : index, title: post.title, content: post.content });
})

app.get('/create', (req, res) => {
    res.render('create.ejs');
});

app.post('/delete/:id', (req, res) => {
    const index = Number(req.params.id);
    deletePost(index);
    res.redirect('/');
})

//Edit Post Routes
app.get('/edit/:id', (req, res) => {
    const index = Number(req.params.id);
    const post = posts[index];
    res.render('create.ejs', { postId : index, title: post.title, content: post.content });
});

app.post('/update/:id', (req, res) => {
    const index = Number(req.params.id);
    const title = req.body.title;
    const content = req.body.content;

    editPost(index, title, content);
    res.redirect('/');
})

app.post('/save', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;

    addPost(title, content);
    res.redirect('/');
});

app.get('/about', (req, res) => {
    res.render('about.ejs');
})

app.get('/contact', (req, res) => {
    res.render("contact.ejs");
})

app.listen(PORT, () => {
    addPost("The Rise and Fall of Daenerys Targaryen","Daenerys Targaryen’s journey in Game of Thrones is one of the most powerful and tragic arcs in the series. Beginning as a timid young girl sold into marriage, she grows into the “Mother of Dragons,” a liberator who dreams of breaking the wheel of tyranny. Along the way, she frees slaves, gains loyal followers, and believes deeply in her destiny to rule. However, as her power grows, so does her isolation. The loss of trusted allies and the constant struggle for the Iron Throne slowly push her toward cruelty in the name of justice. Her downfall reminds viewers that absolute power, even when driven by good intentions, can lead to devastating consequences.")

    addPost("Lessons of Power and Politics in Westeros", "Westeros is a land where power is rarely earned through honor alone. Game of Thrones masterfully portrays political strategy through characters like Tyrion Lannister, Littlefinger, and Varys, each using wit and manipulation instead of brute strength. Alliances shift quickly, and trust is often the most dangerous gamble of all.                    The series teaches that survival depends on adaptability and foresight. Those who fail to understand the political game—no matter how noble—often meet tragic ends. Through betrayal, war, and diplomacy, Game of Thrones offers timeless lessons about leadership, ambition, and the cost of playing the game of thrones.")
   
    console.log("Server is running on http://localhost:" + PORT);
});