const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');

const srcPath = './src/';
const publicPath = './public/';

const postTemplate = fs.readFileSync(path.join(srcPath, 'essays/post-template.handlebars'), 'utf-8');
const compiledPostTemplate = handlebars.compile(postTemplate);

const essaysTemplate = fs.readFileSync(path.join(srcPath, 'essays/essays-template.handlebars'), 'utf-8');
const compiledessaysTemplate = handlebars.compile(essaysTemplate);

const postsPath = path.join(publicPath, 'posts');
const posts = fs.readdirSync(postsPath)
    .filter(file => file.endsWith('.json'))
    .map(file => {
        const data = JSON.parse(fs.readFileSync(path.join(postsPath, file), 'utf-8'));
        const html = compiledPostTemplate(data);
        const htmlFilename = file.replace('.json', '.html');
        fs.writeFileSync(path.join(postsPath, htmlFilename), html);

        return { ...data, filename: path.join('posts', htmlFilename) };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

const postsByYear = {};
posts.forEach(post => {
    const year = new Date(post.date).getFullYear();
    if (!postsByYear[year]) {
        postsByYear[year] = [];
    }
    postsByYear[year].push(post);
});

const essaysHtml = compiledessaysTemplate({ years: postsByYear });
fs.writeFileSync(path.join(publicPath, 'essays.html'), essaysHtml);
