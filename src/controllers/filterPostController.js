const path = require('path');
const Post = require(path.resolve(__dirname, '..', 'models', 'postModel'));

class FilterPostsController {
    async filterPosts(req, res) {
        const { text } = req.params;
        try {
            const posts = await Post.filter(text);
            console.log('Consulta bem-sucedida. Posts encontrados:', posts);
            const arr = posts.map(post => {
                return {
                id: post._id,
                title: post.title,
                content: post.content,
                likes: post.likes,
                comments: post.comments,
                score: post.score,
                user: post.user
                };
            });
            return res.status(200).send(arr);

        } catch (error) {
            console.error('Erro ao buscar os posts:', error);
            res.status(500).json({
                errors: ['Erro ao buscar os posts!']
            });
        }
    };

    async readByUserAndText(req, res) {
        const { user, text } = req.params;

        try {
            const posts = await Post.readByUserAndText(user, text);
            console.log('Consulta bem-sucedida. Posts encontrados:', posts);
            const arr = posts.map(post => {
                return {
                id: post._id,
                title: post.title,
                content: post.content,
                likes: post.likes,
                comments: post.comments,
                score: post.score,
                user: post.user
                };
            });
            return res.status(200).send(arr);

        } catch (error) {
            console.error('Erro ao buscar os posts:', error);
            res.status(500).json({
                errors: ['Erro ao buscar os posts!']
            });
        }
    }

    async readByUser(req, res) {
        const { user } = req.params;
        try {
            const posts = await Post.readByUser(user);
            console.log('Consulta bem-sucedida. Posts encontrados:', posts);
            const arr = posts.map(post => {
                return {
                id: post._id,
                title: post.title,
                content: post.content,
                likes: post.likes,
                comments: post.comments,
                score: post.score,
                user: post.user
                };
            });
            return res.status(200).send(arr);

        } catch (error) {
            console.error('Erro ao buscar os posts:', error);
            res.status(500).json({
                errors: ['Erro ao buscar os posts!']
            });
        }
    }

    async filterAllPosts(req, res) {
        try {
            const posts = await Post.readAll();
            const arr = posts.map(post => {
                return {
                id: post._id,
                title: post.title,
                content: post.content,
                likes: post.likes,
                comments: post.comments,
                score: post.score,
                user: post.user
                };
            });
            console.log(arr)
            return res.status(200).json(arr);
            } catch (err) {
            console.log(err);
            return res.status(500).json({
                errors: [{
                type: ErrorType.SERVER,
                message: 'Ocorreu um erro no servidor!'
                }]
            });
            }
    };
}

module.exports = new FilterPostsController();
