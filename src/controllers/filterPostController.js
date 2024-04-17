const path = require('path');
const Post = require(path.resolve(__dirname, '..', 'models', 'postModel'));

class FilterPostsController {
    async filterPosts(req, res) {
        const { text } = req.params;

        try {
            const posts = await Post.filter(text);
            console.log('Consulta bem-sucedida. Posts encontrados:', posts);
            return res.status(200).send(posts);

        } catch (error) {
            console.error('Erro ao buscar os posts:', error);
            res.status(500).json({
                errors: ['Erro ao buscar os posts!']
            });
        }
    };

    async filterAllPosts(req, res) {
        try {
            const posts = await Post.readAll();
            console.log('Consulta bem-sucedida. Posts encontrados:', posts);
            return res.status(200).send(posts);

        } catch (error) {
            console.error('Erro ao buscar os posts:', error);
            res.status(500).json({
                errors: ['Erro ao buscar os posts!']
            });
        }
    };
}

module.exports = new FilterPostsController();
