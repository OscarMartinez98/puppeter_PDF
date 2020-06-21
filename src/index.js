const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const hbs = require('handlebars');
const puppeteer = require('puppeteer');

const data = require('./data.json');

const server = express();

server.use(express.static(path.join(__dirname, '../public')));

server.listen(3000, async() => {
    console.log('Server up');

    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const content = await compile('template', data);
        
        await page.setContent(content);
        await page.emulateMedia('screen');
        await page.pdf({
            path: 'test.pdf',
            format: 'letter',
            printBackground: true,
            margin: { top: "1cm", bottom: "1cm", left: "1cm", right: "1cm" }
        });
        await browser.close();
        console.log('Done :)');
    } catch (e) {
        console.log('Error: ', e);
    }
    process.exit();

});

const compile = async function(templateName, data) {
    const filePath = path.join(process.cwd(), 'public', `${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf-8');
    const content = hbs.compile(html)(data);
    return content;
};
